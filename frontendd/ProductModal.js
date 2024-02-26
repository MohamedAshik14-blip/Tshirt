// src/ProductModal.js
import React from 'react';
import './App.css'; // Import the CSS file
function ProductModal({ product, closeModal, onBuyNow, onAddToCart }) {
  return (
    <div className="modal-overlay11">
      <div className="modal-content11">
        <h2>{product.name}</h2>
        <p>Category: {product.category}</p>
        <p>Brand: {product.brand}</p>
        <h3>Variants:</h3>
        <ul>
          {product.variants.map((variant, index) => (
            <li key={index}>
              Size: {variant.size}, Color: {variant.color}, Stock: {variant.stock}
            </li>
          ))}
        </ul>
        <button className="detail-button" onClick={onBuyNow}>Buy Now</button>
        <button className="detail-button"onClick={onAddToCart}>Add to Cart</button>
        <button className="detail-button" onClick={closeModal}>Close</button>
      </div>
    </div>
  );
}

export default ProductModal;
