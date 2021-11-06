const jwt = require('jsonwebtoken');
const asyncHandler = require('./async');
const ErrorResponce = require('../utils/errorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }


    // Make sure token is exists
    if (!token) {
        return next(new ErrorResponce('Not authorizdd to access this route', 401))
    } // 401 - unauthorized

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log(decoded);

        req.user = await User.findById(decoded.id);

        next();
    } catch(err) {
        return next(new ErrorResponce('Not authorizdd to access this route', 401))
    }
});


// Grant access to specefic roles
// publisher, user, admin
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponce(`User role ${req.user.role} is not authorized`, 403)); // 403 forbidden error
        }
        next();
    }
}