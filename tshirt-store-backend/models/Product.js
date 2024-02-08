const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true },
  color: { type: String, required: true },
  stock: { type: Number, required: true },
});

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  category: { type: String, required: true },
  brand: { type: String, required: true },
  variants: { type: [variantSchema], required: true },
  
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
