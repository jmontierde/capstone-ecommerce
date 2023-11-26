// models/refund.js

const mongoose = require("mongoose");

const refundSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to the User model
  },
  imageReason: {
    public_id: String,
    url: String,
  },
  orderId: {
    type: Number, // Use Number type
    required: true,
  },
  reasons: {
    type: [String], // Array of reasons
    required: true,
  },
  otherReason: {
    type: String, // Array of reasons
    required: false,
  },
  status: {
    type: String, // 'pending', 'accepted', 'rejected'
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Refund", refundSchema);
