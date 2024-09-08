import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import { db } from "../lib/Firebase";

function EditClass() {
  const { classId } = useParams(); 
  const { loggedInMail } = CustomUseContext();
  const [classData, setClassData] = useState({
    className: "",
    description: "",
    subject: "",
    section: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const classRef = doc(db, "CreatedClasses", loggedInMail, "classes", classId);
        const classDoc = await getDoc(classRef);
        if (classDoc.exists()) {
          setClassData(classDoc.data());
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const classRef = doc(db, "CreatedClasses", loggedInMail, "classes", classId);
      await updateDoc(classRef, classData);
      alert("Class details updated successfully!");
      navigate(`/class-details/${classId}`);
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
            name="className"
            value={classData.className}
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
          <label className="block text-gray-600 font-semibold">Subject</label>
          <input
            type="text"
            name="subject"
            value={classData.subject}
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
