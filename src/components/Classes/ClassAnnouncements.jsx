import { Avatar } from "@mui/material";
import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import { CustomUseContext } from "../../context/context";
import { db, storage } from "../../lib/Firebase";

// eslint-disable-next-line react/prop-types
const ClassAnnouncements = ({ classId }) => {
  const { loggedInMail } = CustomUseContext();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      let imageUrl = "";
      if (image) {
        const imageRef = ref(storage, `images/${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "classes", classId, "announcements"), {
        message: newAnnouncement,
        creator: loggedInMail,
        createdAt: Timestamp.now(),
        imageUrl,
      });

      setNewAnnouncement("");
      setImage(null);
    } catch (error) {
      console.error("Error posting announcement:", error);
      setError("Failed to post announcement.");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Announcements</h2>

      {/* Display announcements */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-4 shadow-md rounded">
            <div className="flex items-center space-x-2 mb-2">
              <Avatar>{announcement.creator[0]}</Avatar>
              <span className="font-bold">{announcement.creator}</span>
            </div>
            <p className="text-gray-800">{announcement.message}</p>
            {announcement.imageUrl && <img className="mt-2" src={announcement.imageUrl} alt={announcement.message} />}
            <small className="text-gray-500 block mt-2">
              Posted at: {announcement.createdAt.toDate().toLocaleString()}
            </small>
          </div>
        ))}
      </div>

      {/* Input form for posting a new announcement */}
      <div className="mt-6">
        <textarea
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          className="w-full p-2 border rounded-md"
          placeholder="Write a new announcement..."
        />
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
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
