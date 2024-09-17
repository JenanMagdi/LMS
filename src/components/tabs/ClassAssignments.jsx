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

function ClassAssignments({ classId, isClassCreator }) {
  const { loggedInMail } = CustomUseContext();
  const [assignments, setAssignments] = useState([]);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    file: null,
    deadline: "",
  });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedAssignmentId, setExpandedAssignmentId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradeMap, setGradeMap] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [showExtendForm, setShowExtendForm] = useState(false);
  const [extendAssignmentId, setExtendAssignmentId] = useState(null);
  const [newDeadline, setNewDeadline] = useState("");

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, "classes", classId, "assignments"));
      const assignmentSnapshot = await getDocs(q);
      const assignmentList = assignmentSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAssignments(assignmentList);
    } catch (error) {
      console.error("Error fetching assignments:", error);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, [classId]);

  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `assignmentFiles/${file.name}`);
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

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = null;
      if (newAssignment.file) {
        fileUrl = await handleFileUpload(newAssignment.file);
      }
      await addDoc(collection(db, "classes", classId, "assignments"), {
        title: newAssignment.title,
        description: newAssignment.description,
        fileUrl,
        deadline: new Date(newAssignment.deadline).toISOString(),
        creatorEmail: loggedInMail,
        createdAt: new Date(),
        submissions: [],
      });
      setNewAssignment({ title: "", description: "", file: null, deadline: "" });
      setUploadProgress(0);
      setShowForm(false);
      fetchAssignments();
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  const handleAssignmentSubmit = async (assignmentId, file) => {
    try {
      const assignmentRef = doc(db, "classes", classId, "assignments", assignmentId);
      const assignmentDoc = await getDoc(assignmentRef);
      const deadline = new Date(assignmentDoc.data().deadline);
      const now = new Date();

      if (now > deadline) {
        alert("The deadline for this assignment has passed. Submissions are closed.");
        return;
      }

      const fileUrl = await handleFileUpload(file);
      const submissions = assignmentDoc.data().submissions || [];
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

      await updateDoc(assignmentRef, { submissions });
      fetchAssignments();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  const handleGradeSubmit = async (assignmentId, studentEmail, grade) => {
    try {
      const assignmentRef = doc(db, "classes", classId, "assignments", assignmentId);
      const assignmentDoc = await getDoc(assignmentRef);
      const submissions = assignmentDoc.data().submissions || [];
      const updatedSubmissions = submissions.map((submission) =>
        submission.studentEmail === studentEmail
          ? { ...submission, grade }
          : submission
      );
      await updateDoc(assignmentRef, { submissions: updatedSubmissions });
      setGradeMap((prev) => ({
        ...prev,
        [`${assignmentId}-${studentEmail}`]: grade,
      }));
      fetchAssignments();
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const assignmentRef = doc(db, "classes", classId, "assignments", assignmentId);
      await deleteDoc(assignmentRef);
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleDeleteSubmission = async (assignmentId, studentEmail) => {
    try {
      const assignmentRef = doc(db, "classes", classId, "assignments", assignmentId);
      const assignmentDoc = await getDoc(assignmentRef);
      const updatedSubmissions = assignmentDoc.data().submissions.filter(
        (submission) => submission.studentEmail !== studentEmail
      );
      await updateDoc(assignmentRef, { submissions: updatedSubmissions });
      fetchAssignments();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  const handleExtendDeadline = async () => {
    if (newDeadline && extendAssignmentId) {
      try {
        const assignmentRef = doc(db, "classes", classId, "assignments", extendAssignmentId);
        const newDate = new Date(newDeadline);

        if (newDate > new Date()) { // Ensure the new deadline is in the future
          await updateDoc(assignmentRef, { deadline: newDate.toISOString() });
          setShowExtendForm(false);
          fetchAssignments();
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
      <h2 className="text-2xl font-bold mb-4">Class Assignments</h2>

      {isClassCreator && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-600"
        >
          {showForm ? "Cancel" : "Add Assignment"}
        </button>
      )}

      {showForm && isClassCreator && (
        <form
          onSubmit={handleCreateAssignment}
          className="mb-8 bg-white p-6 rounded shadow-md"
        >
          <h3 className="text-xl font-semibold mb-4">Create New Assignment</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Assignment Title:</label>
            <input
              type="text"
              value={newAssignment.title}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, title: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Assignment Description:</label>
            <textarea
              value={newAssignment.description}
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
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
              onChange={(e) => setNewAssignment({ ...newAssignment, file: e.target.files[0] })}
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Deadline:</label>
            <input
              type="datetime-local"
              value={newAssignment.deadline}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, deadline: e.target.value })
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

      {assignments.length === 0 && <p>No assignments available.</p>}

      {assignments.map((assignment) => (
        <div key={assignment.id} className="bg-white p-6 rounded shadow-md mb-4">
          <h3 className="text-xl font-semibold mb-2">{assignment.title}</h3>
          <p className="text-gray-700 mb-4">{assignment.description}</p>
          {assignment.fileUrl && (
            <a
              href={assignment.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              Download Assignment File
            </a>
          )}
          <p className="text-gray-500 mb-2">
            Deadline: {new Date(assignment.deadline).toLocaleString()}
          </p>

          {!isClassCreator && (
            <div className="mb-4">
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files[0])}
                className="border rounded w-full py-2 px-3 mb-2"
              />
              <button
                onClick={() => selectedFile && handleAssignmentSubmit(assignment.id, selectedFile)}
                className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Submit Assignment
              </button>
            </div>
          )}

          {isClassCreator && (
            <>
              <button
                onClick={() => {
                  setExtendAssignmentId(assignment.id);
                  setShowExtendForm(true);
                }}
                className="bg-yellow-500 text-white py-2 px-4 rounded mr-2 hover:bg-yellow-600"
              >
                Extend Deadline
              </button>
              <button
                onClick={() => handleDeleteAssignment(assignment.id)}
                className="bg-red-500 text-white py-2 px-4 rounded ml-2 hover:bg-red-600"
              >
                Delete Assignment
              </button>
            </>
          )}

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Submissions</h4>
            {(isClassCreator ? assignment.submissions : assignment.submissions?.filter(
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
                      value={gradeMap[`${assignment.id}-${submission.studentEmail}`] || ''}
                      onChange={(e) =>
                        setGradeMap((prev) => ({
                          ...prev,
                          [`${assignment.id}-${submission.studentEmail}`]: e.target.value,
                        }))
                      }
                      className="border rounded w-full py-2 px-3 mb-2"
                    />
                    <button
                      onClick={() =>
                        handleGradeSubmit(
                          assignment.id,
                          submission.studentEmail,
                          gradeMap[`${assignment.id}-${submission.studentEmail}`]
                        )
                      }
                      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                    >
                      Grade Submission
                    </button>
                    <button
                      onClick={() => handleDeleteSubmission(assignment.id, submission.studentEmail)}
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

export default ClassAssignments;
