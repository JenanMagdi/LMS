// // components/LessonForm.js
// import { useState } from 'react';
// import { db } from '../database/Firebase';

// function LessonForm() {
//   const [title, setTitle] = useState('');
//   const [description, setDescription] = useState('');

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     const lessonRef = db.collection('lessons').doc();
//     lessonRef.set({ title, description });
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Title:
//         <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} />
//       </label>
//       <label>
//         Description:
//         <textarea value={description} onChange={(event) => setDescription(event.target.value)} />
//       </label>
//       <button type="submit">Create Lesson</button>
//     </form>
//   );
// }

// export default LessonForm;