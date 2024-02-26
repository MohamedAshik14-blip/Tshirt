import React, { useState } from 'react';

const AddModal = ({ onAddProduct, userRole,onClose  }) => {
  // Check if the user has admin role before rendering the AddModal
  
  const [newProduct, setNewProduct] = useState({
    productId: '', // Add productId field
    name: '',
    price: 0,
    image: '',
    category: '',
    brand: '',
    variants: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({ ...prevProduct, [name]: value }));
  };

  const handleAddVariant = () => {
    // Add a new variant to the variants array
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      variants: [...prevProduct.variants, { size: '', color: '', stock: 0 }],
    }));
  };

  const handleVariantChange = (index, field, value) => {
    // Update the variant fields
    setNewProduct((prevProduct) => {
      const updatedVariants = [...prevProduct.variants];
      updatedVariants[index][field] = value;
      return { ...prevProduct, variants: updatedVariants };
    });
  };
  const handleAddProduct = () => {
    onAddProduct(newProduct);
    // Clear the form after adding the product
    setNewProduct({
      productId: '', // Reset productId field
      name: '',
      price: 0,
      image: '',
      category: '',
      brand: '',
      variants: [],
    });
  };
  const handleClose = () => {
    // Close the modal without adding the product
    onClose();
  };




  return (
   <div className="edit-modal">
      <div className="edit-modal-content">
      <h2>Add New Product</h2>
      <label htmlFor="productId">Product ID:</label>
      <input
        type="text"
        id="productId"
        name="productId"
        value={newProduct.productId}
        onChange={handleInputChange}
      />
      <label htmlFor="productName">Product Name:</label>
      <input
        type="text"
        id="productName"
        name="name"
        value={newProduct.name}
        onChange={handleInputChange}
      />
      <label htmlFor="productPrice">Product Price:</label>
      <input
        type="number"
        id="productPrice"
        name="price"
        value={newProduct.price}
        onChange={handleInputChange}
      />
      <label htmlFor="productImage">Product Image URL:</label>
      <input
        type="text"
        id="productImage"
        name="image"
        value={newProduct.image}
        onChange={handleInputChange}
      />
      <label htmlFor="productCategory">Product Category:</label>
      <input
        type="text"
        id="productCategory"
        name="category"
        value={newProduct.category}
        onChange={handleInputChange}
      />
      <label htmlFor="productBrand">Product Brand:</label>
      <input
        type="text"
        id="productBrand"
        name="brand"
        value={newProduct.brand}
        onChange={handleInputChange}
      />

      {/* Variants section */}
      <h3>Variants</h3>
      {newProduct.variants.map((variant, index) => (
        <div key={index}>
          <label htmlFor={`variantSize${index}`}>Size:</label>
          <input
            type="text"
            id={`variantSize${index}`}
            value={variant.size}
            onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
          />
          <label htmlFor={`variantColor${index}`}>Color:</label>
          <input
            type="text"
            id={`variantColor${index}`}
            value={variant.color}
            onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
          />
          <label htmlFor={`variantStock${index}`}>Stock:</label>
          <input
            type="number"
            id={`variantStock${index}`}
            value={variant.stock}
            onChange={(e) => handleVariantChange(index, 'stock', e.target.value)}
          />
        </div>
      ))}
      <button onClick={handleAddVariant}>Add Variant</button>

      <button onClick={handleAddProduct}>Add Product</button>
      <button className="edit-modal-close" onClick={handleClose}>
          Close
        </button>
    </div>
    </div>
     
  );
};

export default AddModal;
