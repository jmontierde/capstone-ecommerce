const Order = require("../models/order");
const mongoose = require("mongoose");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/product");
const Refund = require("../models/refund");
const cloudinary = require("cloudinary");
const sendSMS = require("../utils/sendSMS");
const NodeGeocoder = require("node-geocoder");
// Create a new order => /api/v1/order/new
const geocoder = NodeGeocoder({
  provider: "google",
  apiKey: "7502029e110644f39c6cfd90a63c3b83", // Replace with your Google Maps API key
});

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paymentMethod,
  } = req.body;

  let paymentStatus = "Not Paid"; // Default status for all orders

  if (paymentMethod === "COD") {
    // If it's a COD order, set the paymentStatus to "Not Paid"
    paymentStatus = "Not Paid";
  }
  const orderCounter = await mongoose.connection.db
    .collection("counters")
    .findOneAndUpdate(
      { _id: "orderId" },
      { $inc: { sequence_value: 1 } },
      { returnOriginal: false }
    );

  // Extract the next order ID
  const orderId = orderCounter.value.sequence_value;

  const order = await Order.create({
    orderId,
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
    paymentMethod,
    paymentStatus,
  });
  const smsMessage = `Thank you for placing an order with us. Your order ID is ${order.orderId}. We will process your order and keep you updated on its status.`;
  try {
    // Use the sendSMS function to send the SMS message
    await sendSMS(req.user.phoneNumber, smsMessage);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res
      .status(200)
      .json({ message: "Order created, but SMS notification failed." });
  }
});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    select: "firstName lastName email",
  });

  if (!order) {
    res.status(404).json({ message: "Order not found with this ID" });
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// Get logged in user orders => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    orders,
  });
});

// Get all orders ADMIN => /api/v1/admin/orders/
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
  const orders = await Order.find();

  let totalAmount = 0;

  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  // Check if the order status is "Delivered"
  if (order.orderStatus === "Delivered") {
    // Allow updating payment status
    if (req.body.paymentStatus) {
      if (!["Paid", "Not Paid"].includes(req.body.paymentStatus)) {
        res.status(400).json({ message: "Invalid payment status update" });
        return;
      }
      order.paymentStatus = req.body.paymentStatus;
      if (req.body.paymentStatus === "Paid") {
        order.paidAt = Date.now();
      } else {
        order.paidAt = null;
      }
    } else {
      // Payment status is not provided
      res.status(400).json({ message: "Payment status is required" });
      return;
    }
  } else {
    // Order status is not "Delivered," allow updating order status
    order.orderItems.forEach(async (item) => {
      await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.orderStatus; // Update order status

    if (req.body.paymentStatus) {
      // If paymentStatus is provided in the request, update it
      if (!["Paid", "Not Paid"].includes(req.body.paymentStatus)) {
        res.status(400).json({ message: "Invalid payment status update" });
        return;
      }
      order.paymentStatus = req.body.paymentStatus;
      if (req.body.paymentStatus === "Paid") {
        order.paidAt = Date.now();
      } else {
        order.paidAt = null;
      }
    }
  }

  await order.save();

  res.status(200).json({
    success: true,
  });
});

async function updateStock(id, quantity) {
  const product = await Product.findById(id);

  product.stock = product.stock - quantity;
  await product.save({ validateBeforeSave: false });
}

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    res.status(404).json({ message: "Order not found with this ID" });
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

exports.refundOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId, reasons, otherReason } = req.body;

  // Attempt to find the order by its ID
  const order = await Order.findById(orderId);

  if (!order) {
    // Order not found, return an error response
    return res
      .status(400)
      .json({ message: "Incorrect orderId. No order found." });
  }

  const result = await cloudinary.v2.uploader.upload(req.body.imageReason, {
    folder: "reason-refund",
    width: 150,
    crop: "scale",
  });

  try {
    const refund = await Refund.create({
      orderId,
      reasons, // Store the array of reasons
      otherReason,
      imageReason: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });
    const smsMessage = `Hello, we have received your refund request for order ID ${order._id}. We will review your request and keep you updated on its status. Thank you for your patience.`;
    await sendSMS(order.user.phoneNumber, smsMessage);
    res.status(200).json({
      success: true,
      refund,
    });
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

// Get a single refund by ID (admin)
exports.getSingleRefund = catchAsyncErrors(async (req, res, next) => {
  const refund = await Refund.findById(req.params.id);

  if (!refund) {
    res.status(404).json({ message: "Refund not found with this ID" });
  }

  res.status(200).json({
    success: true,
    refund,
  });
});

exports.allRefunds = catchAsyncErrors(async (req, res, next) => {
  const refunds = await Refund.find();

  res.status(200).json({
    success: true,
    refunds,
  });
});

// Update refund => /api/v1/admin/refund/:id
exports.updateRefund = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  const refund = await Refund.findById(req.params.id);

  if (!refund) {
    res.status(404).json({ message: "Refund not found" });
  }

  // Update the refund status based on the value passed in the request body
  refund.status = status;

  await refund.save();

  res.status(200).json({
    success: true,
    refund,
  });
});

// Delete refund => /api/v1/admin/refund/:id
exports.deleteRefund = catchAsyncErrors(async (req, res, next) => {
  const refund = await Refund.findById(req.params.id);

  if (!refund) {
    res.status(404).json({ message: "Refund not found with this ID" });
  }

  await refund.remove();

  res.status(200).json({
    success: true,
  });
});

// COD orders
exports.createOrderFromCOD = catchAsyncErrors(async (req, res, next) => {
  try {
    const { orderId, numItems, amount, status } = req.body;

    const order = await Order.create({
      orderId,
      numItems,
      amount,
      status,
      paymentMethod: "COD", // Set payment method to COD
      shippingInfo: req.body.shippingInfo, // Assuming shippingInfo is sent in the request body
      user: req.user._id, // Assuming user information is available in req.user
    });

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Order - ADMIN => /api/v1/admin/orders/:id
exports.updateOrderFromCOD = catchAsyncErrors(async (req, res, next) => {
  const { orderId, numItems, amount, status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  // Update order properties
  order.orderId = orderId;
  order.numItems = numItems;
  order.amount = amount;
  order.status = status;

  await order.save();

  res.status(200).json({
    success: true,
  });
});

exports.deleteOrderFromCOD = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});
