const mongoose = require('mongoose')

const usersSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: true
  },
  user_email: {
    type: String,
    required: true
  },
  user_password: {
    type: String,
    required: true,
  },
  
  user_avatar: {
    type: String,
    required: false,
    default: null
  },
  user_about: {
    type: Date,
    required: false,
    default: null
  }
})

module.exports = mongoose.model('users', usersSchema)