// userRoutes.js
const express = require('express');
const router = express.Router();
const {
    register,
    login,
    // logout,
    // getMe,
    // updateProfile,
    // updatePassword,
    // forgotPassword,
    // resetPassword,
    // verifyEmail
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const { validateUser } = require('../middleware/validationMiddleware');

// Public routes
router.post('/register', validateUser, register);
router.post('/login', login);
// router.post('/forgot-password', forgotPassword);
// router.put('/reset-password/:resetToken', resetPassword);
// router.get('/verify-email/:token', verifyEmail);

// // Protected routes
// router.use(protect); // Apply protection to all routes below
// router.get('/me', getMe);
// router.put('/update-profile', validateUser, updateProfile);
// router.put('/update-password', updatePassword);
// router.get('/logout', logout);

// Admin only routes
router.use(authorize('admin'));
router.route('/users')
    .get(async(req, res) => {
        /* Admin user management logic */
    });

module.exports = router;