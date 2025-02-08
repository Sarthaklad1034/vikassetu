const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const environment = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT, 10) || 5000,
    wsPort: parseInt(process.env.WS_PORT, 10) || 5001,

    mongodb: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    },

    jwt: {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRE,
        cookieExpire: parseInt(process.env.JWT_COOKIE_EXPIRE, 10) || 7
    },

    email: {
        resendApiKey: process.env.RESEND_API_KEY,
        fromEmail: process.env.FROM_EMAIL,
        supportEmail: process.env.SUPPORT_EMAIL
    },

    services: {
        openai: {
            apiKey: process.env.OPENAI_API_KEY
        },
        maps: {
            apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
    },

    security: {
        cors: {
            origin: process.env.CORS_ORIGIN,
            credentials: true
        },
        rateLimit: {
            windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 10) * 60 * 1000,
            max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10)
        }
    },

    isProduction: process.env.NODE_ENV === 'production',
    isDevelopment: process.env.NODE_ENV === 'development',
    isTest: process.env.NODE_ENV === 'test'
};

module.exports = environment;