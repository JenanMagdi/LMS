import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomUseContext } from '../context/context';
import { db } from '../lib/Firebase';

function ClassCard() {
  const { loggedInMail } = CustomUseContext();
  const [classIds, setClassIds] = useState([]);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loggedInMail) {
      const createdClassesRef = collection(db, "ClassesCreatedByUser", loggedInMail, "classes");
      const joinedClassesRef = collection(db, "ClassesJoinedByUser", loggedInMail, "classes");

      const unsubscribeCreated = onSnapshot(createdClassesRef, (snapshot) => {
        const createdClassIds = snapshot.docs.map(doc => doc.id);
        setClassIds(prevIds => [...new Set([...prevIds, ...createdClassIds])]); // Merge and remove duplicates
      });

      const unsubscribeJoined = onSnapshot(joinedClassesRef, (snapshot) => {
        const joinedClassIds = snapshot.docs.map(doc => doc.id);
        setClassIds(prevIds => [...new Set([...prevIds, ...joinedClassIds])]); // Merge and remove duplicates
      });

      return () => {
        unsubscribeCreated();
        unsubscribeJoined();
      };
    }
  }, [loggedInMail]);

  useEffect(() => {
    const fetchClassDetails = async () => {
      const fetchedClasses = [];
      for (const classId of classIds) {
        const classDocRef = doc(db, 'classes', classId);
        const classDocSnapshot = await getDoc(classDocRef);
        if (classDocSnapshot.exists()) {
          fetchedClasses.push({ id: classDocSnapshot.id, ...classDocSnapshot.data() });
        }
      }
      setClasses(fetchedClasses);
    };

    if (classIds.length > 0) {
      fetchClassDetails();
    }
  }, [classIds]);

  const handleViewDetails = (classId) => {
    navigate(`/class/${classId}`);
  };

  


  return (
    <div className="p-6  rounded-xl shadow-md min-h-screen">
      {/* عنوان الصفحة */}
      <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-12">
        My Classes
      </h1>
  
      <div className="container mx-auto px-4">
        {classes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {classes.map((classItem) => (
              <div
                key={classItem.id}
                className="relative bg-white shadow-lg rounded-lg p-6 flex flex-col justify-between border-l-4 border-blue-500 transform transition duration-300 hover:-translate-y-2 hover:shadow-xl"
              >
                {/* اسم الفصل ورمز الفصل */}
                <div className="flex justify-between items-center mb-4">
                  <p className="text-2xl md:text-3xl font-semibold text-blue-700">
                    {classItem.name}
                  </p>
                  <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
                    {classItem.code}
                  </span>
                </div>
  
                {/* الوصف وصاحب الفصل */}
                <p className="text-gray-600 text-sm mb-2">{classItem.createdBy}</p>
                <p className="text-gray-500 text-sm mb-4">{classItem.description || 'No description provided'}</p>
  
                {/* زر التفاصيل */}
                <button
                  onClick={() => handleViewDetails(classItem.id)}
                  className="mt-auto py-2 px-4 bg-blue-500 text-white rounded-full text-sm font-semibold transition duration-300 hover:bg-blue-600"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-700">
            <p className="text-lg">You have not joined or created any classes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
  

  
  
}

export default ClassCard;
