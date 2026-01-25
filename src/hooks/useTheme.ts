/**
 * Theme Hook: Dark Mode Support
 * 
 * Provides theme state management with localStorage persistence
 * and system preference detection.
 */

import { useState, useEffect } from 'react';

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
