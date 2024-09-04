// import { useEffect, useState } from "react";
// import { db } from "../database/Firebase";

// const Courses = () => {
//     const [courses, setCourses] = useState([]);
  
//     useEffect(() => {
//       db.collection('courses').onSnapshot(snapshot => {
//         const coursesData = [];
//         snapshot.forEach(doc => coursesData.push({ id: doc.id, ...doc.data() }));
//         setCourses(coursesData);
//       });
//     }, []);
  
//     return (
//       <div className="p-6">
//         <h2 className="text-2xl font-bold">Courses</h2>
//         <ul>
//           {courses.map(course => (
//             <li key={course.id}>{course.title}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   };
//   export default Courses
