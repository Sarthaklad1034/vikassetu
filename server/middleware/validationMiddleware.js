// validationMiddleware.js
const { check, validationResult } = require('express-validator');
const ErrorResponse = require('../utils/errorResponse');

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ErrorResponse(errors.array()[0].msg, 400));
    }
    next();
};

exports.validateUser = [
    check('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ max: 50 })
    .withMessage('Name cannot exceed 50 characters'),
    check('email')
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage('Please provide a valid email'),
    check('phone')
    .trim()
    .matches(/^[0-9]{10}$/)
    .withMessage('Please provide a valid 10-digit phone number'),
    check('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
    handleValidationErrors
];

exports.validateProject = [
    check('title')
    .trim()
    .notEmpty()
    .withMessage('Project title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
    check('description')
    .trim()
    .notEmpty()
    .withMessage('Project description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
    check('category')
    .isIn(['roads', 'water-supply', 'sanitation', 'education', 'healthcare', 'agriculture', 'other'])
    .withMessage('Invalid project category'),
    check('budget.estimated')
    .isNumeric()
    .withMessage('Estimated budget must be a number'),
    check('location.coordinates')
    .isArray()
    .withMessage('Location coordinates are required'),
    handleValidationErrors
];

exports.validateGrievance = [
    check('title')
    .trim()
    .notEmpty()
    .withMessage('Grievance title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
    check('description')
    .trim()
    .notEmpty()
    .withMessage('Grievance description is required')
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
    check('category')
    .isIn(['infrastructure', 'public-services', 'welfare-schemes', 'corruption', 'administration', 'other'])
    .withMessage('Invalid grievance category'),
    check('location.coordinates')
    .isArray()
    .withMessage('Location coordinates are required'),
    handleValidationErrors
];