// AuthorizationModal.js

import React, { useState } from 'react';
import axios from 'axios';
import './App.scss'; // Create a separate CSS file for modal styles

const AuthorizationModal = ({ isOpen, onClose, onSuccess,updateProducts }) => {
  const initialUserData = {
    username: '',
    email: '',
    password: '',
    role: '',
    profileImage: '',
  };

  const [userData, setUserData] = useState(initialUserData);
  const [isRegister, setIsRegister] = useState(false);
  const [isRegistrationSuccess, setIsRegistrationSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (isRegister) {
        response = await axios.post('http://localhost:3000/api/auth/register', userData);
        setIsRegistrationSuccess(true);
      } else {
        response = await axios.post('http://localhost:3000/api/auth/login', userData);

        // Pass both token and role to the onSuccess callback
        onSuccess(response.data.token, response.data.role, userData.username);

        // Close the modal after successful login
        onClose();
      }

      console.log(isRegister ? 'Registration Response:' : 'Login Response:', response.data);

      // Reset the user data and any error messages
      setUserData(initialUserData);
      setError('');
    } catch (error) {
      setError(`${isRegister ? 'Registration' : 'Login'} failed. Please check your input.`);
      console.error(`${isRegister ? 'Registration' : 'Login'} Error:`, error);
    }
  };

  const handleToggleRegister = () => {
    // Toggle the registration state and reset any error messages and user data
    setIsRegister((prevIsRegister) => !prevIsRegister);
    setIsRegistrationSuccess(false);
    setError('');
    setUserData((prevUserData) => ({
      ...initialUserData,
      role: 'user', // Preserve the current role value
    }));
  };

  const handleToggleAdminRegister = () => {
    // Toggle the registration state to register as an admin
    setIsRegister(true);
    setIsRegistrationSuccess(false);
    setError('');
    setUserData((prevUserData) => ({
      ...initialUserData,
      role: 'admin',
    }));
  };


const handleLoginAsGuest = async () => {
  try {
    // Simulate guest login by sending a request to get all products without authentication
    const response = await axios.get('http://localhost:3000/api/products');

    // Assuming you have an onSuccess callback that handles successful login
    onSuccess('Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NWNjYWYyZGYyNzk5ZWYwMTQxMTViMDMiLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3MDg4MTc3NzIsImV4cCI6MTcxNjU5Mzc3Mn0.rVDWm_sSb_IG96TSyZwl9E9bWosDY7gCZcEubAHs_Ew', 'guest', 'guest');

    // Close the modal after successful login
    onClose();

    // Update the product list with the retrieved products
    // Assuming you have a function to update the products in your component state
  updateProducts(response.data);
  } catch (error) {
    console.error('Guest login failed:', error);
  }
};




  return (
    <div className={`authorization-modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="login-container">
            <h2>{isRegister ? 'Register' : 'Login'}</h2>

            {isRegistrationSuccess && (
              <p className="success-message">Registration successful. Please log in.</p>
            )}

            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit}>
              <label>
                Username:
                <input
                  type="text"
                  name="username"
                  value={userData.username}
                  onChange={handleChange}
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={userData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </label>
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  value={userData.password}
                  onChange={handleChange}
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                />
              </label>
              {isRegister && (
                <>
                  {!userData.role && (
                    <label>
                      Profile Image:
                      <input
                        type="text"
                        name="profileImage"
                        value={userData.profileImage}
                        onChange={handleChange}
                      />
                    </label>
                  )}
                  {userData.role && userData.role === 'admin' && (
                    <label>
                      Role:
                      <input
                        type="text"
                        name="role"
                        value={userData.role}
                        onChange={handleChange}
                        required
                      />
                    </label>
                  )}
                  {userData.role && (
                    <label>
                      Profile Image:
                      <input
                        type="text"
                        name="profileImage"
                        value={userData.profileImage}
                        onChange={handleChange}
                      />
                    </label>
                  )}
                </>
              )}
              <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
              <p className="toggle-register" onClick={handleToggleRegister}>
                {isRegister
                  ? 'Already have an account? Login'
                  : "Don't have an account? Register"}
              </p>
              {!isRegister && (
                <>
                  <p className="toggle-register" onClick={handleToggleAdminRegister}>
                    Register as Admin
                  </p>
                  <p className="toggle-register" onClick={handleLoginAsGuest}>
                    Login as Guest
                  </p>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationModal;
