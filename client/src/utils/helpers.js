// helpers.js - General utility functions

/**
 * Formats a date to "DD-MM-YYYY" format
 * @param {string | Date} date - Date input
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`;
};

/**
 * Capitalizes the first letter of a string
 * @param {string} str - Input string
 * @returns {string} - Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Saves data to localStorage
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 */
export const saveToLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

/**
 * Retrieves data from localStorage
 * @param {string} key - Storage key
 * @returns {any | null} - Stored data or null if not found
 */
export const getFromLocalStorage = (key) => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
};