/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { CustomUseContext } from "../../context/context";
import { db, storage } from "../../lib/Firebase";

function ClassHomeworks({ classId, isClassCreator }) {
  const { loggedInMail } = CustomUseContext();
  const [homeworks, setHomeworks] = useState([]);
  const [newHomework, setNewHomework] = useState({
    title: "",
    description: "",
    file: null,
    deadline: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedHomeworkId, setExpandedHomeworkId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradeMap, setGradeMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extendHomeworkId, setExtendHomeworkId] = useState(null);
  const [newDeadline, setNewDeadline] = useState("");

  const fetchHomeworks = async () => {
    try {
      const q = query(collection(db, "classes", classId, "homeworks"));
      const homeworkSnapshot = await getDocs(q);
      const homeworkList = homeworkSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHomeworks(homeworkList);
    } catch (error) {
      console.error("Error fetching homeworks:", error);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, [classId]);

  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `homeworkFiles/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = null;
      if (newHomework.file) {
        fileUrl = await handleFileUpload(newHomework.file);
      }
      await addDoc(collection(db, "classes", classId, "homeworks"), {
        title: newHomework.title,
        description: newHomework.description,
        fileUrl,
        deadline: new Date(newHomework.deadline).toISOString(),
        creatorEmail: loggedInMail,
        createdAt: new Date(),
        submissions: [],
      });
      setNewHomework({ title: "", description: "", file: null, deadline: "" });
      setUploadProgress(0);
      setShowForm(false);
      fetchHomeworks();
    } catch (error) {
      console.error("Error creating homework:", error);
    }
  };

  const handleHomeworkSubmit = async (homeworkId, file) => {
    try {
      const homeworkRef = doc(db, "classes", classId, "homeworks", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);
      const deadline = new Date(homeworkDoc.data().deadline);
      const now = new Date();

      if (now > deadline) {
        alert("The deadline for this homework has passed. Submissions are closed.");
        return;
      }

      const fileUrl = await handleFileUpload(file);
      const submissions = homeworkDoc.data().submissions || [];
      const existingSubmissionIndex = submissions.findIndex(
        (submission) => submission.studentEmail === loggedInMail
      );

      if (existingSubmissionIndex !== -1) {
        submissions[existingSubmissionIndex] = {
          studentEmail: loggedInMail,
          fileUrl,
          submissionDate: new Date(),
          grade: submissions[existingSubmissionIndex].grade, // Preserve existing grade
        };
      } else {
        submissions.push({
          studentEmail: loggedInMail,
          fileUrl,
          submissionDate: new Date(),
          grade: null,
        });
      }

      await updateDoc(homeworkRef, { submissions });
      fetchHomeworks();
    } catch (error) {
      console.error("Error submitting homework:", error);
    }
  };

  const handleGradeSubmit = async (homeworkId, studentEmail, grade) => {
    try {
      const homeworkRef = doc(db, "classes", classId, "homeworks", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);
      const submissions = homeworkDoc.data().submissions || [];
      const updatedSubmissions = submissions.map((submission) =>
        submission.studentEmail === studentEmail
          ? { ...submission, grade }
          : submission
      );
      await updateDoc(homeworkRef, { submissions: updatedSubmissions });
      setGradeMap((prev) => ({
        ...prev,
        [`${homeworkId}-${studentEmail}`]: grade,
      }));
      fetchHomeworks();
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      const homeworkRef = doc(db, "classes", classId, "homeworks", homeworkId);
      await deleteDoc(homeworkRef);
      fetchHomeworks();
    } catch (error) {
      console.error("Error deleting homework:", error);
    }
  };

  const handleDeleteSubmission = async (homeworkId, studentEmail) => {
    try {
      const homeworkRef = doc(db, "classes", classId, "homeworks", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);
      const updatedSubmissions = homeworkDoc.data().submissions.filter(
        (submission) => submission.studentEmail !== studentEmail
      );
      await updateDoc(homeworkRef, { submissions: updatedSubmissions });
      fetchHomeworks();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const handleExtendDeadline = async () => {
    if (newDeadline && extendHomeworkId) {
      try {
        const homeworkRef = doc(db, "classes", classId, "homeworks", extendHomeworkId);
        const newDate = new Date(newDeadline);

        if (newDate > new Date()) { // Ensure the new deadline is in the future
          await updateDoc(homeworkRef, { deadline: newDate.toISOString() });
          setShowExtendForm(false);
          fetchHomeworks();
        } else {
          alert("The new deadline must be a future date.");
        }
      } catch (error) {
        console.error("Error extending deadline:", error);
      }
    }
  };

  return (
    <div className="p-6  min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Class Homeworks</h2>

      {isClassCreator && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Add Homework"}
        </button>
      )}

      {showForm && isClassCreator && (
        <form
          onSubmit={handleCreateHomework}
          className="mb-8 bg-white p-6 rounded shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Create New Homework</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Homework Title:</label>
            <input
              type="text"
              value={newHomework.title}
              onChange={(e) =>
                setNewHomework({ ...newHomework, title: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Homework Description:</label>
            <textarea
              value={newHomework.description}
              onChange={(e) =>
                setNewHomework({
                  ...newHomework,
                  description: e.target.value,
                })
              }
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Upload File:</label>
            <input
              type="file"
              onChange={(e) => setNewHomework({ ...newHomework, file: e.target.files[0] })}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Deadline:</label>
            <input
              type="datetime-local"
              value={newHomework.deadline}
              onChange={(e) =>
                setNewHomework({ ...newHomework, deadline: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
          >
            {uploadProgress === 100 ? "Created" : `Create (${uploadProgress}%)`}
          </button>
        </form>
      )}

      {homeworks.length === 0 && <p>No homeworks available.</p>}

      {homeworks.map((homework) => (
        <div key={homeworks.id} className="bg-white p-6 rounded shadow-md mb-4">
          <h3 className="text-xl font-semibold mb-2">{homeworks.title}</h3>
          <p className="text-gray-700 mb-4">{homeworks.description}</p>
          {homework.fileUrl && (
            <a
              href={homework.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Download Homework File
            </a>
          )}
          <p className="text-gray-500 mb-2">
            Deadline: {new Date(homework.deadline).toLocaleString()}
          </p>

          {!isClassCreator && (
            <div className="mb-4">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="border rounded w-full py-2 px-3 mb-2"
              />
              <button
                onClick={() => selectedFile && handleHomeworkSubmit(homework.id, selectedFile)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit Homework
              </button>
            </div>
          )}

          {isClassCreator && (
            <>
              <button
                onClick={() => {
                  setExtendHomeworkId(homework.id);
                  setShowExtendForm(true);
                }}
                className="bg-yellow-500 text-white py-2 px-4 rounded mr-2 hover:bg-yellow-600"
              >
                Extend Deadline
              </button>
              <button
                onClick={() => handleDeleteHomework(homework.id)}
                className="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-600"
              >
                Delete Homework
              </button>
            </>
          )}

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Submissions</h4>
            {(isClassCreator ? homework.submissions : homework.submissions?.filter(
              (submission) => submission.studentEmail === loggedInMail
            )).map((submission) => (
              <div
                key={submission.studentEmail}
                className="border-b border-gray-300 py-2"
              >
                <p className="font-medium">{submission.studentEmail}</p>
                <p className="text-gray-500">
                  Submitted on: {submission.submissionDate ? new Date(submission.submissionDate).toLocaleString() : "Not submitted"}
                </p>
                {submission.fileUrl && (
                  <a
                    href={submission.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Download Submission File
                  </a>
                )}
                {isClassCreator && (
                  <>
                    <input
                      type="number"
                      placeholder="Grade (0-100)"
                      value={gradeMap[`${homework.id}-${submission.studentEmail}`] || ''}
                      onChange={(e) =>
                        setGradeMap((prev) => ({
                          ...prev,
                          [`${homework.id}-${submission.studentEmail}`]: e.target.value,
                        }))
                      }
                      className="border rounded w-full py-2 px-3 mb-2"
                    />
                    <button
                      onClick={() =>
                        handleGradeSubmit(
                          homework.id,
                          submission.studentEmail,
                          gradeMap[`${homework.id}-${submission.studentEmail}`]
                        )
                      }
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Grade Submission
                    </button>
                    <button
                      onClick={() => handleDeleteSubmission(homework.id, submission.studentEmail)}
                      className="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-600"
                    >
                      Delete Submission
                    </button>
                  </>
                )}
                {submission.grade != null && (
                  <p className="text-gray-700 mt-2">Grade: {submission.grade}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {showExtendForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-1/3">
            <h3 className="text-xl font-semibold mb-4">Extend Deadline</h3>
            <input
              type="datetime-local"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
              className="border rounded w-full py-2 px-3 mb-4"
              required
            />
            <button
              onClick={handleExtendDeadline}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Extend Deadline
            </button>
            <button
              onClick={() => setShowExtendForm(false)}
              className="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClassHomeworks;
