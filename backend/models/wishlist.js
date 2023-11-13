// models/Wishlist.js
const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId, // Change the type to ObjectId
    ref: "User",
  },
  products: [
    {
      type: Number, // Change the type to Number if productId is a Number
      ref: "Product",
    },
  ],
});

module.exports = mongoose.model("Wishlist", wishlistSchema);
