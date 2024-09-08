import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CustomUseContext } from "../context/context";
import { auth, db } from "../lib/Firebase";
import ClassAnnouncements from "./Classes/ClassAnnouncements";
import ClassAssignments from "./Classes/ClassAssignments";
import ClassQuizzes from "./Classes/ClassQuizzes";
import ClassTasks from "./Classes/ClassTasks";

function ClassDetails() {
  const { classId } = useParams();
  const { loggedInUser, setLoggedInUser, loggedInMail } = CustomUseContext();
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState("announcements"); // لإدارة التبويب النشط

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
        const createdClassRef = doc(
          db,
          "CreatedClasses",
          userEmail,
          "classes",
          classId
        );
        const createdClassDoc = await getDoc(createdClassRef);

        if (createdClassDoc.exists()) {
          setClassData({ ...createdClassDoc.data(), isCreator: true });
        } else {
          // Fetch class from JoinedClasses if not found in CreatedClasses
          const joinedClassRef = doc(
            db,
            "JoinedClasses",
            userEmail,
            "classes",
            classId
          );
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
        const classRef = doc(
          db,
          "CreatedClasses",
          loggedInMail,
          "classes",
          classId
        );
        await deleteDoc(classRef);

        // Remove the class from all joined users
        const q = query(
          collection(db, "JoinedClasses"),
          where("classId", "==", classId)
        );
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach(async (docSnapshot) => {
          await deleteDoc(
            doc(db, "JoinedClasses", docSnapshot.id, "classes", classId)
          );
        });
      } else {
        // User joined the class, remove only for the user
        const joinedClassRef = doc(
          db,
          "JoinedClasses",
          loggedInMail,
          "classes",
          classId
        );
        await deleteDoc(joinedClassRef);
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
    <div className="p-1 bg-gray-50">
      <div className="  bg-white shadow-md rounded-lg border border-gray-200 p-6">
        <div className="  bg-blue-200 shadow-md rounded-lg border border-gray-200 p-6">
          <h1 className="text-5xl font-bold text-center text-blue-600 mb-6">
            {classData.className}
          </h1>

          <div className=" flex justify-between  re">
            <div className=" w-full relative ">
              <FontAwesomeIcon
                className="text-2xl   text-gray-700   "
                onClick={() => setShowDetails(!showDetails)}
                icon={faInfoCircle}
              />
              {showDetails ? (
                <div className="text-sm group bg-blue-100 rounded-lg p-2 absolute ">
                  <p className="text-gray-600 mb-2">
                    <strong>Class Description:</strong>{" "}
                    {classData.description || "No description available"}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Section:</strong> {classData.section}
                  </p>
                  <p className="text-gray-600 mb-2">
                    <strong>Code:</strong> {classData.id}
                  </p>
                </div>
              ) : null}
            </div>
            <div className="   ">
              <button
                onClick={handleDeleteClass}
                className="bg-red-500 text-white w-16 px-2 py-1.5 rounded hover:bg-red-600 mx-3"
              >
                {classData.isCreator ? "Delete" : "Leave"}
              </button>
              {classData.isCreator && (
                <button
                  onClick={() => navigate(`/editclass/${classId}`)}
                  className="bg-blue-500 text-white w-16 px-2 py-1.5 rounded hover:bg-blue-600 mx-3"
                >
                  Edit
                </button>
              )}
            </div>
          </div>
        </div>

        <div>
          {/* Tabs */}
          <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
            <li
              className={`inline-block p-4 cursor-pointer ${
                activeTab === "announcements"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : ""
              }`}
              onClick={() => setActiveTab("announcements")}
            >
              Announcements
            </li>
            <li
              className={`inline-block p-4 cursor-pointer ${
                activeTab === "assignments"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : ""
              }`}
              onClick={() => setActiveTab("assignments")}
            >
              Assignments
            </li>
            <li
              className={`inline-block p-4 cursor-pointer ${
                activeTab === "quizzes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : ""
              }`}
              onClick={() => setActiveTab("quizzes")}
            >
              Quizzes
            </li>
            <li
              className={`inline-block p-4 cursor-pointer ${
                activeTab === "tasks" ? "text-blue-600 border-b-2 border-blue-600" : ""
              }`}
              onClick={() => setActiveTab("tasks")}
            >
              Tasks
            </li>
          </ul>

          {/* Tab Content */}
          <div className="tab-content mt-4">
            {activeTab === "announcements" && (
              <ClassAnnouncements classId={classId} />
            )}
            {activeTab === "assignments" && (
              <ClassAssignments classId={classId} isClassCreator={classData.isCreator} />
            )}
            {activeTab === "quizzes" && (
              <ClassQuizzes classId={classId} isClassCreator={classData.isCreator} />
            )}
            {activeTab === "tasks" && (
              <ClassTasks classId={classId} isClassCreator={classData.isCreator} />
            )}
          </div>
        </div>
      </div>
      <button 
      onClick={() => {
        navigate(`/studentdashboard/${classId}`)
        }}
        >Student Dashboard</button>
        <button
        onClick={() => {
          navigate(`/teacherdashboard/${classId}`)
          }}
          >Teacher Dashboard</button>
    </div>
  );
}

export default ClassDetails;
