const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true,
  },
  user_email: {
    type: String,
    required: true,
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
  },
  cart: {
    type: Array,
    required: false,
    default: [],
  },
});

module.exports = mongoose.model("Users", userSchema);