// userController.js
const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../services/emailService');

exports.register = asyncHandler(async(req, res) => {
    const { name, email, phone, password, village, district, state, location } = req.body;

    // Create user
    const user = await User.create({
        name,
        email,
        phone,
        password,
        village,
        district,
        state,
        location
    });

    // Generate verification token
    const verificationToken = user.getVerificationToken();
    await user.save();

    // Send verification email
    await sendEmail({
        email: user.email,
        subject: 'Email Verification',
        template: 'verification',
        data: { token: verificationToken }
    });

    sendTokenResponse(user, 200, res);
});

exports.login = asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorResponse('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
        return next(new ErrorResponse('Invalid credentials', 401));
    }

    user.lastLogin = Date.now();
    await user.save();

    sendTokenResponse(user, 200, res);
});