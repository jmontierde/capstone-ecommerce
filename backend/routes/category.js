const express = require("express");
const router = express.Router();

// Route from POSTMAN

const {
  newCategory,
  deleteCategory,
  updateCategory,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/admin/category/new").post(isAuthenticatedUser, newCategory);

router
  .route("/admin/category/:id")
  .put(isAuthenticatedUser, authorizeRoles("admin", "staff"), updateCategory)
  .delete(
    isAuthenticatedUser,
    authorizeRoles("admin", "staff"),
    deleteCategory
  );

module.exports = router;
