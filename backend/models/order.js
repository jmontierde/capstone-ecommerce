const { default: mongoose } = require("mongoose");
const moongose = require("mongoose");

const orderSchema = mongoose.Schema({
  orderId: {
    type: Number,
    required: true,
  },
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
    },
    phoneNo: {
      type: String,
      required: true,
    },
    postalCode: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Product",
      },
    },
  ],
  paymentInfo: {
    id: {
      type: String,
    },
    status: {
      type: String,
    },
  },
  paidAt: {
    type: Date,
  },

  itemsPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0.0,
  },
  orderStatus: {
    type: String,
    enum: [
      "Order Placed",
      "Order Ready",
      "In Transit",
      "Out of Delivery",
      "Delivered",
    ],
    default: "Order Placed", // Initial status when an order is created
  },
  deliveredAt: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ["COD", "CARD"], // Add other payment methods as needed
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Paid", "Not Paid"], // Add more options if needed
    default: "Not Paid", // Default status for COD orders
  },
  adminVerificationStatus: {
    type: String,
    enum: ["Pending", "Accepted", "Rejected"],
    default: "Pending",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model("Order", orderSchema);
