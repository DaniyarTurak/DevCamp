const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register user
// @route   GET /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    // Create user
    const user = await User.create({ // we have access to all field in middleware
        name,
        email,
        password,
        role
    });

    // Create token 
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    });
});

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    
    // Validate email and password
    if (!email || !password) {
        next(new ErrorResponse(`Please provide email and password`, 400));
    }

    // Check for user
    // in model select: false, but here we want to include password
    const user = await User.findOne({ email: email }).select('+password');

    if (!user) {
        next(new ErrorResponse(`Invalid credentail`, 401)); // 401 auth error
    }

    // Check if passowrds mathces
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        next(new ErrorResponse(`Invalid credentail`, 401));
    }

    // Create token 
    const token = user.getSignedJwtToken();

    res.status(200).json({
        success: true,
        token: token
    });
});