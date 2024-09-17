import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged } from "firebase/auth";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ClassAnnouncements from "../components/tabs/ClassAnnouncements";
import ClassAssignments from "../components/tabs/ClassAssignments";
import ClassHomeworks from "../components/tabs/ClassHomeworks";
import ClassQuizzes from "../components/tabs/ClassQuizzes";
import { CustomUseContext } from "../context/context";
import { auth, db } from "../lib/Firebase";

function ClassDetails() {
  const { classId } = useParams();
  const { loggedInUser, setLoggedInUser, loggedInMail } = CustomUseContext();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("announcements");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        if (!loggedInMail) {
          setError("No email found for the user");
          setLoading(false);
          return;
        }

        // Fetch class data
        const classRef = doc(db, "classes", classId);
        const classDoc = await getDoc(classRef);

        if (classDoc.exists()) {
          const classData = classDoc.data();

          // Check if the user is the creator
          const isCreator = classData.createdBy === loggedInMail;

          setClassData({ id: classId, ...classData, isCreator });
        } else {
          setError("Class not found.");
        }
      } catch (error) {
        setError("Error fetching class data.");
        console.error(error);
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
      if (!classData) {
        console.error("Class data is not available");
        return;
      }

      if (classData.isCreator) {
        // If the user is the creator, delete the class completely
        const classRef = doc(db, "classes", classId);
        const classDoc = await getDoc(classRef);

        if (!classDoc.exists()) {
          console.error("Class not found");
          return;
        }

        const classData = classDoc.data();
        const students = classData.students || [];

        // Delete class from the 'classes' collection
        await deleteDoc(classRef);

        // Delete class from 'ClassesCreatedByUser' for the creator
        const createdClassRef = doc(db, "ClassesCreatedByUser", classData.createdBy, "classes", classId);
        await deleteDoc(createdClassRef);

        // Delete class from 'ClassesJoinedByUser' for all students
        await Promise.all(students.map(async (studentEmail) => {
          const joinedClassRef = doc(db, "ClassesJoinedByUser", studentEmail, "classes", classId);
          await deleteDoc(joinedClassRef);
        }));

        console.log("Class deleted successfully");
        navigate("/home");
      } else {
        // If the user is a student, remove the class from their list only
        const studentClassRef = doc(db, "ClassesJoinedByUser", loggedInMail, "classes", classId);
        await deleteDoc(studentClassRef);

        // Optionally, you can also remove the user from the class document if needed
        const classRef = doc(db, "classes", classId);
        const classDoc = await getDoc(classRef);
        if (classDoc.exists()) {
          const classData = classDoc.data();
          const students = classData.students || [];
          const updatedStudents = students.filter(email => email !== loggedInMail);
          await updateDoc(classRef, { students: updatedStudents });
        }

        console.log("Class left successfully");
        navigate("/home");
      }
    } catch (error) {
      console.error("Error handling class deletion:", error);
    }
  };

  if (loading) return <div className="text-center text-gray-700">Loading...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!classData) return <div className="text-center text-gray-700">No class data available.</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-gray-50 min-h-screen">
      <div
        className={`relative h-48 sm:h-64 rounded-lg mb-6 sm:mb-8 ${classData?.backgroundImage ? 'bg-cover bg-center' : 'bg-blue-500'}`}
        style={classData?.backgroundImage ? { backgroundImage: `url(${classData.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
      >
        {!classData?.backgroundImage && (
          <div className="absolute inset-0 bg-blue-500 opacity-50 rounded-lg"></div>
        )}
        <div className="relative p-4 sm:p-6 flex flex-col justify-between h-full">
          <div className="flex flex-row sm:flex-row items-start sm:justify-between sm:items-center justify-between">
            <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4 sm:mb-0">{classData.name}</h1>
            <div className="relative">
              <FontAwesomeIcon
                className="text-xl sm:text-2xl text-white cursor-pointer"
                onClick={() => setShowDetails(!showDetails)}
                icon={faInfoCircle}
              />
              {showDetails && (
                <div className="absolute right-0 bg-white border border-blue-300 rounded-lg p-4 mt-2 w-64 shadow-lg">
                  <p className="text-blue-800 mb-2">
                    <strong>Description:</strong> {classData.description || "No description available"}
                  </p>
                  <p className="text-blue-800 mb-2">
                    <strong>Section:</strong> {classData.section}
                  </p>
                  <p className="text-blue-800">
                    <strong>Code:</strong> {classData.code}
                  </p>
                </div>
              )}
            </div>
          </div>
          <div className="mt-auto flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleDeleteClass}
              className="bg-red-600 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-md hover:bg-red-700 transition duration-200"
            >
              {classData.isCreator ? "Delete Class" : "Leave Class"}
            </button>
            {classData.isCreator && (
              <button
                onClick={() => navigate(`/editclass/${classId}`)}
                className="bg-blue-700 text-white px-4 py-2 sm:px-6 sm:py-3 rounded-lg shadow-md hover:bg-blue-800 transition duration-200"
              >
                Edit Class
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-6 sm:mt-8">
        <div className="border-b border-gray-300">
          <div className="flex flex-wrap">
            {["announcements", "assignments", "quizzes", "homeworks"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-4 sm:px-6 text-sm sm:text-base font-medium transition duration-300 ${
                  activeTab === tab
                    ? "text-blue-700 border-b-2 border-blue-700"
                    : "text-gray-500"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-4 sm:mt-5">
        {activeTab === "announcements" && <ClassAnnouncements classId={classId} isClassCreator={classData.isCreator} />}
        {activeTab === "assignments" && <ClassAssignments classId={classId} isClassCreator={classData.isCreator} />}
        {activeTab === "quizzes" && <ClassQuizzes classId={classId} isClassCreator={classData.isCreator} />}
        {activeTab === "homeworks" && <ClassHomeworks classId={classId} isClassCreator={classData.isCreator} />}
      </div>
    </div>
  );
}

export default ClassDetails;
