// routes/products.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware'); // Include adminMiddleware

// Create a new product (requires authentication and admin access)
router.post('/products', authMiddleware, adminMiddleware, productController.createProduct);

// Get all products (requires authentication)
router.get('/products', authMiddleware, productController.getAllProducts);

// Get a single product by ID (requires authentication)
router.get('/products/:id', authMiddleware, productController.getProductById);

// Update a product by ID (requires authentication and admin access)
router.put('/products/:id', authMiddleware, adminMiddleware, productController.updateProductById);

// Delete a product by ID (requires authentication and admin access)
router.delete('/products/:id', authMiddleware, adminMiddleware, productController.deleteProductById);

// Other routes...

module.exports = router;
