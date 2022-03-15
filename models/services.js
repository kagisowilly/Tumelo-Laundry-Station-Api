
const mongoose = require("mongoose");

const servicesSchema = new mongoose.Schema({
  laundry_service: {
    type: String,
    required: true,
  },
  service_price: {
    type: String,
    required: true,
  },
  service_image: {
    type: String,
    required: true,
  },
  // date: {
  //   type: String,
  //   required: true,
  // },
  // time: {
  //   type: String,
  //   required: true,
  // },
  author: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Services", servicesSchema);