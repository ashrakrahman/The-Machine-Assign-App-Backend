const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  username: { type: String, required: true, maxlength: 1024 },
  email: { type: String, required: true, maxlength: 256 },
  password: { type: String, required: true, maxlength: 256 },
  access_token: { type: String, default: null, maxlength: 1024 },
  refresh_token: { type: String, default: null, maxlength: 1024 },
  is_active: { type: Number, default: 1 },
  user_type: { type: String, required: true, maxlength: 256 }
});

module.exports = mongoose.model("User", userSchema);
