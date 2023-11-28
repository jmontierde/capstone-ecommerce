const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    unique: true,
  },
  stickerSize: {
    type: String,
  },
  stickerPosition: {
    type: String,
  },
  suggestion: {
    type: String,
  },
  name: {
    type: String,
    required: [true, "Please enter product name"], // Second array will print when has an error
    trim: true,
    maxLength: [100, "Product name cannot exceed 100 characters"],
  },
  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [5, "Product name cannot exceed 5 characters"],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
    ref: "Category", // Name of the Category model
    required: [true, "Please select category for this product"],
  },
  sticker: {
    size: {
      type: String, // You can define your own data type or use predefined values for sizes
      enum: ["2x2", "4x4", "8x8"], // Example predefined sticker sizes
    },
    position: {
      type: String,
      enum: ["top-left", "top-right", "center", "bottom-left", "bottom-right"], // Example predefined positions
    },
  },
  seller: {
    type: String,
    required: [true, "Please enter product seller"],
  },
  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    maxLength: [5, "Product name cannot exceed 5 characters"],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      reviewId: {
        type: Number, // or whatever type you want for reviewId
        required: true,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      avatar: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Product", productSchema);
