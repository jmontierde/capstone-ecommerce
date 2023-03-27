const express = require('express');
const app = express();

var cors = require('cors')
 


const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors')

app.use(express.json());
app.use(cookieParser())
app.use(cors())


// Import all routes
const products = require('./routes/product');
const auth = require('./routes/auth')
const order = require('./routes/order')


app.use('/api/v1', products)
app.use('/api/v1', auth)
app.use('/api/v1', order)


//Middleware to handle errors
app.use(errorMiddleware)
module.exports = app;