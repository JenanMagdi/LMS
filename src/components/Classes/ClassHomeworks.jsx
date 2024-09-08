/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import { CustomUseContext } from "../../context/context";
import { db, storage } from "../../lib/Firebase";

function ClassHomeworks({ classId, isClassCreator }) {
  const { loggedInMail } = CustomUseContext();
  const [homeworks, setHomeworks] = useState([]);
  const [newHomework, setNewHomework] = useState({ title: "", description: "", file: null, deadline: "" });
  const [uploadProgress, setUploadProgress] = useState(0);
  const [expandedHomeworkId, setExpandedHomeworkId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [gradeMap, setGradeMap] = useState({}); // Track grades for each submission
  const [showForm, setShowForm] = useState(false);
  const fetchHomeworks = async () => {
    try {
      const q = query(collection(db, "Classes", classId, "homeworks"));
      const homeworkSnapshot = await getDocs(q);
      const homeworkList = homeworkSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setHomeworks(homeworkList);
    } catch (error) {
      console.error("Error fetching homeworks:", error);
    }
  };

  useEffect(() => {
    fetchHomeworks();
  }, [classId,gradeMap]);

  const handleFileUpload = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `homeworkFiles/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
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

  const handleCreateHomework = async (e) => {
    e.preventDefault();
    try {
      let fileUrl = null;
      if (newHomework.file) {
        fileUrl = await handleFileUpload(newHomework.file);
      }
      await addDoc(collection(db, "Classes", classId, "homeworks"), {
        title: newHomework.title,
        description: newHomework.description,
        fileUrl,
        deadline: newHomework.deadline,
        creatorEmail: loggedInMail,
        createdAt: new Date(),
        submissions: [],
      });
      // Refresh the list of homeworks
      await fetchHomeworks();
      setNewHomework({ title: "", description: "", file: null, deadline: "" });
      setUploadProgress(0);
      setShowForm(false); // Hide form after submission
    } catch (error) {
      console.error("Error creating homework:", error);
    }
  };

  const handleHomeworkSubmit = async (homeworkId, file) => {
    try {
      const fileUrl = await handleFileUpload(file);
      const homeworkRef = doc(db, "Classes", classId, "homeworks", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);
      const submissions = homeworkDoc.data().submissions || [];
      const updatedSubmissions = [...submissions, { studentEmail: loggedInMail, fileUrl, submissionDate: new Date() }];
      await updateDoc(homeworkRef, { submissions: updatedSubmissions });
      // Refresh the list of homeworks
      await fetchHomeworks();
    } catch (error) {
      console.error("Error submitting homework:", error);
    }
  };

  const handleGradeSubmit = async (homeworkId, studentEmail, grade) => {
    try {
      const homeworkRef = doc(db, "Classes", classId, "homeworks", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);
      const submissions = homeworkDoc.data().submissions || [];
      const updatedSubmissions = submissions.map(submission =>
        submission.studentEmail === studentEmail ? { ...submission, grade: grade } : submission
      );
      await updateDoc(homeworkRef, { submissions: updatedSubmissions });
      // Refresh the list of homeworks
      await fetchHomeworks();
      // Update local state
      setGradeMap(prev => ({ ...prev, [`${homeworkId}-${studentEmail}`]: grade }));
    } catch (error) {
      console.error("Error grading submission:", error);
    }
  };

  const handleDeleteHomework = async (homeworkId) => {
    try {
      const homeworkRef = doc(db, "Classes", classId, "homeworks", homeworkId);
      await deleteDoc(homeworkRef);
      // Refresh the list of homeworks
      await fetchHomeworks();
    } catch (error) {
      console.error("Error deleting homework:", error);
    }
  };

  const handleDeleteSubmission = async (homeworkId, studentEmail) => {
    try {
      const homeworkRef = doc(db, "Classes", classId, "homeworks", homeworkId);
      const homeworkDoc = await getDoc(homeworkRef);
      const updatedSubmissions = homeworkDoc.data().submissions.filter(submission => submission.studentEmail !== studentEmail);
      await updateDoc(homeworkRef, { submissions: updatedSubmissions });
      // Refresh the list of homeworks
      await fetchHomeworks();
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Class Homeworks</h2>

      {isClassCreator && (
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-500 text-white py-2 px-4 rounded mb-6 hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : 'Add Homework'}
        </button>
      )}

      {showForm && isClassCreator && (
        <form onSubmit={handleCreateHomework} className="mb-8 bg-white p-6 rounded shadow-md">
          <h3 className="text-xl font-semibold mb-4">Create New Homework</h3>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Homework Title:</label>
            <input
              type="text"
              value={newHomework.title}
              onChange={(e) => setNewHomework({ ...newHomework, title: e.target.value })}
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Homework Description:</label>
            <textarea
              value={newHomework.description}
              onChange={(e) => setNewHomework({ ...newHomework, description: e.target.value })}
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
              type="date"
              value={newHomework.deadline}
              onChange={(e) => setNewHomework({ ...newHomework, deadline: e.target.value })}
              className="border rounded w-full py-2 px-3"
              required
            />
          </div>
          {uploadProgress > 0 && (
            <div className="mb-4">
              <progress value={uploadProgress} max="100" className="w-full" />
            </div>
          )}
          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
            Create Homework
          </button>
        </form>
      )}

      {homeworks.map((homework) => (
        <div key={homework.id} className="mb-4 bg-white p-6 rounded shadow-md">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold">{homework.title}</h3>
            <button
              onClick={() => setExpandedHomeworkId(expandedHomeworkId === homework.id ? null : homework.id)}
              className="text-blue-500 hover:underline"
            >
              {expandedHomeworkId === homework.id ? 'Hide Details' : 'Show Details'}
            </button>
            {isClassCreator && (
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDeleteHomework(homework.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
          <p className="text-gray-600 mt-2">
            Deadline: {homework.deadline ? new Date(homework.deadline).toLocaleDateString() : 'No deadline'}
          </p>

          {expandedHomeworkId === homework.id && (
            <>
              <p className="mt-4">{homework.description}</p>
              {homework.fileUrl && (
                <p className="mt-2">
                  <a href={homework.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    View Homework File
                  </a>
                </p>
              )}
              {!isClassCreator && (
                <>
                  <div className="mt-4">
                    <label className="block text-gray-700 font-medium mb-2">Submit Your Solution:</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="border rounded w-full py-2 px-3"
                    />
                    <button
                      onClick={() => {
                        if (selectedFile) {
                          handleHomeworkSubmit(homework.id, selectedFile);
                        } else {
                          console.error("No file selected");
                        }
                      }}
                      className="bg-green-500 text-white py-2 px-4 rounded mt-2 hover:bg-green-600"
                    >
                      Submit Homework
                    </button>
                  </div>
                </>
              )}
              {homework.submissions.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold">Submissions:</h4>
                  <ul>
                    {homework.submissions
                      .sort((a, b) => new Date(a.submissionDate) - new Date(b.submissionDate))
                      .map((submission) => (
                        <li key={submission.studentEmail} className="mt-2 flex justify-between items-center">
                          <a href={submission.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            View Submission from {submission.studentEmail}
                          </a>
                          {/* grade view  */}
                          {isClassCreator && (
                            <p className="text-gray-600">
                              {submission.grade ? `Grade: ${submission.grade}` : 'No Grade'}
                            </p>)}
                            {/* view grad for !isClassCreator */}
                            {!isClassCreator && (
                              <p className="text-gray-600">
                                {submission.grade ? `Grade: ${submission.grade}` : 'No Grade'}
                              </p>
                              )}
                          {isClassCreator && (
                            <div className="flex space-x-2 items-center">
                              <input
                                type="number"
                                placeholder="Grade (0-100)"
                                min="0"
                                max="100"
                                value={gradeMap[`${homework.id}-${submission.studentEmail}`] || submission.grade || ''}
                                onChange={(e) => setGradeMap(prev => ({ ...prev, [`${homework.id}-${submission.studentEmail}`]: Number(e.target.value) }))}
                                className="border rounded py-1 px-2 w-20"
                              />
                              <button
                                onClick={() => handleGradeSubmit(homework.id, submission.studentEmail, gradeMap[`${homework.id}-${submission.studentEmail}`] || 0)}
                                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => handleDeleteSubmission(homework.id, submission.studentEmail)}
                                className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-600"
                              >
                                Delete Submissions
                              </button>
                            </div>
                          )}
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default ClassHomeworks;
