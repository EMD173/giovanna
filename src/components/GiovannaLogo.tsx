/**
 * GIOVANNA LOGO: Custom G Logo Component
 * 
 * Replaces Sparkles icons with the branded Giovanna "G" logo.
 * Uses the purple/gold gradient G with puzzle pieces.
 */

interface GiovannaLogoProps {
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
    style?: React.CSSProperties;
}

const SIZES = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
    xxl: 'w-16 h-16',
};

export const GiovannaLogo = ({ className = '', size = 'md', style }: GiovannaLogoProps) => (
    <img
        src="/icons/g-logo.png"
        alt="Giovanna"
        className={`${SIZES[size as keyof typeof SIZES] || SIZES.md} ${className}`}
        style={style}
    />
);

export default GiovannaLogo;
