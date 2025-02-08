const Community = require('../models/Community');
const asyncHandler = require('express-async-handler');
const ErrorResponse = require('../utils/errorResponse');
const notificationService = require('../services/notificationService');

exports.createPost = asyncHandler(async(req, res) => {
    req.body.author = req.user.id;

    // Handle specific post types
    if (req.body.type === 'poll') {
        // Validate poll options
        if (!req.body.poll || !req.body.poll.options || req.body.poll.options.length < 2) {
            return next(new ErrorResponse('Poll must have at least 2 options', 400));
        }
    }

    if (req.body.type === 'meeting' || req.body.type === 'gram-sabha') {
        // Generate meeting link
        req.body.meeting = {
            ...req.body.meeting,
            link: `https://meet.vikassetu.gov.in/${Date.now()}`
        };
    }

    const post = await Community.create(req.body);

    // Notify relevant users based on post type and visibility
    await notificationService.notifyUsers({
        type: 'new_post',
        post: post._id,
        postType: post.type,
        village: post.location.village
    });

    res.status(201).json({ success: true, data: post });
});

exports.interactWithPost = asyncHandler(async(req, res, next) => {
    const { action } = req.body;
    const post = await Community.findById(req.params.id);

    if (!post) {
        return next(new ErrorResponse(`Post not found with id ${req.params.id}`, 404));
    }

    // Check visibility permissions
    if (!post.canView(req.user)) {
        return next(new ErrorResponse('Not authorized to view this post', 403));
    }

    switch (action) {
        case 'like':
            await post.toggleLike(req.user.id);
            break;
        case 'comment':
            await post.addComment({
                content: req.body.content,
                author: req.user.id
            });
            break;
        case 'vote':
            if (post.type !== 'poll') {
                return next(new ErrorResponse('This post is not a poll', 400));
            }
            await post.votePoll(req.user.id, req.body.optionIndex);
            break;
        default:
            return next(new ErrorResponse('Invalid action', 400));
    }

    res.status(200).json({ success: true, data: post });
});

// Helper function for user controller
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                village: user.village,
                district: user.district
            }
        });
};