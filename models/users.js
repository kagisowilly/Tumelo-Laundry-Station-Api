const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_id: {
    type: String,
  },
  user_name: {
    type: String,
    required: true,
    unique:true
  },
  user_email: {
    type: String,
    required: true,
    unique: true,
  },
  user_password: {
    type: String,
    required: true,
  },
  user_contactNumber: {
    type: String,
    required: true,
  },
  join_date: {
    type: Date,
    required: false,
    default:Date.now,
  },
  admin:{
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Users", userSchema);