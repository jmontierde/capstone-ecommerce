const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter product name'], // Second array will print when has an error
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
    },
    ratings: {
        type: Number,
        default: 0,
    },
    images: [{
        public_id:{
            type: String,
            required: true
        },
        url:{
            type: String,
            required: true
        },
    }],
    category: {
        parentCategory: {
          type: String,
          required: [true, 'Please select parent category for this product'],
          enum: ['Electronics', 'RELX', 'Tanks', 'Atomizers', 'Sports', 'Food']
        },
        subCategory: {
          type: String,
          required: false,
          enum: {
            values: [
              // Electronics
              'Camera',
              'Laptop',
              'Headset',
              'Computer',
              'Monitor',
              'Keyboard',
              'Mouse',
              'Tablet',
              'Smartphones',
              // RELX
              'Artisan Device',
              'Infinity Plus Device',
              'Essential Device',
              'RELX Pod',
              // Tanks
              // Atomizers
           
              // Sports
              'Fitness',
              'Camping',
              'Cycling',
              'Hiking',
              'Water Sports',
              // Food
              'Snacks',
              'Beverages',
              'Candy & Chocolate',
              'Gourmet',
              'Cooking & Baking'
            ],
            default: null // or any other valid default value
          }
        }
      },
      
      
    seller: { 
        type: String,
        required: [true, 'Please enter product seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please enter product stock'],
        maxLength: [5, 'Product name cannot exceed 5 characters'],
        default: 0
    },
    numOfReviews: { 
        type: Number,
        default: 0
    },
    reviews: [
        {
            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: { 
                type: String,
                required: true
            },
            rating: { 
                type: Number,
                required: true,
            },
            comment: { 
                type: String,
                required: true,
            }
        }
    ],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Product', productSchema)