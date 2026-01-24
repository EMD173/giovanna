/**
 * PageTransition - Smooth animated transitions between views
 * 
 * Wraps page content with fade and slide animations
 * for a premium, polished feel.
 */

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageTransitionProps {
    children: ReactNode;
    className?: string;
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98,
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.98,
    },
};

const pageTransition = {
    type: 'spring' as const,
    stiffness: 260,
    damping: 25,
};

export const PageTransition = ({ children, className = '' }: PageTransitionProps) => {
    return (
        <motion.div
            initial="initial"
            animate="animate"
            exit="exit"
            variants={pageVariants}
            transition={pageTransition}
            className={className}
            style={{ width: '100%', height: '100%' }}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
