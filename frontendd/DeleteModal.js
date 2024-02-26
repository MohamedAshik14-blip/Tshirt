// DeleteModal.js
import React from 'react';

const DeleteModal = ({ product, onDeleteProduct, onClose }) => {
  const handleDeleteProduct = () => {
    onDeleteProduct(product._id);
    onClose();
  };

  return (
    <div className="delete-modal">
      <h2>Delete Product</h2>
      <p>{`Are you sure you want to delete ${product.name}?`}</p>
      <div className="delete-buttons">
        <button onClick={handleDeleteProduct}>Delete</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default DeleteModal;
