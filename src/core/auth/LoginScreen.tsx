/**
 * Giovanna Login Screen
 * Premium glassmorphic login with Google, Email Magic Link, and Guest options
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { Sparkles, UserCircle, Mail, ArrowLeft, Check, Loader2 } from 'lucide-react';
import { sendSignInLinkToEmail, isSignInWithEmailLink, signInWithEmailLink } from 'firebase/auth';
import { auth } from '../firebase/config';

export function LoginScreen() {
    const { signInWithGoogle, signInAsGuest, loading } = useAuthStore();
    const [signingIn, setSigningIn] = useState(false);
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [email, setEmail] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [emailError, setEmailError] = useState('');

    // Handle magic link callback
    useEffect(() => {
        if (isSignInWithEmailLink(auth, window.location.href)) {
            let emailForSignIn = window.localStorage.getItem('emailForSignIn');
            if (!emailForSignIn) {
                emailForSignIn = window.prompt('Please provide your email for confirmation');
            }
            if (emailForSignIn) {
                signInWithEmailLink(auth, emailForSignIn, window.location.href)
                    .then(() => {
                        window.localStorage.removeItem('emailForSignIn');
                        // Clean up URL
                        window.history.replaceState({}, document.title, window.location.pathname);
                    })
                    .catch((error) => {
                        console.error('Email link sign-in failed:', error);
                    });
            }
        }
    }, []);

    const handleGoogleSignIn = async () => {
        setSigningIn(true);
        try {
            await signInWithGoogle();
        } catch (error) {
            console.error(error);
        } finally {
            setSigningIn(false);
        }
    };

    const handleGuestSignIn = async () => {
        setSigningIn(true);
        try {
            await signInAsGuest();
        } catch (error) {
            console.error(error);
        } finally {
            setSigningIn(false);
        }
    };

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');

        if (!email || !email.includes('@')) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setSigningIn(true);
        try {
            const actionCodeSettings = {
                url: window.location.origin,
                handleCodeInApp: true,
            };

            await sendSignInLinkToEmail(auth, email, actionCodeSettings);
            window.localStorage.setItem('emailForSignIn', email);
            setEmailSent(true);
        } catch (error) {
            console.error('Failed to send magic link:', error);
            setEmailError('Failed to send sign-in link. Please try again.');
        } finally {
            setSigningIn(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--glass-base)' }}>
                <div className="animate-pulse text-center">
                    <Sparkles className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--accent-regal)' }} />
                    <p style={{ color: 'var(--text-primary)' }}>Loading...</p>
                </div>
            </div>
        );
    }

    // Email sent confirmation
    if (emailSent) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center p-6"
                style={{ backgroundColor: 'var(--glass-base)' }}
            >
                <div className="glass-panel w-full max-w-sm p-8 text-center">
                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Check Your Email
                    </h2>
                    <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                        We sent a sign-in link to <strong>{email}</strong>
                    </p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        Click the link in your email to enter the Sanctuary
                    </p>
                    <button
                        onClick={() => { setEmailSent(false); setShowEmailForm(false); setEmail(''); }}
                        className="mt-6 text-sm font-medium"
                        style={{ color: 'var(--accent-regal)' }}
                    >
                        Use a different method
                    </button>
                </div>
            </div>
        );
    }

    // Email form view
    if (showEmailForm) {
        return (
            <div
                className="min-h-screen flex flex-col items-center justify-center p-6"
                style={{ backgroundColor: 'var(--glass-base)' }}
            >
                <div className="glass-panel w-full max-w-sm p-8">
                    <button
                        onClick={() => setShowEmailForm(false)}
                        className="flex items-center gap-2 text-sm mb-6"
                        style={{ color: 'var(--text-secondary)' }}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>

                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                        Sign in with Email
                    </h2>
                    <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                        We'll send you a magic link to sign in — no password needed.
                    </p>

                    <form onSubmit={handleEmailSignIn} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full px-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2"
                                style={{
                                    backgroundColor: 'var(--glass-base)',
                                    borderColor: emailError ? '#ef4444' : 'var(--glass-border)',
                                    color: 'var(--text-primary)',
                                }}
                                aria-describedby={emailError ? 'email-error' : undefined}
                                aria-invalid={!!emailError}
                            />
                            {emailError && (
                                <p id="email-error" className="text-sm text-red-500 mt-1">{emailError}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={signingIn}
                            className="w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                            style={{
                                backgroundColor: 'var(--accent-regal)',
                                color: 'white',
                            }}
                        >
                            {signingIn ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Mail className="w-5 h-5" />
                                    Send Magic Link
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center p-6"
            style={{ backgroundColor: 'var(--glass-base)' }}
        >
            {/* Logo / Brand - Sanctuary Threshold */}
            <div className="text-center mb-12 animate-fade-in">
                <Sparkles className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--accent-regal)' }} />
                <h1
                    className="text-4xl font-bold mb-2"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    Giovanna
                </h1>
                <h2
                    className="text-lg tracking-widest uppercase opacity-70"
                    style={{ fontFamily: 'var(--font-body)', color: 'var(--accent-regal)' }}
                >
                    Sanctuary Awaits
                </h2>
                <p className="mt-2 text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--text-secondary)' }}>
                    Enter your family's homeplace
                </p>
            </div>

            {/* Login Card */}
            <div
                className="glass-panel w-full max-w-sm p-8 space-y-4"
                style={{ animation: 'fade-in 0.4s ease-out' }}
            >
                {/* Google Sign In */}
                <button
                    onClick={handleGoogleSignIn}
                    disabled={signingIn}
                    className="w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                    style={{
                        backgroundColor: 'var(--accent-regal)',
                        color: 'white',
                        fontFamily: 'var(--font-body)'
                    }}
                    aria-label="Continue with Google"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                    </svg>
                    {signingIn ? 'Signing in...' : 'Continue with Google'}
                </button>

                {/* Email Magic Link */}
                <button
                    onClick={() => setShowEmailForm(true)}
                    disabled={signingIn}
                    className="w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                    style={{
                        backgroundColor: 'transparent',
                        border: '2px solid var(--accent-regal)',
                        color: 'var(--accent-regal)',
                        fontFamily: 'var(--font-body)'
                    }}
                    aria-label="Continue with Email"
                >
                    <Mail className="w-5 h-5" />
                    Continue with Email
                </button>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--glass-border)' }} aria-hidden="true" />
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>or</span>
                    <div className="flex-1 h-px" style={{ backgroundColor: 'var(--glass-border)' }} aria-hidden="true" />
                </div>

                {/* Guest Sign In */}
                <button
                    onClick={handleGuestSignIn}
                    disabled={signingIn}
                    className="w-full py-4 px-6 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                    style={{
                        backgroundColor: 'transparent',
                        border: '2px solid var(--glass-border)',
                        color: 'var(--text-primary)',
                        fontFamily: 'var(--font-body)'
                    }}
                    aria-label="Continue as Guest"
                >
                    <UserCircle className="w-5 h-5" />
                    Continue as Guest
                </button>
            </div>

            {/* Footer */}
            <p className="mt-8 text-sm text-center" style={{ color: 'var(--text-secondary)' }}>
                Guest accounts are stored locally on this device
            </p>
        </div>
    );
}

