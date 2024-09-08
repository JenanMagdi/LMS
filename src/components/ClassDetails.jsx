import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc, getDoc } from "firebase/firestore";
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

        const createdClassRef = doc(db, "CreatedClasses", userEmail, "classes", classId);
        const createdClassDoc = await getDoc(createdClassRef);

        if (createdClassDoc.exists()) {
          setClassData({ ...createdClassDoc.data(), isCreator: true });
        } else {
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
        const classRef = doc(db, "CreatedClasses", loggedInMail, "classes", classId);
        await deleteDoc(classRef);
      } else {
        const classRef = doc(db, "JoinedClasses", loggedInMail, "classes", classId);
        await deleteDoc(classRef);
      }
      alert("Class deleted successfully!");
      navigate('/home');
    } catch (error) {
      setError("Error deleting class.");
      console.error("Error deleting class:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Class Details</h1>
      {classData && (
        <div className="bg-white shadow-md rounded-lg border border-gray-200 p-6">
          <h2 className="text-2xl font-semibold">{classData.className}</h2>
          <p className="mt-2">{classData.description}</p>
          {classData.isCreator && (
            <button 
              className="mt-4 bg-red-600 text-white p-2 rounded"
              onClick={handleDeleteClass}
            >
              Delete Class
            </button>
          )}
          <ClassAnnouncements classId={classId} />
        </div>
      )}
    </div>
  );
}

export default ClassDetails;
