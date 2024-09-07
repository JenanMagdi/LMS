// src/firebase/notifications.ts

import { addDoc, collection } from 'firebase/firestore';
import { db } from './Firebase';

export async function createNotification(userEmail, message, senderName, senderPhotoURL) {
  try {
    await addDoc(collection(db, 'Users', userEmail, 'notifications'), {
      message,
      senderName,
      senderPhotoURL,
      timestamp: new Date(),
      read: false
    });
    console.log('Notification created successfully.');
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
