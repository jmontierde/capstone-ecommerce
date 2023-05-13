const ErrorHandler = require("../utils/errorHandler");
const User = require('../models/user');

const jwt = require("jsonwebtoken")
const catchAsyncErrors = require("./catchAsyncErrors");

// Checks if user is authenticated or not
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {

    // const { token } = req.cookies
    // console.log('Req Header', req)

    // if (!token) {
    //     return next(new ErrorHandler('Login first to access this resource.', 401))
    // }
    // console.log('Token',token)
    // const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // req.user = await User.findById(decoded.id);
    // next()

    const token = req.header('Authorization').replace('Bearer ', '');

    console.log('TOKEN', token)
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);  

    // Find the user with the decoded user ID
    const user = await User.findOne({ _id: decoded.id });

    // If the user doesn't exist, return an error
    if (!user) {
      return res.status(401).json({ message: 'Authentication failed' });
    }

    // Attach the user object to the request object
    req.user = user;

    // Call the next middleware function
    next();

})
// Handling users roles
exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new ErrorHandler(`Role (${req.user.role}) is not allowed to acccess this resource`, 403))
        }
        next()
    }
}