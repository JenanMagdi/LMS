import { useNavigate } from 'react-router-dom';
import layers from '../assets/layers.svg';

const Landing = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token');

  const handleGetStarted = () => {
    if (token) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="bg-gradient-to-t from-blue-100 to-blue-600 h-screen flex flex-col justify-center items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-blue-200 to-blue-400 opacity-40 animate-pulse"></div>
      <div className="text-center px-6 mb-8 z-30">
        <h1 className="text-white text-5xl font-bold mb-4 ">
          Discover, Explore, Achieve
        </h1>
        <h2 className="text-blue-600 text-6xl font-extrabold mb-6 leading-tight transform transition duration-700 hover:scale-105">
          EduConnect
        </h2>
        <p className="text-white shadow-current text-xl font-bold mb-6 animate-fade-in-up">
          Your Partner in Learning! <br />
        </p>
        <button
          onClick={handleGetStarted}
          className="relative bg-blue-600 text-white text-lg font-semibold py-3 px-8 rounded-lg shadow-md transition-all duration-700 ease-in-out transform hover:scale-110 hover:shadow-2xl hover:bg-blue-700   "
        >
          Get Started!
        </button>
      </div>

      {/* Layer Image */}
      <div className="absolute inset-x-0 bottom-0 z-10 ">
        <img className="w-full" src={layers} alt="Background layers" />
      </div>
    </div>
  );
};

export default Landing;





  
// const Landing = () => {
//   return (
//     <div className="font-sans">
//       {/* Navbar */}
//       <nav className="bg-white shadow-md py-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <a href="#" className="text-2xl font-bold text-blue-600">
//             EduConnect
//           </a>
//           <ul className="flex space-x-6">
//             <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
//             <li><a href="#testimonials" className="text-gray-600 hover:text-blue-600">Testimonials</a></li>
//             <li><a href="#cta" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Get Started</a></li>
//           </ul>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="bg-blue-600 text-white py-20">
//         <div className="container mx-auto text-center">
//           <h1 className="text-4xl font-bold mb-6">Welcome to EduConnect</h1>
//           <p className="text-lg mb-8">Your ultimate platform for interactive learning and engaging classrooms.</p>
//           <a href="#cta" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
//             Join Now
//           </a>
//         </div>
//       </section>

//       {/* Features Section */}
//       <section id="features" className="py-20 bg-gray-100">
//         <div className="container mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-8">Our Features</h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h3 className="text-xl font-bold mb-4">Interactive Quizzes</h3>
//               <p>Create and share interactive quizzes with your students easily.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h3 className="text-xl font-bold mb-4">Course Materials</h3>
//               <p>Upload and share your course materials with a simple click.</p>
//             </div>
//             <div className="bg-white p-6 rounded-lg shadow-lg">
//               <h3 className="text-xl font-bold mb-4">Real-time Notifications</h3>
//               <p>Stay up to date with real-time notifications about assignments and updates.</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Testimonials Section */}
//       <section id="testimonials" className="py-20 bg-white">
//         <div className="container mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//             <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//               <p className="text-gray-600 italic">"EduConnect has completely transformed my classroom experience. Highly recommended!"</p>
//               <h4 className="text-gray-800 font-bold mt-4">- John Doe, Teacher</h4>
//             </div>
//             <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//               <p className="text-gray-600 italic">"The real-time notifications keep me on track with my assignments. Love it!"</p>
//               <h4 className="text-gray-800 font-bold mt-4">- Sarah Smith, Student</h4>
//             </div>
//             <div className="bg-gray-100 p-6 rounded-lg shadow-lg">
//               <p className="text-gray-600 italic">"A must-have tool for every teacher. Simplifies everything!"</p>
//               <h4 className="text-gray-800 font-bold mt-4">- Jane Miller, Teacher</h4>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Call to Action Section */}
//       <section id="cta" className="py-20 bg-blue-600 text-white text-center">
//         <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
//         <p className="mb-8">Join EduConnect today and revolutionize your classroom experience.</p>
//         <a href="#" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
//           Sign Up Now
//         </a>
//       </section>

//       {/* Footer */}
//       <footer className="bg-gray-800 text-white py-6">
//         <div className="container mx-auto text-center">
//           <p>&copy; 2024 EduConnect. All rights reserved.</p>
//           <p><a href="#" className="text-blue-400 hover:underline">Privacy Policy</a> | <a href="#" className="text-blue-400 hover:underline">Terms of Service</a></p>
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default Landing;
