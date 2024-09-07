import { addDoc, collection, onSnapshot, Timestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import { CustomUseContext } from "../../context/context";
import { db } from "../../lib/Firebase";

// eslint-disable-next-line react/prop-types
function ClassAnnouncements({ classId }) {
  const { loggedInMail, loggedInUser } = CustomUseContext();
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const isCreator = loggedInUser && announcements.length >= 0 && announcements[0]?.creator === loggedInMail; // Check if the user is the class creator
  console.log(loggedInUser&& announcements.length >= 0 && announcements[0]?.creator === loggedInMail)
  console.log(announcements[0]?.creator )

  // Fetch announcements
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "CreatedClasses", loggedInMail, "classes", classId, "announcements"),
      (snapshot) => {
        setAnnouncements(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching announcements:", err);
        setError("Failed to load announcements.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [classId, loggedInMail]);

  // Post a new announcement (only for the class creator)
  const handlePostAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;

    try {
      const announcementRef = collection(db, "CreatedClasses", loggedInMail, "classes", classId, "announcements");
      await addDoc(announcementRef, {
        message: newAnnouncement,
        creator: loggedInMail,
        createdAt: Timestamp.now(),
      });
      setNewAnnouncement(""); // Clear the input after posting
    } catch (error) {
      console.error("Error posting announcement:", error);
      setError("Failed to post announcement.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">Announcements</h2>
      
      {/* Display announcements */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-4 shadow-md rounded">
            <p className="text-gray-800">{announcement.message}</p>
            <small className="text-gray-500">
              Posted by: {announcement.creator} | {announcement.createdAt.toDate().toLocaleString()}
            </small>
          </div>
        ))}
      </div>
      {/* Only show post form for the class creator */}
      {isCreator && (
        <div className="mt-6">
          <textarea
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Write a new announcement..."
          />
          <button
            onClick={handlePostAnnouncement}
            className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Announcement
          </button>
        </div>
      )}
    </div>
  );
}

export default ClassAnnouncements;
