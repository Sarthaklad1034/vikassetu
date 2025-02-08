const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const securityConfig = (app) => {
    // Security headers
    app.use(helmet());

    // Rate limiting
    const limiter = rateLimit({
        windowMs: process.env.RATE_LIMIT_WINDOW * 60 * 1000,
        max: process.env.RATE_LIMIT_MAX_REQUESTS,
        message: 'Too many requests from this IP, please try again later.',
    });
    app.use('/api', limiter);

    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization against XSS
    app.use(xss());

    // Prevent parameter pollution
    app.use(hpp({
        whitelist: [
            'duration',
            'ratingsQuantity',
            'ratingsAverage',
            'priority',
            'status'
        ]
    }));
};

module.exports = securityConfig;