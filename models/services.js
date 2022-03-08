
const mongoose = require("mongoose");

const productsSchema = new mongoose.Schema({
  product_name: {
    type: String,
    required: true,
  },
  product_price: {
    type: String,
    required: true,
  },
  product_image: {
    type: String,
    required: true,
  },
  product_category: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("Products", productsSchema);