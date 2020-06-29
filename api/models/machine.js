const mongoose = require("mongoose");

const machineSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  type: { type: String, required: true },
  code: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model("Machine", machineSchema);
