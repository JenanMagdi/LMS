// src/components/Notifications.tsx

import { Avatar, Button } from '@mui/material';
import { collection, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { CustomUseContext } from '../context/context';
import { db } from '../lib/Firebase';

function Notifications() {
  const { loggedInMail } = CustomUseContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (loggedInMail) {
      const unsubscribe = onSnapshot(
        collection(db, 'Users', loggedInMail, 'notifications'),
        (snapshot) => {
          setNotifications(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
        }
      );
      return () => unsubscribe(); // Clean up the subscription
    }
  }, [loggedInMail]);

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Notifications</h1>
        {notifications.length > 0 ? (
          <ul className="space-y-4">
            {notifications.map((notification) => (
              <li key={notification.id} className="p-4 bg-blue-100 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-4">
                  <Avatar src={notification.senderPhotoURL} sx={{ width: 40, height: 40 }} />
                  <div>
                    <div className="font-semibold text-lg">{notification.senderName}</div>
                    <div className="text-gray-500">{notification.message}</div>
                  </div>
                </div>
                <Button variant="contained" color="primary" onClick={() => {/* Handle action */}}>
                  View
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            <p className="text-lg">No notifications at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
