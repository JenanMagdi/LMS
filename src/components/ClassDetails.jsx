import { onAuthStateChanged } from "firebase/auth";
import { collection, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import { auth, db } from "../lib/Firebase";
import ClassAnnouncements from "./Classes/ClassAnnouncements";

function ClassDetails() {
  const { classId } = useParams();
  const { loggedInUser, setLoggedInUser, loggedInMail } = CustomUseContext();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const userEmail = loggedInMail;
        if (!userEmail) {
          setError("No email found for the user");
          setLoading(false);
          return;
        }

        // Fetch class from CreatedClasses first
        const createdClassRef = doc(db, "CreatedClasses", userEmail, "classes", classId);
        const createdClassDoc = await getDoc(createdClassRef);

        if (createdClassDoc.exists()) {
          setClassData({ ...createdClassDoc.data(), isCreator: true });
        } else {
          // Fetch class from JoinedClasses if not found in CreatedClasses
          const joinedClassRef = doc(db, "JoinedClasses", userEmail, "classes", classId);
          const joinedClassDoc = await getDoc(joinedClassRef);

          if (joinedClassDoc.exists()) {
            setClassData({ ...joinedClassDoc.data(), isCreator: false });
          } else {
            setError("Class not found.");
          }
        }
      } catch (error) {
        setError("Error fetching class data.");
        console.error("Error fetching class data:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedInUser(user);
        fetchClassData();
      } else {
        setError("User is not logged in");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [classId, loggedInUser, setLoggedInUser, loggedInMail]);

  const handleDeleteClass = async () => {
    try {
      if (classData.isCreator) {
        // User is the creator, delete the class from all users
        const classRef = doc(db, "CreatedClasses", loggedInMail, "classes", classId);
        await deleteDoc(classRef);

        // Remove the class from all joined users
        const q = query(collection(db, "JoinedClasses"), where("classId", "==", classId));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(doc(db, "JoinedClasses", docSnapshot.id, "classes", classId));
        });

        console.log("Class deleted for all users.");
      } else {
        // User joined the class, remove only for the user
        const joinedClassRef = doc(db, "JoinedClasses", loggedInMail, "classes", classId);
        await deleteDoc(joinedClassRef);
        console.log("You have left the class.");
      }

      // Redirect to the home page after deletion
      navigate("/home");
    } catch (error) {
      console.error("Error deleting class:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!classData) return <div>No class data available.</div>;

  return (
    <div className="p-6 bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">{classData.className}</h1>
      <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg border border-gray-200 p-6">
        <p className="text-gray-600 mb-4">
          <strong>Description:</strong> {classData.description || "No description available"}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Subject:</strong> {classData.subject}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Section:</strong> {classData.section}
        </p>




      <ClassAnnouncements classId={classId} />


        <div className="mt-4 flex justify-end space-x-4">
          <button
            onClick={() => navigate(`/edit-class/${classId}`)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Edit Class
          </button>
          <button
            onClick={handleDeleteClass}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            {classData.isCreator ? "Delete Class" : "Leave Class"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails;
