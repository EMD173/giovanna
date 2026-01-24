/**
 * LOADING SKELETON: Global Loading States
 * 
 * Full-screen and inline loading states with Liquid Glass shimmer.
 * Used during Firebase auth check and route transitions.
 */

import { Loader2 } from 'lucide-react';

interface LoadingSkeletonProps {
    /** Full screen loading overlay */
    fullScreen?: boolean;
    /** Loading message to display */
    message?: string;
    /** Show the Giovanna wordmark */
    showBrand?: boolean;
}

export const LoadingSkeleton = ({
    fullScreen = false,
    message = 'Loading...',
    showBrand = true,
}: LoadingSkeletonProps) => {
    if (fullScreen) {
        return (
            <div
                className="fixed inset-0 flex flex-col items-center justify-center z-50"
                style={{
                    background: 'linear-gradient(135deg, #FAF7F5 0%, #F5F0EB 100%)',
                }}
                role="status"
                aria-label={message}
            >
                {/* Brand */}
                {showBrand && (
                    <h1
                        className="text-4xl mb-6 opacity-80 animate-pulse"
                        style={{ fontFamily: 'var(--font-display)', color: '#4B0082' }}
                    >
                        Giovanna
                    </h1>
                )}

                {/* Spinner */}
                <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-[#4B0082]/10 animate-ping absolute inset-0" />
                    <Loader2 className="w-16 h-16 text-[#4B0082] animate-spin relative" />
                </div>

                {/* Message */}
                <p className="text-sm opacity-60 mt-6">{message}</p>
            </div>
        );
    }

    // Inline skeleton
    return (
        <div
            className="flex items-center justify-center p-8"
            role="status"
            aria-label={message}
        >
            <Loader2 className="w-8 h-8 text-[#4B0082] animate-spin" />
            <span className="ml-3 text-sm opacity-60">{message}</span>
        </div>
    );
};

/**
 * Card Skeleton: Shimmer placeholder for content cards
 */
export const CardSkeleton = () => (
    <div className="glass-panel p-5 rounded-[24px] animate-pulse">
        <div className="h-4 bg-[#4B0082]/10 rounded w-3/4 mb-4" />
        <div className="h-3 bg-[#4B0082]/5 rounded w-full mb-2" />
        <div className="h-3 bg-[#4B0082]/5 rounded w-5/6 mb-2" />
        <div className="h-3 bg-[#4B0082]/5 rounded w-4/6" />
    </div>
);

/**
 * List Skeleton: Multiple shimmer placeholders
 */
export const ListSkeleton = ({ count = 3 }: { count?: number }) => (
    <div className="space-y-4">
        {Array.from({ length: count }).map((_, i) => (
            <CardSkeleton key={i} />
        ))}
    </div>
);

export default LoadingSkeleton;
