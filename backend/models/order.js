const moongose = require('mongoose')

const orderSchema = moongose.Schema({
    shippingInfo:{
        address:{
            type: String,
            require: true
        },
        city:{
            type: String,
            require: true
        },
        phoneNo:{
            type: String,
            require: true
        },
        country:{
            type: String,
            require: true
        }
        
    },
    user: {
        type: moongose.Schema.Types.ObjectId,
        require: true,
        ref: 'User'
    },
    orderItems: [
        {
            name: {
                type: String,
                require: true
            },
            quantity: {
                type: Number,
                require: true
            },
            image: {
                type: String,
                require: true
            },
            price: {
                type: Number,
                require: true
            },
            user: {
                type: moongose.Schema.Types.ObjectId,
                require: true,
                ref: 'Product'
            }
        }
    ],
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        },
    },
    paidAt:{
        type: Date
    },
    itemPrice: {
        type: Number,
        require: true,
        default: 0.0
    },
    taxPrice: {
        type: Number,
        require: true,
        default: 0.0
    },
    shippingPrice: {
        type: Number,
        require: true,
        default: 0.0
    },
    totalPrice: {
        type: Number,
        require: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        require: true,
        default: 'Processing'
    },
    deliveredAt: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

module.exports = moongose.model('Order', orderSchema)