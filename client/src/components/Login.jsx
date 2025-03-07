import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { ThemeContext } from '../ThemeContext';
import axios from 'axios';
import Spinner from './Spinner';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please fill in both fields');
      return;
    }

    setLoading(true); // Show spinner during login request

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:4000';

      const response = await axios.post(`${apiUrl}/auth/login`, { username, password });

      if (response.data.message === 'User not found. Please sign up first.') {
        setError('User not found. Please sign up before logging in.');
      } else {
        login(response.data.token);
        navigate('/posts');
      }
    } catch (error) {
      console.error('Login failed', error);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.message);
      } else {
        setError('Login failed due to server error');
      }
    }

    setLoading(false); 
  };

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className="flex items-center justify-center">
        <div className="bg-white p-8 mt-10 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Login</h2>
          {error && (
            <div className="mb-4 text-red-500">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded input ${darkMode ? 'dark-mode-input' : ''}`}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-2 border border-gray-300 rounded input ${darkMode ? 'dark-mode-input' : ''}`}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
              disabled={loading} // Disable button when loading
            >
              {loading ? <Spinner /> : 'Login'} {/* Show spinner or text based on loading state */}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
