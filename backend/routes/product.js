const express = require('express')
const router = express.Router();

// Route from POSTMAN

const {getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct} = require('../controllers/productController')

const {isAuthenticatedUser} = require('../middlewares/auth')
router.route('/products').get( getProducts) // This is the path link from POSTMAN
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/product/new').post(isAuthenticatedUser,newProduct);
// router.route('/admin/product/:id').put(updateProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser,updateProduct).delete(isAuthenticatedUser,deleteProduct)


module.exports = router;