/**
 * THEME TOGGLE: Dark Mode Support
 * 
 * Provides sun/moon toggle for switching between light and dark themes.
 * Persists preference in localStorage and respects system preference.
 */

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function useTheme() {
    const [isDark, setIsDark] = useState<boolean>(() => {
        // Check localStorage first
        const stored = localStorage.getItem('giovanna_theme');
        if (stored) {
            return stored === 'dark';
        }
        // Fall back to system preference
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    });

    useEffect(() => {
        const root = document.documentElement;

        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('giovanna_theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('giovanna_theme', 'light');
        }
    }, [isDark]);

    // Listen for system preference changes
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e: MediaQueryListEvent) => {
            // Only auto-switch if user hasn't manually set preference
            if (!localStorage.getItem('giovanna_theme')) {
                setIsDark(e.matches);
            }
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, []);

    const toggleTheme = () => setIsDark((prev) => !prev);

    return { isDark, toggleTheme };
}

interface ThemeToggleProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export const ThemeToggle = ({ className = '', size = 'md' }: ThemeToggleProps) => {
    const { isDark, toggleTheme } = useTheme();

    const iconSize = {
        sm: 16,
        md: 20,
        lg: 24,
    }[size];

    const buttonSize = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12',
    }[size];

    return (
        <button
            onClick={toggleTheme}
            className={`${buttonSize} rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${className}`}
            style={{
                background: isDark
                    ? 'linear-gradient(135deg, #1A1A1A 0%, #2D2D2D 100%)'
                    : 'linear-gradient(135deg, #FAF7F5 0%, #F5F0EB 100%)',
                border: `1px solid ${isDark ? '#4B0082' : '#4B008220'}`,
            }}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {isDark ? (
                <Sun
                    size={iconSize}
                    className="text-[#D4AF37]"
                />
            ) : (
                <Moon
                    size={iconSize}
                    className="text-[#4B0082]"
                />
            )}
        </button>
    );
};

export default ThemeToggle;
