const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true, default: 0 },
  created_by: { type: mongoose.Schema.Types.ObjectId, require: true }
});

module.exports = mongoose.model("Product", productSchema);
