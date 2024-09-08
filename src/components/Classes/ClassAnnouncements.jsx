import { Avatar, IconButton } from "@mui/material";
import { addDoc, collection, deleteDoc, doc, onSnapshot, Timestamp, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CustomUseContext } from "../../context/context";
import { db, storage } from "../../lib/Firebase";

// eslint-disable-next-line react/prop-types
const ClassAnnouncements = ({ classId, isClassCreator }) => {
  const { loggedInMail } = CustomUseContext();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [editedFiles, setEditedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      collection(db, "classes", classId, "announcements"),
      (snapshot) => {
        setAnnouncements(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (error) => {
        setError(error.message);
        setLoading(false);
      }
    );
    return unsub;
  }, [classId]);

  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      let uploadedFilesUrls = [];

      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          try {
            const fileRef = ref(storage, `files/${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            return null;
          }
        });

        uploadedFilesUrls = await Promise.all(uploadPromises);
        uploadedFilesUrls = uploadedFilesUrls.filter(url => url !== null);
      }

      await addDoc(collection(db, "classes", classId, "announcements"), {
        message: newAnnouncement,
        creator: loggedInMail,
        createdAt: Timestamp.now(),
        files: uploadedFilesUrls,
      });

      setNewAnnouncement("");
      setFiles([]);
    } catch (error) {
      console.error("Error posting announcement:", error);
      setError("Failed to post announcement.");
    }
  };

  const handleDeleteAnnouncement = async (announcementId) => {
    try {
      await deleteDoc(doc(db, "classes", classId, "announcements", announcementId));
    } catch (error) {
      console.error("Error deleting announcement:", error);
      setError("Failed to delete announcement.");
    }
  };

  const handleEditAnnouncement = async (announcementId) => {
    try {
      let updatedFilesUrls = existingFiles;

      if (editedFiles.length > 0) {
        const uploadPromises = editedFiles.map(async (file) => {
          try {
            const fileRef = ref(storage, `files/${file.name}`);
            await uploadBytes(fileRef, file);
            return await getDownloadURL(fileRef);
          } catch (uploadError) {
            console.error("Error uploading file:", uploadError);
            return null;
          }
        });

        const newFilesUrls = await Promise.all(uploadPromises);
        updatedFilesUrls = [...existingFiles, ...newFilesUrls.filter(url => url !== null)];
      }

      await updateDoc(doc(db, "classes", classId, "announcements", announcementId), {
        message: editedText,
        files: updatedFilesUrls,
      });

      setEditingAnnouncement(null);
      setEditedText("");
      setEditedFiles([]);
      setExistingFiles([]);
    } catch (error) {
      console.error("Error updating announcement:", error);
      setError("Failed to update announcement.");
    }
  };

  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement.id);
    setEditedText(announcement.message);
    setExistingFiles(announcement.files || []);
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Announcements</h2>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-4 shadow-md rounded relative">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar>{announcement.creator[0]}</Avatar>
              <span className="font-bold">{announcement.creator}</span>
              {(loggedInMail === announcement.creator || isClassCreator) && (
                <div className="absolute top-2 right-2 flex space-x-2">
                  <IconButton onClick={() => handleEditClick(announcement)}>
                    <FaEdit />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteAnnouncement(announcement.id)}>
                    <FaTrash />
                  </IconButton>
                </div>
              )}
            </div>
            {editingAnnouncement === announcement.id ? (
              <div>
                <textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="w-full p-2 border rounded-md mb-2"
                />
                <input
                  type="file"
                  multiple
                  onChange={(e) => setEditedFiles(Array.from(e.target.files))}
                  className="mt-2"
                />
                <button
                  onClick={() => handleEditAnnouncement(announcement.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <>
                <p className="text-gray-800">{announcement.message}</p>
                {announcement.files && announcement.files.length > 0 && (
                  <div className="mt-2">
                    {announcement.files.map((fileUrl, index) => (
                      <a key={index} href={fileUrl} target="_blank" rel="noopener noreferrer" className="block text-blue-500">
                        {`File ${index + 1}`}
                      </a>
                    ))}
                  </div>
                )}
                <small className="text-gray-500 block mt-2">
                  Posted at: {announcement.createdAt.toDate().toLocaleString()}
                </small>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6">
        <textarea
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Write a new announcement..."
        />
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files))}
          className="mt-2"
        />
        <button
          onClick={handlePostAnnouncement}
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Post Announcement
        </button>
      </div>
    </div>
  );
};

export default ClassAnnouncements;
