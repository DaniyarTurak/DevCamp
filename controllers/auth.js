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

    // Send cookie with token in it
    sendTokenResponse(user, 200, res);
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

    sendTokenResponse(user, 200, res);
});

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        data: user
    });
});

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        next(new ErrorResponse(`There is no user with that email`, 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();

    // we store it in hash version in db, but when sending it wiil be regular version, below resetToken is regular, but in db hashed
    //console.log(resetToken);

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        data: user
    });
});

// Get token from model, create cookie, send response
const sendTokenResponse = (user, statusCode, res) => {
    //Create token
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // 30 days
        httpOnly: true // only access client side script
    };


    if (process.env.NODE_ENV === 'production') {
        options.secure = true; // secure flag
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token: token
        });
};