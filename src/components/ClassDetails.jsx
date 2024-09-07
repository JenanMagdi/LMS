import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import { auth, db } from "../lib/Firebase";

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

        // أولاً جلب بيانات الفصول التي أنشأها المستخدم
        const createdClassRef = doc(db, "CreatedClasses", userEmail, "classes", classId);
        const createdClassDoc = await getDoc(createdClassRef);

        if (createdClassDoc.exists()) {
          setClassData(createdClassDoc.data());
        } else {
          // إذا لم يكن الفصل في CreatedClasses، ابحث في JoinedClasses
          const joinedClassRef = doc(db, "JoinedClasses", userEmail, "classes", classId);
          const joinedClassDoc = await getDoc(joinedClassRef);

          if (joinedClassDoc.exists()) {
            setClassData(joinedClassDoc.data());
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
        <div className="mt-4 flex justify-end">
        <button
        onClick={() => navigate(`/edit-class/${classId}`)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
  Edit Class
</button>
        </div>
      </div>
    </div>
  );
}

export default ClassDetails;
