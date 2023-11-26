const Order = require("../models/order");
const mongoose = require("mongoose");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const Product = require("../models/product");
const Refund = require("../models/refund");
const cloudinary = require("cloudinary");
const sendSMS = require("../utils/sendSMS");
const sendEmail = require("../utils/sendEmail");

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
    // await sendSMS(req.user.phoneNumber, smsMessage);
    await sendEmail(req.user.email, "Order Notification", smsMessage);

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
    select: "firstName lastName email phoneNumber", // Adjust the fields you want to retrieve
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
  const order = await Order.findById(req.params.id).populate("user");
  const userEmail = order.user.email;
  const userPhoneNumber = order.user.phoneNumber;

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
    // for (const item of order.orderItems) {
    //   await updateStock(item.product, item.quantity);
    // }

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
  try {
    // Send email notification for order update to the user
    const userEmail = order.user.email; // Assuming user's email is stored in order.user.email
    const subject = "Order Update";
    const message = `Dear User, Your order with ID ${order.orderId} has been updated. Order status: ${order.orderStatus}. Payment status: ${order.paymentStatus}.`; // Customize the message as needed

    await sendEmail(userEmail, subject, message);

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email notification" });
  }

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// Admin accepts or rejects an order by ID => /api/v1/admin/order/verify/:id
exports.verifyOrder = catchAsyncErrors(async (req, res, next) => {
  const orderId = req.params.id;

  try {
    // const order = await Order.findById(orderId);
    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Order not found with this ID" });
    }

    if (order.adminVerificationStatus !== "Pending") {
      return res
        .status(400)
        .json({ message: "Admin has already processed this order" });
    }

    if (
      !req.body.adminVerificationStatus ||
      !["Accepted", "Rejected"].includes(req.body.adminVerificationStatus)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid verification status update" });
    }

    if (req.body.adminVerificationStatus === "Accepted") {
      for (const item of order.orderItems) {
        const product = await Product.findOne({ productId: item.productId });

        if (!product || product.stock < item.quantity) {
          return res.status(400).json({
            message: `Product with productId ${item.product} is out of stock`,
          });
        }

        await updateStock(item.productId, item.quantity);
        const userEmail = order.user.email;
        const emailSubject = "Order Verification";
        const emailMessage = `Your order #${order.orderId} has been verified successfully.`;
        await sendEmail(userEmail, emailSubject, emailMessage);

        // Return success response
        return res
          .status(200)
          .json({ success: true, message: "Order has been verified" });
      }
    } else if (req.body.adminVerificationStatus === "Rejected") {
      const userEmail = order.user.email;
      const emailSubject = "Order Verification";
      const emailMessage = `Your order #${order.orderId} has been rejected.`;
      await sendEmail(userEmail, emailSubject, emailMessage);

      await order.remove();
      return res
        .status(200)
        .json({ success: true, message: "Order has been rejected" });
    }

    order.adminVerificationStatus = req.body.adminVerificationStatus;
    await order.save();

    console.log(
      `Order successfully verified with status: ${req.body.adminVerificationStatus}`
    );
    res.status(200).json({ success: true, message: "Order has been verified" });
  } catch (error) {
    console.error("Error verifying order:", error);
    res
      .status(500)
      .json({ message: "Error verifying order. Please try again." });
  }
});

async function updateStock(productId, quantity) {
  try {
    const product = await Product.findOne({ productId });

    console.log("updateStock product", product);

    if (!product) {
      console.error(`Product with productId ${productId} not found`);
      return;
    }

    product.stock -= quantity;
    await product.save({ validateBeforeSave: false });

    console.log(`Stock updated for product with productId ${productId}`);
  } catch (error) {
    console.error(
      `Error updating stock for product with productId ${productId}:`,
      error
    );
  }
}

// Delete order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user");

  if (!order) {
    res.status(404).json({ message: "Order not found with this ID" });
  }

  const userEmail = order.user.email; // Assuming user's email is stored in order.user.email
  const subject = "Order Deletion";
  const message = `
    
    Dear ${order.user.firstName} ${order.user.lastName},

We regret to inform you that your recent order with order ID ${order.orderId} has been deleted by the admin.

Unfortunately, due to unforeseen circumstances, it was necessary to cancel this order. We apologize for any inconvenience this may cause.

If you have any concerns or queries regarding this cancellation, please feel free to reach out to our customer support team at ${process.env.SMTP_FROM_EMAIL}.

Thank you for your understanding.

Best regards,
${process.env.COMPANY_NAME}
    
    `; // Customize the message as needed

  await sendEmail(userEmail, subject, message);

  await order.remove();

  res.status(200).json({
    success: true,
  });
});

exports.refundOrder = catchAsyncErrors(async (req, res, next) => {
  const { orderId, reasons, otherReason } = req.body;

  // Attempt to find the order by its ID
  const order = await Order.findOne({ orderId }).populate("user");

  if (!order) {
    // Order not found, return an error response
    return res
      .status(400)
      .json({ message: "Incorrect orderId. No order found." });
  }

  // Check if paymentStatus is 'Paid' and orderStatus is 'Delivered' before allowing a refund
  if (order.paymentStatus !== "Paid" || order.orderStatus !== "Delivered") {
    return res.status(400).json({
      message:
        "Refund is only allowed for orders with paymentStatus as 'Paid' and orderStatus as 'Delivered'.",
    });
  }

  // Additional code for refund creation remains unchanged
  const result = await cloudinary.v2.uploader.upload(req.body.imageReason, {
    folder: "reason-refund",
    width: 150,
    crop: "scale",
  });

  try {
    const refund = await Refund.create({
      orderId: order.orderId,
      reasons,
      otherReason,
      imageReason: {
        public_id: result.public_id,
        url: result.secure_url,
      },
    });

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
// Update refund => /api/v1/admin/refund/:id
// Update refund => /api/v1/admin/refund/:id
exports.updateRefund = catchAsyncErrors(async (req, res, next) => {
  const { status } = req.body;

  try {
    // Fetch the refund data and populate the 'user' field
    const refund = await Refund.findById(req.params.id).populate("user");

    if (!refund) {
      return res.status(404).json({ message: "Refund not found" });
    }

    // Access user details if the 'user' field is populated
    if (refund.user) {
      const userEmail = refund.user.email;
      const userPhoneNumber = refund.user.phoneNumber;

      // Create an email message for refund status update
      const subject = "Refund Status Update";
      const message = `Dear User,\n\nYour refund request for order ID ${refund.orderId} has been updated. The new status is: ${status}.\n\nIf you have any further questions, please feel free to contact us.\n\nBest regards,\nThe Support Team`;

      // Send email notification for the refund update to the user
      await sendEmail(userEmail, subject, message);
    }

    // Update the refund status
    refund.status = status;
    await refund.save();

    res.status(200).json({
      success: true,
      refund,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
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
