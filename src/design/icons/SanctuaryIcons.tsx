import React from 'react';

type IconProps = {
    name: 'Sanctuary' | 'Village' | 'Journey' | 'Capture' | 'Oracle';
    isActive: boolean;
    className?: string;
};

export const SanctuaryIcon: React.FC<IconProps> = ({ name, isActive, className }) => {
    const strokeColor = isActive ? "var(--accent-regal)" : "var(--text-primary)";
    const strokeWidth = isActive ? 2.5 : 1.5;

    // Soft, organic curves for the "Homeplace" feel
    const icons = {
        Sanctuary: (
            <path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z" /> // Soft House
        ),
        Village: (
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2 M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M23 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75" /> // Interlocking People
        ),
        Journey: (
            <circle cx="12" cy="12" r="10" /> // Compass/Star base
        ),
        Capture: (
            <path d="M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /> // Quill/Pen
        ),
        Oracle: (
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" /> // Chat Bubble
        )
    };

    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {icons[name]}
        </svg>
    );
};

export default SanctuaryIcon;
