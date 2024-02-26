// ViewUserModal.js

import React from 'react';

const ViewUserModal = ({ isOpen, onClose, users, onDeleteUser }) => {
  return (
  
    <div className={`view-user-modal ${isOpen ? 'open' : ''}`}>
    <div className="edit-modal">
      <div className="edit-modal-content">
          <div className="view-user-container">
            <h2>User Management</h2>
            {users.map((user) => (
              <div key={user._id} className="user-card">
                <p>
                  <strong>Username:</strong> {user.username}
                </p>
                <p>
                  <strong>Role:</strong> {user.role}
                </p>
                <button onClick={() => onDeleteUser(user._id)}>Delete User</button>
              </div>
            ))}
            <button className="detail-button" onClick={onClose}>Close</button>
           
          </div>
        </div>
      </div>
      </div>

    
  );
};

export default ViewUserModal;
