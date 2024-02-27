// EditModal.js
import React, { useState, useEffect } from 'react';

const EditModal = ({ product, onEditProduct }) => {
  const [editedProduct, setEditedProduct] = useState({ ...product });

  useEffect(() => {
    // Reset the edited product when the product prop changes
    setEditedProduct({ ...product });
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleEditVariantChange = (index, field, value) => {
    const updatedVariants = [...editedProduct.variants];
    updatedVariants[index][field] = value;
    setEditedProduct((prevProduct) => ({ ...prevProduct, variants: updatedVariants }));
  };

  return (
    <div className="edit-modal">
      <div className="edit-modal-content">
        <h2>Edit Product</h2>
        <label htmlFor="editedProductName">Product Name:</label>
        <input
          type="text"
          id="editedProductName"
          name="name"
          value={editedProduct.name}
          onChange={handleInputChange}
        />
        <label htmlFor="editedProductPrice">Product Price:</label>
        <input
          type="number"
          id="editedProductPrice"
          name="price"
          value={editedProduct.price}
          onChange={handleInputChange}
        />

        {/* Edit Variants section */}
        <h3>Edit Variants</h3>
        {editedProduct.variants.map((variant, index) => (
          <div key={index}>
            <label htmlFor={`editedVariantSize${index}`}>Size:</label>
            <input
              type="text"
              id={`editedVariantSize${index}`}
              value={variant.size}
              onChange={(e) => handleEditVariantChange(index, 'size', e.target.value)}
            />
            <label htmlFor={`editedVariantColor${index}`}>Color:</label>
            <input
              type="text"
              id={`editedVariantColor${index}`}
              value={variant.color}
              onChange={(e) => handleEditVariantChange(index, 'color', e.target.value)}
            />
            <label htmlFor={`editedVariantStock${index}`}>Stock:</label>
            <input
              type="number"
              id={`editedVariantStock${index}`}
              value={variant.stock}
              onChange={(e) => handleEditVariantChange(index, 'stock', e.target.value)}
            />
          </div>
        ))}

        {/* Add Image1 and Image2 fields */}
        <label htmlFor="editedProductImage1">Product Image  URL:</label>
        <input
          type="text"
          id="editedProductImage1"
          name="image"
          value={editedProduct.image}
          onChange={handleInputChange}
        />
        <label htmlFor="editedProductImage1">Product Image 1 URL:</label>
        <input
          type="text"
          id="editedProductImage1"
          name="image1"
          value={editedProduct.image1}
          onChange={handleInputChange}
        />

        <label htmlFor="editedProductImage2">Product Image 2 URL:</label>
        <input
          type="text"
          id="editedProductImage2"
          name="image2"
          value={editedProduct.image2}
          onChange={handleInputChange}
        />

        <button onClick={() => onEditProduct(editedProduct)}>Save Changes</button>
      </div>
    </div>
  );
};

export default EditModal;
