// src/hooks/useLocalStorage.js

import { useState, useEffect } from 'react';

/**
 * Custom hook to sync component state with localStorage.
 * * @param {string} key The key under which the data will be stored in localStorage.
 * @param {any} initialValue The initial value if nothing is found in localStorage.
 * @returns {[any, function]} The current state and a function to update it.
 */

export function useLocalStorage(key, initialValue) {
    // 1. Initialize State from LocalStorage or use initialValue
    const [value, setValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error, return initialValue (e.g., if local storage is disabled)
            console.error('Error reading localStorage key “' + key + '”:', error);
            return initialValue;
        }
    });

    // 2. useEffect to update localStorage whenever the state (value) changes
    useEffect(() => {
        try {
            // Save state to local storage
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('Error writing to localStorage key “' + key + '”:', error);
        }
    }, [key, value]); // Re-run effect only if key or value changes

    return [value, setValue];
}
