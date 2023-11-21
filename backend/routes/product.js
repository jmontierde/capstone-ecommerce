const express = require("express");
const router = express.Router();

// Route from POSTMAN

const {
  getProducts,
  newProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getProductReviews,
  deleteReview,
  getAdminProducts,
  getAllCategories,
  relatedProduct,
  newWishlist,
  deleteWishlist,
  getWishlist,
} = require("../controllers/productController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

router.route("/products").get(getProducts); // This is the path link from POSTMAN
router.route("/categories").get(getAllCategories);
router.route("/admin/products").get(getAdminProducts);
router.route("/product/:productId").get(getSingleProduct);

router.route("/products/related").get(isAuthenticatedUser, relatedProduct);
// router.route('/admin/product/:id').put(updateProduct)
router
  .route("/admin/product/:productId")
  .put(isAuthenticatedUser, authorizeRoles("admin", "staff"), updateProduct)
  .delete(isAuthenticatedUser, authorizeRoles("admin", "staff"), deleteProduct);

// Update your routes to use a consistent structure
router.get("/wishlist", isAuthenticatedUser, getWishlist);
router.post("/wishlist/add/:productId", isAuthenticatedUser, newWishlist);
router.delete(
  "/wishlist/remove/:productId",
  isAuthenticatedUser,
  deleteWishlist
);

router
  .route("/admin/product/new")
  .post(isAuthenticatedUser, authorizeRoles("admin", "staff"), newProduct);

router.route("/review").post(isAuthenticatedUser, createProductReview);
router.route("/reviews").get(isAuthenticatedUser, getProductReviews);
router.route("/reviews").delete(isAuthenticatedUser, deleteReview);

module.exports = router;
