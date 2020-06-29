const mongoose = require("mongoose");

const assignInfoSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  operator_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  operator_name: { type: String, required: true },
  machine_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  machine_code: { type: String, required: true },
  shift: { type: String, required: true },
  assigned_date: { type: Date, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model("AssignInfo", assignInfoSchema);
