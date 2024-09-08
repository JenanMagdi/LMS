/* eslint-disable react-hooks/exhaustive-deps */
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
  const [gradeMap, setGradeMap] = useState({}); // Track grades for each submission
  const [showForm, setShowForm] = useState(false);

  const fetchAssignments = async () => {
    try {
      const q = query(collection(db, "Classes", classId, "assignments"));
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
  }, [classId, gradeMap]);

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

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleCreateAssignment = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = null;
      if (newAssignment.file) {
        fileUrl = await handleFileUpload(newAssignment.file);
      }
      await addDoc(collection(db, "Classes", classId, "assignments"), {
        title: newAssignment.title,
        description: newAssignment.description,
        fileUrl,
        deadline: newAssignment.deadline,
        creatorEmail: loggedInMail,
        createdAt: new Date(),
        submissions: [],
      });
      await fetchAssignments();
      setNewAssignment({
        title: "",
        description: "",
        file: null,
        deadline: "",
      });
      setUploadProgress(0);
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error creating assignment:", error);
    }
  };

  const handleAssignmentSubmit = async (assignmentId, file) => {
    try {
      const fileUrl = await handleFileUpload(file);
      const assignmentRef = doc(
        db,
        "Classes",
        classId,
        "assignments",
        assignmentId
      );
      const assignmentDoc = await getDoc(assignmentRef);
      const submissions = assignmentDoc.data().submissions || [];
      const updatedSubmissions = [
        ...submissions,
        { studentEmail: loggedInMail, fileUrl, submissionDate: new Date() },
      ];
      await updateDoc(assignmentRef, { submissions: updatedSubmissions });
      await fetchAssignments();
    } catch (error) {
      console.error("Error submitting assignment:", error);
    }
  };

  const handleGradeSubmit = async (assignmentId, studentEmail, grade) => {
    try {
      const assignmentRef = doc(
        db,
        "Classes",
        classId,
        "assignments",
        assignmentId
      );
      const assignmentDoc = await getDoc(assignmentRef);
      const submissions = assignmentDoc.data().submissions || [];
      const updatedSubmissions = submissions.map((submission) =>
        submission.studentEmail === studentEmail
          ? { ...submission, grade: grade }
          : submission
      );
      await updateDoc(assignmentRef, { submissions: updatedSubmissions });
      await fetchAssignments();
      setGradeMap((prev) => ({
        ...prev,
        [`${assignmentId}-${studentEmail}`]: grade,
      }));
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      const assignmentRef = doc(
        db,
        "Classes",
        classId,
        "assignments",
        assignmentId
      );
      await deleteDoc(assignmentRef);
      await fetchAssignments();
    } catch (error) {
      console.error("Error deleting assignment:", error);
    }
  };

  const handleDeleteSubmission = async (assignmentId, studentEmail) => {
    try {
      const assignmentRef = doc(
        db,
        "Classes",
        classId,
        "assignments",
        assignmentId
      );
      const assignmentDoc = await getDoc(assignmentRef);
      const updatedSubmissions = assignmentDoc
        .data()
        .submissions.filter(
          (submission) => submission.studentEmail !== studentEmail
        );
      await updateDoc(assignmentRef, { submissions: updatedSubmissions });
      await fetchAssignments();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
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
            <label className="block text-gray-700 font-medium mb-2">
              Assignment Title:
            </label>
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
            <label className="block text-gray-700 font-medium mb-2">
              Assignment Description:
            </label>
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
            <label className="block text-gray-700 font-medium mb-2">
              Upload File:
            </label>
            <input
              type="file"
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, file: e.target.files[0] })
              }
              className="border rounded w-full py-2 px-3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Deadline:
            </label>
            <input
              type="date"
              value={newAssignment.deadline}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, deadline: e.target.value })
              }
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          {uploadProgress > 0 && (
            <div className="mb-4">
              <progress value={uploadProgress} max="100" className="w-full" />
            </div>
          )}
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Assignment
          </button>
        </form>
      )}

      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="mb-4 bg-white p-6 rounded shadow-md"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{assignment.title}</h3>
            <button
              onClick={() =>
                setExpandedAssignmentId(
                  expandedAssignmentId === assignment.id ? null : assignment.id
                )
              }
              className="text-blue-500 hover:underline"
            >
              {expandedAssignmentId === assignment.id
                ? "Hide Details"
                : "Show Details"}
            </button>
            {isClassCreator && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteAssignment(assignment.id)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          {expandedAssignmentId === assignment.id && (
            <div>
              <p className="mt-2">{assignment.description}</p>
              {assignment.fileUrl && (
                <div className="mt-2">
                  <a
                    href={assignment.fileUrl}
                    className="text-blue-500 hover:underline"
                    download
                  >
                    Download File
                  </a>
                </div>
              )}
              <p className="mt-2">
                <strong>Deadline:</strong> {assignment.deadline}
              </p>
              <p className="mt-2">
                <strong>Created By:</strong> {assignment.creatorEmail}
              </p>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Submissions</h4>
                {assignment.submissions && assignment.submissions.length > 0 ? (
                  assignment.submissions.map((submission) => (
                    <div
                      key={submission.studentEmail}
                      className="bg-gray-100 p-4 rounded mb-2"
                    >
                      <p>
                        <strong>Student Email:</strong>{" "}
                        {submission.studentEmail}
                      </p>
                      <a
                        href={submission.fileUrl}
                        className="text-blue-500 hover:underline"
                        download
                      >
                        Download Submission
                      </a>
                      <p className="mt-2">
                        <strong>Submitted On:</strong>{" "}
                        {submission.submissionDate.toDate().toDateString()}
                      </p>
                      {isClassCreator && (
                        <div className="flex items-center mt-2">
                          <label className="mr-2">Grade:</label>
                          <input
                            type="number"
                            value={
                              gradeMap[
                                `${assignment.id}-${submission.studentEmail}`
                              ] ||
                              submission.grade ||
                              ""
                            }
                            onChange={(e) =>
                              setGradeMap((prev) => ({
                                ...prev,
                                [`${assignment.id}-${submission.studentEmail}`]:
                                  e.target.value,
                              }))
                            }
                            className="border rounded py-1 px-2"
                          />
                          <button
                            onClick={() =>
                              handleGradeSubmit(
                                assignment.id,
                                submission.studentEmail,
                                gradeMap[
                                  `${assignment.id}-${submission.studentEmail}`
                                ] || submission.grade
                              )
                            }
                            className="bg-blue-500 text-white py-1 px-3 rounded ml-2"
                          >
                            Submit Grade
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteSubmission(
                                assignment.id,
                                submission.studentEmail
                              )
                            }
                            className="bg-red-500 text-white py-1 px-3 rounded ml-2"
                          >
                            Delete Submission
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p>No submissions yet.</p>
                )}
              </div>
              {!isClassCreator && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (selectedFile) {
                      handleAssignmentSubmit(assignment.id, selectedFile);
                    }
                  }}
                  className="mt-4"
                >
                  <label className="block mb-2">Submit Assignment:</label>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="border rounded py-2 px-3 mb-2"
                  />
                  <button
                    type="submit"
                    className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  >
                    Submit
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClassAssignments;
