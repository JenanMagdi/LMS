import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from './Firebase';

export async function createNotification(userEmail, message, senderName, senderPhotoURL) {
  try {
    await addDoc(collection(db, 'Users', userEmail, 'notifications'), {
      message,
      senderName,
      senderPhotoURL,
      timestamp: serverTimestamp(),
      read: false
    });
    console.log('Notification created successfully.');
  } catch (error) {
    console.error('Error creating notification:', error);
  }
}
