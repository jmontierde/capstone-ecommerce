const Order = require("../models/order");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/product");
const Refund = require("../models/refund");
const cloudinary = require("cloudinary");
const sendSMS = require("../utils/sendSMS");

// Create a new order => /api/v1/order/new

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;

  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
    paidAt: Date.now(),
    user: req.user._id,
  });
  const smsMessage = `Thank you for placing an order with us. Your order ID is ${order._id}. We will process your order and keep you updated on its status.`;
  try {
    // Use the sendSMS function to send the SMS message
    await sendSMS(req.user.phoneNumber, smsMessage);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(
      new ErrorHandler("Order created, but SMS notification failed.", 200)
    ); // Handle SMS sending failure gracefully
  }
});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate({
    path: "user",
    select: "firstName lastName email",
  });

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
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

exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // Add validation for status transitions here
  switch (status) {
    case "Order Ready":
      if (order.orderStatus !== "Order Placed") {
        return next(new ErrorHandler("Invalid status transition", 400));
      }
      break;
    case "In Transit":
      if (order.orderStatus !== "Order Ready") {
        return next(new ErrorHandler("Invalid status transition", 400));
      }
      break;
    case "Out of Delivery":
      if (order.orderStatus !== "In Transit") {
        return next(new ErrorHandler("Invalid status transition", 400));
      }
      break;
    case "Delivered":
      if (order.orderStatus !== "Out of Delivery") {
        return next(new ErrorHandler("Invalid status transition", 400));
      }
      order.deliveredAt = Date.now();
      break;
    default:
      return next(new ErrorHandler("Invalid status", 400));
  }

  order.orderItems.forEach(async (item) => {
    await updateStock(item.product, item.quantity);
  });

  order.orderStatus = status;
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
    return next(new ErrorHandler("Order not found with this ID", 404));
  }

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

exports.refundOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId, reasons, otherReason } = req.body; // Change "reason" to "reasons"

  const order = await Order.findById(orderId);
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
    next(new ErrorHandler(error.message, 400));
  }
});

// Get a single refund by ID (admin)
exports.getSingleRefund = catchAsyncErrors(async (req, res, next) => {
  const refund = await Refund.findById(req.params.id);

  if (!refund) {
    return next(new ErrorHandler("Refund not found with this ID", 404));
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
    return next(new ErrorHandler("Refund not found", 404));
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
    return next(new ErrorHandler("Refund not found with this ID", 404));
  }

  await refund.remove();

  res.status(200).json({
    success: true,
  });
});
