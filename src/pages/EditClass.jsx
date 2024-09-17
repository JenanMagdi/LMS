import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import { db, storage } from "../lib/Firebase";

function EditClass() {
  const { classId } = useParams();
  const { loggedInMail } = CustomUseContext();
  const [classData, setClassData] = useState({
    name: "",
    description: "",
    section: "",
    students: [], // Initialize as an empty array
    backgroundImage: "" // Added state for background image
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        // Fetch class data from the main `classes` collection
        const classRef = doc(db, "classes", classId);
        const classDoc = await getDoc(classRef);
        if (classDoc.exists()) {
          // Check if the user is the creator
          if (classDoc.data().createdBy === loggedInMail) {
            // Fetch students separately
            const studentsQuery = query(
              collection(db, "ClassesJoinedByUser"),
              where("classes", "array-contains", classId)
            );
            const studentsSnapshot = await getDocs(studentsQuery);

            // Update the students array
            const studentEmails = studentsSnapshot.docs.map(doc => doc.id);

            setClassData({
              ...classDoc.data(), // Include other fields from classDoc
              students: studentEmails // Maintain the list of students
            });
          } else {
            setError("You are not authorized to edit this class.");
          }
        } else {
          setError("Class not found.");
        }
      } catch (err) {
        console.error("Error fetching class data:", err);
        setError("Error fetching class data.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassData();
  }, [classId, loggedInMail]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setClassData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classRef = doc(db, "ClassesCreatedByUser", loggedInMail, "classes", classId);
      const generalClassRef = doc(db, "classes", classId);
  
      // Prepare updated data
      const updatedData = {
        name: classData.name,
        description: classData.description,
        section: classData.section,
        backgroundImage: classData.backgroundImage // Preserve the background image URL
      };
  
      // Upload image if a new file is selected
      if (imageFile) {
        const imageRef = ref(storage, `class-backgrounds/${classId}`);
        await uploadBytes(imageRef, imageFile);
        const url = await getDownloadURL(imageRef);
        updatedData.backgroundImage = url; // Update the URL in the class data
      }
  
      // Update class details in `ClassesCreatedByUser`
      await updateDoc(classRef, updatedData);
  
      // Update class details in the general `classes` collection
      await updateDoc(generalClassRef, updatedData);
  
      // Update class details in `ClassesJoinedByUser`
      if (classData.students.length > 0) {
        // Get the updated class data from the `classes` collection
        const updatedClassDoc = await getDoc(generalClassRef);
        const updatedClassData = updatedClassDoc.data();
        
        const studentEmails = updatedClassData.students;
        
        // Iterate through student emails and update their class data
        for (const studentEmail of studentEmails) {
          const studentClassRef = doc(db, "ClassesJoinedByUser", studentEmail, "classes", classId);
          await updateDoc(studentClassRef, {
            ...updatedData // Update the class data without touching the students array
          });
        }
      }
  
      alert("Class details updated successfully!");
      navigate(`/class/${classId}`);
    } catch (err) {
      console.error("Error updating class:", err);
      setError("Error updating class details.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Edit Class</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-6">
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold">Class Name</label>
          <input
            type="text"
            name="name"
            value={classData.name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold">Description</label>
          <textarea
            name="description"
            value={classData.description}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold">Section</label>
          <input
            type="text"
            name="section"
            value={classData.section}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-600 font-semibold">Background Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditClass;
