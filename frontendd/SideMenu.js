import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SideMenu = ({ isOpen, onClose, username, onLogout, isAdmin, onAddProduct, onViewUsers, profileImage }) => {
  const defaultProfileImage = '/path/to/default-image.jpg';

  const profilePictureStyle = { backgroundImage: `url(${profileImage || defaultProfileImage})` };

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        const userId = localStorage.getItem('userId');

        if (token && userId) {
          const response = await axios.get(`http://localhost:3000/api/users/${userId}/profileImage`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          // Update profile image in the parent component
          profileImage && profileImage(response.data.profileImage);
        }
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [profileImage]); // Fetch profile image on component mount

  return (
    <div className={`side-menu ${isOpen ? 'open' : ''}`}>
      <div className="menu-header">
        <div className="profile-picture" style={profilePictureStyle}></div>
        <p>{`Hi ${username}!`}</p>
        <button onClick={onClose}>Close</button>
      </div>
      <ul className="menu-list">
        <li onClick={onLogout}>Logout</li>
        <li>View Cart</li>
        {isAdmin && (
          <>
            <li onClick={onAddProduct}>Add New Product</li>
            <li onClick={onViewUsers}>View Users</li>
          </>
        )}
      </ul>
    </div>
  );
};

export default SideMenu;
