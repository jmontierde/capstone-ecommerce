const express = require("express");
const router = express.Router();

const {
  newOrder,
  getSingleOrder,
  myOrders,
  allOrders,
  updateOrder,
  deleteOrder,
  refundOrder,
  getSingleRefund,
  allRefunds,
  deleteRefund,
  updateRefund,
} = require("../controllers/orderController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/order/new").post(isAuthenticatedUser, newOrder);
router.route("/order/refund").post(isAuthenticatedUser, refundOrder);
router.route("/order/refund/:id").get(isAuthenticatedUser, getSingleRefund);

router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrders);

router
  .route("/admin/order/refunds")
  .get(isAuthenticatedUser, authorizeRoles("admin", "staff"), allRefunds);

router
  .route("/admin/refund/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin", "staff"), updateRefund)
  .delete(isAuthenticatedUser, authorizeRoles("admin", "staff"), deleteRefund);

router
  .route("/admin/orders")
  .get(isAuthenticatedUser, authorizeRoles("admin", "staff"), allOrders);
router
  .route("/admin/order/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin", "staff"), updateOrder)
  .delete(isAuthenticatedUser, authorizeRoles("admin", "staff"), deleteOrder);

// router
//   .route("/admin/orders")
//   .get(isAuthenticatedUser, authorizeRoles("staff"), allOrders);
// router
//   .route("/admin/order/:id")
//   .put(isAuthenticatedUser, authorizeRoles("staff"), updateOrder)
//   .delete(isAuthenticatedUser, authorizeRoles("staff"), deleteOrder);

module.exports = router;
