// import PropTypes from 'prop-types';

// function ClassList({ allClasses }) {
//   return (
//     <div className="p-6 bg-gray-50">
//       <h1 className="text-4xl font-bold text-center text-blue-600 mb-6">Classes</h1>
//       <div className="max-w-4xl mx-auto">
//         {allClasses.length > 0 ? (
//           <ul className="space-y-4">
//             {allClasses.map((classItem) => (
//               <li
//                 key={classItem.id}
//                 className="w-fit bg-white shadow-md rounded-lg border border-gray-200 p-6 px-32 transition-transform transform hover:scale-105"
//               >
//                 <h2 className="text-2xl font-semibold text-blue-800">{classItem.className}</h2>
//                 <p className="text-gray-600 mt-2">{classItem.description || 'No description available'}</p>
//                 <div className="mt-4">
//                   <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-800 bg-blue-100 rounded-full">
//                     {classItem.subject}
//                   </span>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         ) : (
//           <div className="text-center text-gray-500">
//             <p className="text-lg">No classes available.</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// ClassList.propTypes = {
//   allClasses: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       className: PropTypes.string.isRequired,
//       description: PropTypes.string,
//       subject: PropTypes.string.isRequired,
//     })
//   ).isRequired,
// };

// export default ClassList;
