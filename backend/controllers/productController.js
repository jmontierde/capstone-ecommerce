const Product = require("../models/product");
// Price and stock doesn't have validation
const mongoose = require("mongoose");

const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middlewares/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const { request } = require("../app");
const cloudinary = require("cloudinary");
const Category = require("../models/category");
const User = require("../models/user");
const Wishlist = require("../models/wishlist");
const Order = require("../models/order");
// Wishlist

// Update the newWishlist controller
exports.newWishlist = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Check if the product is already in the user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
      const newWishlist = new Wishlist({
        user: userId,
        products: [productId],
      });
      await newWishlist.save();
    } else {
      // If wishlist exists, check and add the product
      if (!wishlist.products) {
        // If products array doesn't exist, create it
        wishlist.products = [productId];
      } else if (wishlist.products.includes(productId)) {
        return res.status(400).json({
          message: "Product is already in the wishlist",
          success: false,
        });
      } else {
        wishlist.products.push(productId);
      }
      await wishlist.save();
    }

    res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
});

// Get user's wishlist with product details
exports.getWishlist = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Fetch product details based on productIds
    const productDetails = await Product.find({
      productId: { $in: wishlist.products },
    });

    res.status(200).json({ products: productDetails });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a category
exports.deleteWishlist = catchAsyncErrors(async (req, res, next) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;

    // Find the user's wishlist
    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Check if the product exists in the wishlist
    if (!wishlist.products || !wishlist.products.includes(productId)) {
      return res
        .status(404)
        .json({ message: "Product not found in the wishlist" });
    }

    // Remove the product from the wishlist
    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();

    res.status(200).json({ message: "Product removed from the wishlist" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//Create a category
exports.newCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const { name } = req.body;
    const category = await Category.create({ name });
    res.status(201).json({
      success: true,
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category creation failed",
    });
  }
});

//Get Categories
exports.getAllCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();
  res.status(200).json({
    success: true,
    categories,
  });
});

// Delete a category
exports.deleteCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const categoryId = req.params.id; // Assuming the category ID is passed as a URL parameter

    // Check if the category with the given ID exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Delete the category
    await category.remove();

    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category deletion failed",
    });
  }
});

// Update a category
exports.updateCategory = catchAsyncErrors(async (req, res, next) => {
  try {
    const categoryId = req.params.id; // Assuming the category ID is passed as a URL parameter
    const { name } = req.body;

    // Check if the category with the given ID exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Update the category's name
    category.name = name;
    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Category update failed",
    });
  }
});

// Create new product => /api/v1/admin/product/new
// Create new product => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    let images = [];
    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload_large(images[i], {
        folder: "ecommerce-image",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    // Find the category ObjectId based on the category name
    const categoryName = req.body.category; // Assuming that "category" field contains the category name
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(400).json({ error: "Invalid category" });
    }

    // Set the correct category ObjectId
    req.body.category = category._id;
    // Set the product ID
    const counter = await mongoose.connection.db
      .collection("counters")
      .findOneAndUpdate(
        { _id: "productId" },
        { $inc: { sequence_value: 1 } },
        { returnOriginal: false }
      );
    const productId = counter.value.sequence_value;
    req.body.productId = productId;

    // Set the product ID
    req.body.productId = productId;

    const product = await Product.create(req.body);

    console.log(product);

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Image upload failed" });
  }
});

// Get all products => /api/v1/products?keyword
exports.getProducts = catchAsyncErrors(async (req, res, next) => {
  const resPerPage = 100;
  const productsCount = await Product.countDocuments();
  console.log("resPerPage", resPerPage);

  let query = {};

  if (req.query.category) {
    const categories = req.query.category.split(",");
    query.category = { $in: categories };
  }

  if (req.query.keyword) {
    query.name = {
      $regex: req.query.keyword,
      $options: "i",
    };
  }

  var oldQuery = {};
  switch (req.query.sort) {
    case "asc-price":
      oldQuery = { price: 1 };
      break;
    case "desc-price":
      oldQuery = { price: -1 };
      break;
    case "asc-title":
      oldQuery = { name: 1 };
      break;

    case "desc-title":
      oldQuery = { name: -1 };
      break;
    case "new-arrival":
      oldQuery = { createdAt: -1 };
      break;
    default:
      break;
  }

  const apiFeatures = new APIFeatures(
    Product.find(query).sort(oldQuery).collation({ locale: "en", strength: 2 }),
    req.query
  ).pagination(resPerPage);

  let products = await apiFeatures.query;
  const filteredProductsCount = await Product.countDocuments(query, oldQuery);

  res.status(200).json({
    success: true,
    productsCount,
    resPerPage,
    filteredProductsCount,
    products,
  });
});

