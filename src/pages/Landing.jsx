 import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const token = sessionStorage.getItem('token')

  const handleGetStarted = () => {
    if
    (token) {
      navigate('/home')
      } else {

    navigate('/login'); // الانتقال إلى صفحة تسجيل الدخول
      }
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen flex flex-col justify-center items-center">
      <div className="text-center text-white">
        <h1 className="text-6xl font-bold mb-4">Welcome to EduConnect</h1>
        <p className="text-lg mb-8">Connect, Learn, and Succeed Together</p>
        <button
          onClick={handleGetStarted}
          className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-full shadow-lg hover:bg-gray-100 transition duration-300"
        >
          {token ? 'return home ' : 'get started'}
        </button>
      </div>
    </div>
  );
};

export default Landing;
