/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { useEffect, useState } from "react";
import {
  FaEdit,
  FaExpand,
  FaFile,
  FaLock,
  FaTrash,
  FaUnlock,
} from "react-icons/fa";
import { CustomUseContext } from "../../context/context";
import { db, storage } from "../../lib/Firebase";

const ClassAnnouncements = ({ classId, isClassCreator }) => {
  const { loggedInMail } = CustomUseContext();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [allowStudentAnnouncements, setAllowStudentAnnouncements] =
    useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [deletingAnnouncementId, setDeletingAnnouncementId] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileLinks, setFileLinks] = useState({});
  const [openFileDialog, setOpenFileDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const unsub = onSnapshot(
          collection(db, "classes", classId, "announcements"),
          (snapshot) => {
            setAnnouncements(
              snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
            );
            setLoading(false);
          },
          (error) => {
            setError(error.message);
            setLoading(false);
          }
        );
        return unsub;
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    const fetchClassSettings = async () => {
      try {
        const classDoc = await getDoc(doc(db, "classes", classId));
        if (classDoc.exists()) {
          setAllowStudentAnnouncements(
            classDoc.data().allowStudentAnnouncements
          );
        }
      } catch (error) {
        setError(error.message);
      }
    };

    fetchClassSettings();
    fetchAnnouncements();
  }, [classId]);

  const toggleStudentAnnouncements = async () => {
    try {
      await updateDoc(doc(db, "classes", classId), {
        allowStudentAnnouncements: !allowStudentAnnouncements,
      });
      setAllowStudentAnnouncements((prev) => !prev);
    } catch (error) {
      setError("Failed to update permissions.");
    }
  };

  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    if (!isClassCreator && !allowStudentAnnouncements) {
      setError("Students are not allowed to post announcements.");
      return;
    }

    try {
      setLoading(true);
      const announcementData = {
        message: newAnnouncement,
        creator: loggedInMail,
        createdAt: new Date(),
        files: fileLinks,
      };
      await addDoc(
        collection(db, "classes", classId, "announcements"),
        announcementData
      );
      setNewAnnouncement("");
      setFiles([]);
      setFileLinks({});
    } catch (error) {
      setError("Failed to post announcement.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    handleFileUpload(selectedFiles);
  };

  const handleFileUpload = (selectedFiles) => {
    setUploadingFile(true);

    selectedFiles.forEach((file) => {
      const fileRef = ref(
        storage,
        `class_announcements/${classId}/${file.name}`
      );
      const uploadTask = uploadBytesResumable(fileRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          setError("Failed to upload file.");
          setUploadingFile(false);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setFileLinks((prev) => ({ ...prev, [file.name]: downloadURL }));
          setUploadingFile(false);
        }
      );
    });
  };

  const openConfirmDialogHandler = (announcementId) => {
    setDeletingAnnouncementId(announcementId);
    setOpenConfirmDialog(true);
  };

  const closeConfirmDialogHandler = () => {
    setDeletingAnnouncementId(null);
    setOpenConfirmDialog(false);
  };

  const confirmDeleteAnnouncement = async () => {
    try {
      await deleteDoc(
        doc(db, "classes", classId, "announcements", deletingAnnouncementId)
      );
      closeConfirmDialogHandler();
    } catch (error) {
      setError("Failed to delete announcement.");
    }
  };

  const handleEditAnnouncement = async () => {
    if (!editedText.trim()) return;

    try {
      await updateDoc(
        doc(db, "classes", classId, "announcements", editingAnnouncement),
        {
          message: editedText,
        }
      );
      setEditingAnnouncement(null);
      setEditedText("");
      setOpenEditDialog(false);
    } catch (error) {
      setError("Failed to update announcement.");
    }
  };

  const handleEditClick = (announcement) => {
    setEditingAnnouncement(announcement.id);
    setEditedText(announcement.message);
    setOpenEditDialog(true);
  };

  const openFileDialogHandler = (fileURL, fileName) => {
    setSelectedFile({ fileURL, fileName });
    setOpenFileDialog(true);
  };

  const renderFilePreview = (fileURL, fileName) => {
    const fileExtension = fileName.split(".").pop().toLowerCase();
    const imageExtensions = ["jpg", "jpeg", "png", "gif"];
    const videoExtensions = ["mp4", "webm", "ogg"];
    const pdfExtensions = ["pdf"];

    if (imageExtensions.includes(fileExtension)) {
      return (
        <div
          className="relative inline-block cursor-pointer"
          onClick={() => openFileDialogHandler(fileURL, fileName)}
          key={fileName}
        >
          <img
            src={fileURL}
            alt={fileName}
            className="w-16 h-16 object-cover rounded mr-2"
          />
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50 flex items-center justify-center text-white text-xs">
            <FaExpand />
          </div>
        </div>
      );
    }

    return (
      <div className="relative inline-block" key={fileName}>
        {videoExtensions.includes(fileExtension) ||
        pdfExtensions.includes(fileExtension) ? (
          <a
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            <FaFile
              className={`text-2xl ${
                pdfExtensions.includes(fileExtension)
                  ? "text-red-600"
                  : "text-gray-600"
              } mr-2`}
            />
            {fileName}
          </a>
        ) : (
          <a
            href={fileURL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center"
          >
            <FaFile className="mr-2" /> {fileName}
          </a>
        )}
      </div>
    );
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-full">
        <CircularProgress />
      </div>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6  rounded-md relative ">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">Announcements</h2>

      {isClassCreator && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Tooltip
            title={
              allowStudentAnnouncements
                ? "Disable Student Announcements"
                : "Enable Student Announcements"
            }
          >
            <Button
              onClick={toggleStudentAnnouncements}
              variant="contained"
              size="small"
              color={allowStudentAnnouncements ? "secondary" : "primary"}
            >
              {allowStudentAnnouncements ? <FaLock /> : <FaUnlock />}{" "}
              {allowStudentAnnouncements ? "Disable" : "Enable"}
            </Button>
          </Tooltip>
        </div>
      )}

      {(isClassCreator || allowStudentAnnouncements) && (
        <div className="mb-6">
          <TextField
            autoFocus
            margin="dense"
            id="announcement"
            label="New Announcement"
            type="text"
            fullWidth
            variant="outlined"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
          />
          <div className="mb-2">
            <input type="file" multiple onChange={handleFileChange} />
            {uploadingFile && <CircularProgress size={24} />}
          </div>
          <Button
            variant="contained"
            color="primary"
            onClick={handlePostAnnouncement}
            disabled={loading || !newAnnouncement.trim()}
          >
            Post Announcement
          </Button>
        </div>
      )}

      {announcements.length === 0 && <p>No announcements yet.</p>}
      <ul>
        {announcements.map((announcement) => (
          <li
            key={announcement.id}
            className="mb-4 p-4 bg-white shadow rounded-md relative"
          >
            <p className="font-semibold text-gray-800">
              {announcement.creator}
            </p>
            <p>{announcement.message}</p>
            {Object.keys(announcement.files || {}).length > 0 && (
              <div className="mt-2">
                {Object.entries(announcement.files).map(
                  ([fileName, fileURL]) => (
                    <div key={fileName} className="mb-2">
                      {renderFilePreview(fileURL, fileName)}
                    </div>
                  )
                )}
              </div>
            )}

            {(isClassCreator || announcement.creator === loggedInMail) && (
              <div className="absolute top-2 right-2">
                <Tooltip title="Delete Announcement">
                  <IconButton
                    onClick={() => openConfirmDialogHandler(announcement.id)}
                    
                  >
                    <FaTrash className="text-red-500"/>
                  </IconButton>
                </Tooltip>
              </div>
            )}
            {announcement.creator === loggedInMail && (
              <div className="absolute top-2 right-12">
                <Tooltip title="Edit Announcement">
                  <IconButton
                    onClick={() => handleEditClick(announcement)}
                   
                  >
                    <FaEdit  className="text-blue-500"/>
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </li>
        ))}
      </ul>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>Edit Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>Edit your announcement below.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="announcement"
            label="Announcement"
            type="text"
            fullWidth
            variant="outlined"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleEditAnnouncement} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openConfirmDialog} onClose={closeConfirmDialogHandler}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this announcement?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialogHandler} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteAnnouncement} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openFileDialog} onClose={() => setOpenFileDialog(false)}>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          {selectedFile && (
            <div>
              <p>{selectedFile.fileName}</p>
              {selectedFile.fileURL.endsWith(".pdf") ? (
                <embed
                  src={selectedFile.fileURL}
                  type="application/pdf"
                  width="100%"
                  height="500px"
                />
              ) : selectedFile.fileURL.endsWith(".mp4") ? (
                <video controls width="100%">
                  <source src={selectedFile.fileURL} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={selectedFile.fileURL}
                  alt={selectedFile.fileName}
                  className="w-full h-auto"
                />
              )}
            </div>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFileDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ClassAnnouncements;
