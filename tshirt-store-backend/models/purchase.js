// models/Purchase.js
const mongoose = require('mongoose');

const purchaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  // other fields as needed
});

const Purchase = mongoose.model('Purchase', purchaseSchema);

module.exports = Purchase;