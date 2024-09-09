import { createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useState } from 'react';
 
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/Firebase';
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();  
//   const handleLogout = () => {
//     sessionStorage.removeItem('token');
//     navigate('/login');
//   };
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    try {
      if (isRegistering) {
        await createUserWithEmailAndPassword(auth, email, password);
        
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      sessionStorage.setItem('token', auth.accessToken);  
      navigate('/home'); 
    } catch (error) {
      console.error('Error during email login/registration:', error);
      alert('Error: ' + error.message);
    }
  };
  
  const handleGoogleAuth = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      alert('Logged in with Google successfully');
      sessionStorage.setItem('token', auth.accessToken);  
      navigate('/home'); // Redirect to home page after successful Google login
    } catch (error) {
      console.error('Google login failed:', error);
      alert('Google login failed: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">{isRegistering ? 'Register' : 'Login'}</h1>

      <form className="flex flex-col space-y-4 w-full max-w-sm" onSubmit={handleEmailAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border border-gray-300 rounded"
          required
        />
        <button type="submit" className="p-2 bg-blue-500 text-white rounded">
          {isRegistering ? 'Register' : 'Login'}
        </button>
      </form>

      <button
        onClick={handleGoogleAuth}
        className="mt-4 p-2 bg-red-500 text-white rounded"
      >
        Sign in with Google
      </button>

      <button
        className="mt-2 text-blue-500 underline"
        onClick={() => setIsRegistering(!isRegistering)}
      >
        {isRegistering ? 'Already have an account? Log in' : 'New here? Register'}
      </button>
    </div>
  );
}

export default LoginPage;