// Get all products (Admin)  =>   /api/v1/admin/products
exports.getAdminProducts = catchAsyncErrors(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

//Get single product details => /api/v1/product/:productId

exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findOne({ productId: req.params.productId });
  if (!product) {
    res.status(404).json({ message: "Invalid Email or Password" });
  }

  res.status(200).json({
    success: true,
    product,
  });
});

//Update Product => /api/v1/admin/product/:id
//Update Product => /api/v1/admin/product/:id
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findOne({ productId: req.params.productId });

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  let images = [];
  if (typeof req.body.images === "string") {
    images.push(req.body.images);
  } else {
    images = req.body.images;
  }

  if (images !== undefined) {
    // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
      const result = await cloudinary.v2.uploader.destroy(
        product.images[i].public_id
      );
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
  }

  product = await Product.findOneAndUpdate(
    { productId: req.params.productId },
    req.body,
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    product,
  });
});

//Delete Product => /api/v1/admin/product/:id
exports.relatedProduct = catchAsyncErrors(async (req, res, next) => {
  try {
    const productId = req.query.productId;

    const currentProduct = await Product.findOne({ productId });
    // console.log("req", req);
    // console.log("productId", productId);

    if (!currentProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    const relatedProducts = await Product.find({
      category: currentProduct.category,
      productId: { $ne: productId },
    })
      .sort({ ratings: -1 })
      .limit(4);

    res.json({ relatedProducts });
  } catch (error) {
    console.error("Error fetching related products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//Delete Product => /api/v1/admin/product/:id
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findOne({ productId: req.params.productId });

  if (!product) {
    res.status(401).json({ message: "Product not found" });
  }

  // Deleting images associated with the product
  for (let i = 0; i < product.images.length; i++) {
    const result = await cloudinary.v2.uploader.destroy(
      product.images[i].public_id
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: "Product is deleted",
  });
});

//Create new review => /api/v1/review
//Create new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  try {
    const { rating, comment, productId } = req.body;

    const user = await User.findById(req.user._id);

    const review = {
      reviewId: 0, // Update this with your logic to generate a unique reviewId
      user: req.user._id,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      avatar: req.user.avatar,
      rating: Number(rating),
      comment,
    };

    // Use findOne to find the product based on the productId
    const product = await Product.findOne({ productId: Number(productId) });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    const isReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((existingReview) => {
        if (existingReview.user.toString() === req.user._id.toString()) {
          existingReview.comment = comment;
          existingReview.rating = rating;
        }
      });
    } else {
      const counter = await mongoose.connection.db
        .collection("counters")
        .findOneAndUpdate(
          { _id: "reviewId" },
          { $inc: { sequence_value: 1 } },
          { returnOriginal: false }
        );
      const reviewId = counter.value.sequence_value;
      review.reviewId = reviewId;

      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    product.ratings =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.error("Error creating product review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findOne({
    productId: req.query.productId,
  }).populate({
    path: "reviews",
    populate: {
      path: "user",
      select: "firstName lastName avatar",
    },
  });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findOne({ productId: req.query.productId });

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found.",
    });
  }

  const reviews = product.reviews.filter(
    (review) => review._id.toString() !== req.query.id.toString()
  );

  const numOfReviews = reviews.length;

  const ratings =
    product.reviews.reduce((acc, item) => item.rating + acc, 0) /
    (numOfReviews === 0 ? 1 : numOfReviews); // Prevent division by zero

  await Product.findOneAndUpdate(
    { productId: req.query.productId },
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
