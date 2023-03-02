const express = require('express')
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
} = require('../controllers/productController')

const {isAuthenticatedUser, authorizeRoles} = require('../middlewares/auth')

router.route('/products').get(isAuthenticatedUser, getProducts) // This is the path link from POSTMAN
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/product/new').post(isAuthenticatedUser,newProduct);
// router.route('/admin/product/:id').put(updateProduct)
router.route('/admin/product/:id')
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateProduct)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteProduct)

router.route('/review').put(isAuthenticatedUser, createProductReview);
router.route('/reviews').get(isAuthenticatedUser, getProductReviews);
router.route('/reviews').delete(isAuthenticatedUser, deleteReview);


module.exports = router;