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
        <h2 className="text-white text-5xl font-bold mb-4 ">
          Discover, Explore, Achieve
        </h2>
        <h1 className="text-blue-600 text-6xl font-extrabold mb-6 leading-tight transform transition duration-700 hover:scale-105">
          EduConnect
        </h1>
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
