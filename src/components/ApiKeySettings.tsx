/**
 * API KEY SETTINGS: User-configurable Gemini API Key
 * 
 * Allows users to enter their own Google Gemini API key
 * Stored in localStorage for persistence
 */

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';

const API_KEY_STORAGE_KEY = 'giovanna_gemini_api_key';

export const getStoredApiKey = (): string | null => {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
};

export const setStoredApiKey = (key: string): void => {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
};

export const clearStoredApiKey = (): void => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
};

interface ApiKeySettingsProps {
    onKeySet?: (hasKey: boolean) => void;
    compact?: boolean;
}

export const ApiKeySettings = ({ onKeySet, compact = false }: ApiKeySettingsProps) => {
    const [apiKey, setApiKey] = useState('');
    const [showKey, setShowKey] = useState(false);
    const [hasStoredKey, setHasStoredKey] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const stored = getStoredApiKey();
        if (stored) {
            setApiKey(stored);
            setHasStoredKey(true);
        }
    }, []);

    const handleSave = () => {
        if (!apiKey.trim()) return;

        setIsSaving(true);

        // Simulate validation delay
        setTimeout(() => {
            setStoredApiKey(apiKey.trim());
            setHasStoredKey(true);
            setSaveStatus('success');
            onKeySet?.(true);
            setIsSaving(false);

            // Reset status after 3s
            setTimeout(() => setSaveStatus('idle'), 3000);
        }, 500);
    };

    const handleClear = () => {
        clearStoredApiKey();
        setApiKey('');
        setHasStoredKey(false);
        onKeySet?.(false);
    };

    const maskedKey = apiKey ? `${apiKey.slice(0, 8)}${'•'.repeat(20)}${apiKey.slice(-4)}` : '';

    if (compact && hasStoredKey) {
        return (
            <div className="flex items-center gap-2 text-xs">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="opacity-60">API Key configured</span>
                <button
                    onClick={handleClear}
                    className="text-red-500 hover:underline"
                >
                    Clear
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel rounded-[20px] p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#4B0082]/10">
                    <Key className="w-5 h-5 text-[#4B0082]" />
                </div>
                <div>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                        Google Gemini API Key
                    </h3>
                    <p className="text-xs opacity-60">
                        Required for AI-powered Oracle responses
                    </p>
                </div>
            </div>

            {/* Get API Key Link */}
            <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-[#4B0082] hover:underline"
            >
                <ExternalLink className="w-3 h-3" />
                Get your free API key from Google AI Studio
            </a>

            {/* Key Input */}
            <div className="relative">
                <input
                    type={showKey ? 'text' : 'password'}
                    value={showKey ? apiKey : (hasStoredKey ? maskedKey : apiKey)}
                    onChange={(e) => {
                        setApiKey(e.target.value);
                        setSaveStatus('idle');
                    }}
                    placeholder="Paste your Gemini API key here..."
                    className="w-full px-4 py-3 pr-12 rounded-xl bg-white/50 border border-white/60 focus:border-[#4B0082]/50 focus:outline-none text-sm"
                    style={{ color: 'var(--text-primary)' }}
                />
                <button
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 opacity-50 hover:opacity-100"
                >
                    {showKey ? (
                        <EyeOff className="w-4 h-4" />
                    ) : (
                        <Eye className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Save/Status Row */}
            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    disabled={!apiKey.trim() || isSaving}
                    className="flex-1 py-2.5 rounded-xl bg-[#4B0082] text-white font-semibold text-sm disabled:opacity-50 transition-all hover:opacity-90"
                >
                    {isSaving ? 'Saving...' : 'Save API Key'}
                </button>

                {hasStoredKey && (
                    <button
                        onClick={handleClear}
                        className="px-4 py-2.5 rounded-xl bg-red-100 text-red-600 font-semibold text-sm hover:bg-red-200 transition-colors"
                    >
                        Clear
                    </button>
                )}
            </div>

            {/* Status Messages */}
            {saveStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-xs">
                    <CheckCircle className="w-4 h-4" />
                    API key saved successfully! The Oracle is now powered.
                </div>
            )}

            {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-xs">
                    <AlertCircle className="w-4 h-4" />
                    Invalid API key. Please check and try again.
                </div>
            )}

            {/* Security Note */}
            <p className="text-[10px] opacity-40 leading-relaxed">
                Your API key is stored locally on your device and never sent to our servers.
                All AI requests go directly from your browser to Google's API.
            </p>
        </div>
    );
};

export default ApiKeySettings;
