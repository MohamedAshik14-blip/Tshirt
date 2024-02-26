// CartModal.js

import React from 'react';


const CartModal = ({ isOpen, onClose, cartItems }) => {
  return (
    <div className={`cart-modal ${isOpen ? 'open' : ''}`}>
      <div className="cart-modal-header">
        <h2>Your Cart</h2>
        <button onClick={onClose}>Close</button>
      </div>
      <div className="cart-modal-content">
        {cartItems.map((item) => (
          <div key={item.productId} className="cart-item">
            <p>{item.name}</p>
            <p>${item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CartModal;
