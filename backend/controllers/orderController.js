const Order = require("../models/order");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/product");

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

  res.status(200).json({
    success: true,
    order,
  });
});

// Get single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

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

// Update / Process order - ADMIN  =>   /api/v1/admin/order/:id
// exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
//   const order = await Order.findById(req.params.id);

//   console.log("UPDATE ORDER", order);

//   if (!order) {
//     return next(new ErrorHandler("Order not found with this ID", 404));
//   }

//   if (order.orderStatus === "Delivered") {
//     return next(new ErrorHandler("You have already delivered this order", 400));
//   }

//   order.orderItems.forEach(async (item) => {
//     await updateStock(item.product, item.quantity);
//   });

//   order.orderStatus = req.body.status;
//   order.deliveredAt = Date.now();

//   await order.save();

//   res.status(200).json({
//     success: true,
//   });
// });

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
