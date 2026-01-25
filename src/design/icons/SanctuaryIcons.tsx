import React from 'react';
import {
    IconHome,
    IconUsers,
    IconRoute,
    IconNotebook,
    IconMoon,
} from '@tabler/icons-react';

type IconProps = {
    name: 'Sanctuary' | 'Village' | 'Journey' | 'Capture' | 'Oracle';
    isActive: boolean;
    className?: string;
};

export const SanctuaryIcon: React.FC<IconProps> = ({ name, isActive, className }) => {
    const color = isActive ? "var(--accent-regal)" : "var(--text-primary)";
    const strokeWidth = isActive ? 2.5 : 1.5;
    const size = 24;

    const iconProps = {
        color,
        stroke: strokeWidth,
        size,
        className,
    };

    const icons = {
        Sanctuary: <IconHome {...iconProps} />,
        Village: <IconUsers {...iconProps} />,
        Journey: <IconRoute {...iconProps} />,
        Capture: <IconNotebook {...iconProps} />,
        Oracle: <IconMoon {...iconProps} />,
    };

    return icons[name];
};

export default SanctuaryIcon;
