/**
 * FeedbackButton - Floating Feedback Component
 * 
 * A floating button that allows users to send quick feedback
 * directly to Firebase. Appears in the corner of every screen.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Check } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../core/firebase/config';
import { useAuthStore } from '../core/stores/useAuthStore';

export const FeedbackButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
    const { user } = useAuthStore();

    const handleSubmit = async () => {
        if (!feedback.trim()) return;

        setStatus('sending');

        try {
            await addDoc(collection(db, 'feedback'), {
                message: feedback,
                userId: user?.uid || 'anonymous',
                userEmail: user?.email || null,
                timestamp: serverTimestamp(),
                page: window.location.pathname,
                userAgent: navigator.userAgent,
            });

            setStatus('sent');
            setFeedback('');

            // Close after showing success
            setTimeout(() => {
                setIsOpen(false);
                setStatus('idle');
            }, 2000);
        } catch (error) {
            console.error('Failed to send feedback:', error);
            setStatus('idle');
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                    position: 'fixed',
                    bottom: '100px',
                    right: '20px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8B5CF6, #6D28D9)',
                    border: 'none',
                    boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 999,
                }}
            >
                <MessageCircle size={22} color="white" />
            </motion.button>

            {/* Feedback Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            inset: 0,
                            background: 'rgba(0, 0, 0, 0.5)',
                            backdropFilter: 'blur(4px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            zIndex: 1001,
                        }}
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                                background: 'white',
                                borderRadius: '20px',
                                padding: '24px',
                                width: '100%',
                                maxWidth: '400px',
                                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                            }}
                        >
                            {/* Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ margin: 0, color: '#1F2937', fontSize: '1.2rem' }}>
                                    Share Your Thoughts
                                </h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    style={{
                                        background: '#F3F4F6',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                    }}
                                >
                                    <X size={18} color="#6B7280" />
                                </button>
                            </div>

                            {status === 'sent' ? (
                                <div style={{ textAlign: 'center', padding: '20px' }}>
                                    <div
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            background: 'linear-gradient(135deg, #10B981, #059669)',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            margin: '0 auto 16px',
                                        }}
                                    >
                                        <Check size={32} color="white" />
                                    </div>
                                    <p style={{ color: '#1F2937', fontWeight: 600 }}>Thank you!</p>
                                    <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>Your feedback helps us improve.</p>
                                </div>
                            ) : (
                                <>
                                    <textarea
                                        value={feedback}
                                        onChange={(e) => setFeedback(e.target.value)}
                                        placeholder="What's on your mind? Tell us what you love, what's confusing, or what you wish we had..."
                                        style={{
                                            width: '100%',
                                            minHeight: '120px',
                                            padding: '12px',
                                            border: '2px solid #E5E7EB',
                                            borderRadius: '12px',
                                            fontSize: '1rem',
                                            resize: 'vertical',
                                            fontFamily: 'inherit',
                                        }}
                                        disabled={status === 'sending'}
                                    />

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!feedback.trim() || status === 'sending'}
                                        style={{
                                            marginTop: '16px',
                                            width: '100%',
                                            padding: '14px',
                                            background: feedback.trim()
                                                ? 'linear-gradient(135deg, #8B5CF6, #6D28D9)'
                                                : '#E5E7EB',
                                            color: feedback.trim() ? 'white' : '#9CA3AF',
                                            border: 'none',
                                            borderRadius: '12px',
                                            fontWeight: 600,
                                            fontSize: '1rem',
                                            cursor: feedback.trim() ? 'pointer' : 'not-allowed',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '8px',
                                        }}
                                    >
                                        {status === 'sending' ? (
                                            'Sending...'
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                Send Feedback
                                            </>
                                        )}
                                    </button>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default FeedbackButton;
