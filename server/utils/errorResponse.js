// utils/errorResponse.js

class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;

        // Capture stack trace (optional)
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = ErrorResponse;