// tokens.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const environment = require('../config/environment');

class TokenService {
    generateJWT(userId, role) {
        return jwt.sign({ id: userId, role },
            environment.jwt.secret, { expiresIn: environment.jwt.expiresIn }
        );
    }

    verifyJWT(token) {
        try {
            return jwt.verify(token, environment.jwt.secret);
        } catch (error) {
            throw new Error('Invalid or expired token');
        }
    }

    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }

    generatePasswordResetToken() {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        return {
            resetToken,
            hashedToken,
            expiresIn: Date.now() + 30 * 60 * 1000 // 30 minutes
        };
    }

    generateAPIKey(userId, scope) {
        const apiKey = crypto.randomBytes(32).toString('base64');
        const hashedKey = crypto
            .createHash('sha256')
            .update(apiKey)
            .digest('hex');

        return {
            apiKey,
            hashedKey,
            scope,
            userId
        };
    }

    hashPassword(password) {
        return crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');
    }

    comparePasswords(inputPassword, hashedPassword) {
        const hashedInput = this.hashPassword(inputPassword);
        return hashedInput === hashedPassword;
    }

    parseAuthHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new Error('Invalid authorization header');
        }
        return authHeader.split(' ')[1];
    }

    generateSessionToken(userId, deviceInfo) {
        const sessionId = crypto.randomBytes(16).toString('hex');
        return {
            sessionId,
            token: this.generateJWT(userId, 'session'),
            deviceInfo,
            createdAt: new Date()
        };
    }
}

module.exports = new TokenService();