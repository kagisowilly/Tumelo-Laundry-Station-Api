
const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
  laundry_service: {
    type: String,
    required: true,
    unique: true
  },
  service_price: {
    type: String,
    required: true,
  },
  service_image: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  }
});

module.exports = mongoose.model("Services", servicesSchema);