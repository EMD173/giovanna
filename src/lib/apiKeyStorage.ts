/**
 * API Key Storage Utilities
 * 
 * Manages localStorage persistence for the Gemini API key.
 */

const API_KEY_STORAGE_KEY = 'giovanna_gemini_api_key';

export const getStoredApiKey = (): string | null => {
    // First check localStorage (user-provided key)
    const localKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (localKey) return localKey;

    // Fall back to environment variable
    return import.meta.env.VITE_GEMINI_API_KEY || null;
};

export const setStoredApiKey = (key: string): void => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearStoredApiKey = (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
};
