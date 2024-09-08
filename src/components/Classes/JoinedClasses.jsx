import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { CustomUseContext } from '../../context/context';

function JoinedClasses() {
  const { createdClasses, joinedClasses } = CustomUseContext();
  const allClasses = [...createdClasses, ...joinedClasses];
  const navigate = useNavigate(); // Initialize useNavigate

  const handleViewDetails = (classId) => {
    navigate(`/class/${classId}`); // Navigate to the detailed view page with the class ID
  };

  return (
    <div className="p-5 bg-gradient-to-t from-white to-blue-100 rounded-lg shadow-lg min-h-screen">
      <h1 className="text-5xl font-bold text-center text-blue-700/80 mb-10"> Class List</h1>
      <div className="container mx-auto px-4">
        {allClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allClasses.map((classItem) => (
              <div
                key={classItem.id}
                className="bg-white shadow-lg rounded-lg border border-gray-300 p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-3xl font-semibold text-blue-800">{classItem.className}</h2>
                  <p className="text-gray-600 mt-2 text-sm">{classItem.description || 'No description available'}</p>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span className="inline-block px-3 py-1 text-xs font-medium text-white bg-blue-500 rounded-2xl">
                    {classItem.owner}
                  </span>
                  <button
                    onClick={() => handleViewDetails(classItem.id)} // Update onClick to navigate
                    className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600">
            <p className="text-lg">You have not joined or created any classes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default JoinedClasses;
