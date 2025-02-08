// validators.js - Utility functions for input validation

/**
 * Validates an email address format
 * @param {string} email - Email input
 * @returns {boolean} - True if valid, else false
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
};

/**
 * Validates a strong password
 * @param {string} password - Password input
 * @returns {boolean} - True if password is strong
 */
export const isValidPassword = (password) => {
    return password.length >= 8;
};

/**
 * Validates if a string is not empty
 * @param {string} value - Input value
 * @returns {boolean} - True if not empty
 */
export const isNotEmpty = (value) => {
    return value.trim().length > 0;
};