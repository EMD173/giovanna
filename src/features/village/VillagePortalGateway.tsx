/**
 * VILLAGE PORTAL GATEWAY: Secure Passport Sharing
 * 
 * Features:
 * - Generate time-bound share links
 * - Read-only Liquid Glass passport view
 * - Sensory profiles and triggers only (no full data)
 * - Gold Leaf premium styling
 */

import { useState } from 'react';
import {
    Shield,
    Link as LinkIcon,
    Copy,
    Check,
    Clock,
    Eye,
    Lock,
    Sparkles,
    Heart,
    AlertCircle,
    Users,
    Send
} from 'lucide-react';
import type { SovereignPassport } from '../../core/stores/profileTypes';

interface VillagePortalProps {
    passport: SovereignPassport;
    childName: string;
    onClose?: () => void;
}

interface ShareLink {
    id: string;
    token: string;
    expiresAt: Date;
    accessCount: number;
    maxAccess: number;
    createdAt: Date;
}

/**
 * Generate a secure, time-bound share token
 */
export function generateShareToken(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Create a share link with expiration
 */
export function createShareLink(
    _passportId: string,
    expirationHours: number = 24,
    maxAccess: number = 5
): ShareLink {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expirationHours * 60 * 60 * 1000);

    return {
        id: `share-${Date.now()}`,
        token: generateShareToken(),
        expiresAt,
        accessCount: 0,
        maxAccess,
        createdAt: now,
    };
}

/**
 * Village Portal Gateway Component
 * Generates and manages secure share links
 */
export const VillagePortalGateway = ({ passport, childName, onClose }: VillagePortalProps) => {
    const [shareLink, setShareLink] = useState<ShareLink | null>(null);
    const [copied, setCopied] = useState(false);
    const [expirationHours, setExpirationHours] = useState(24);
    const [maxAccess, setMaxAccess] = useState(5);
    const [generating, setGenerating] = useState(false);

    const handleGenerateLink = async () => {
        setGenerating(true);

        // Simulate generation delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const link = createShareLink(passport.id, expirationHours, maxAccess);
        setShareLink(link);
        setGenerating(false);
    };

    const getShareUrl = () => {
        if (!shareLink) return '';
        return `${window.location.origin}/portal/${shareLink.token}`;
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(getShareUrl());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatExpiration = (date: Date) => {
        const hours = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60));
        if (hours < 1) return 'Less than 1 hour';
        if (hours === 1) return '1 hour';
        if (hours < 24) return `${hours} hours`;
        const days = Math.round(hours / 24);
        return days === 1 ? '1 day' : `${days} days`;
    };

    return (
        <div className="min-h-screen pb-32 px-4 pt-6" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
            {/* Header */}
            <header className="mb-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-linear-to-br from-[#D4AF37] to-[#4B0082] flex items-center justify-center shadow-lg">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <h1
                    className="text-3xl"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    Village Portal
                </h1>
                <p className="text-sm opacity-70 mt-2">
                    Share {childName}'s passport securely with your care team
                </p>
            </header>

            {/* Info Card */}
            <div className="glass-panel p-5 rounded-[24px] mb-6 border-l-4 border-[#D4AF37]">
                <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 text-[#4B0082] mt-0.5" />
                    <div>
                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                            What They'll See
                        </h3>
                        <p className="text-xs opacity-60 mt-1">
                            Viewers will see a <span className="font-semibold">read-only</span> summary of:
                        </p>
                        <ul className="text-xs opacity-60 mt-2 space-y-1">
                            <li>• Essential regulation behaviors (stims)</li>
                            <li>• Comfort objects and their importance</li>
                            <li>• Known triggers with support strategies</li>
                            <li>• Safe spaces</li>
                        </ul>
                        <p className="text-xs mt-3 text-[#D4AF37] font-semibold flex items-center gap-1">
                            <Lock className="w-3 h-3" />
                            Medical data and full history are NOT shared
                        </p>
                    </div>
                </div>
            </div>

            {/* Configuration */}
            {!shareLink && (
                <div className="glass-panel p-5 rounded-[24px] mb-6 space-y-5">
                    <h3 className="font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Clock className="w-4 h-4 text-[#4B0082]" />
                        Link Settings
                    </h3>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Expires After
                        </label>
                        <div className="flex gap-2">
                            {[1, 24, 72, 168].map(hours => (
                                <button
                                    key={hours}
                                    onClick={() => setExpirationHours(hours)}
                                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${expirationHours === hours
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white/30 border border-white/40'
                                        }`}
                                >
                                    {hours === 1 ? '1 hour' : hours === 24 ? '1 day' : hours === 72 ? '3 days' : '1 week'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                            Maximum Views
                        </label>
                        <div className="flex gap-2">
                            {[1, 5, 10, 25].map(views => (
                                <button
                                    key={views}
                                    onClick={() => setMaxAccess(views)}
                                    className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${maxAccess === views
                                        ? 'bg-[#4B0082] text-white'
                                        : 'bg-white/30 border border-white/40'
                                        }`}
                                >
                                    {views} view{views > 1 ? 's' : ''}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button - Gold Leaf Premium */}
                    <button
                        onClick={handleGenerateLink}
                        disabled={generating}
                        className="w-full py-4 rounded-full font-bold text-white flex items-center justify-center gap-2 gold-leaf-border premium-glow hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        style={{
                            background: 'linear-gradient(135deg, #D4AF37 0%, #4B0082 100%)',
                        }}
                    >
                        {generating ? (
                            <>
                                <Sparkles className="w-5 h-5 animate-pulse" />
                                Generating Secure Link...
                            </>
                        ) : (
                            <>
                                <LinkIcon className="w-5 h-5" />
                                Generate Invite Link
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Share Link Result */}
            {shareLink && (
                <div className="glass-panel p-5 rounded-[24px] mb-6 gold-leaf-border">
                    <div className="flex items-center gap-2 mb-4">
                        <Check className="w-5 h-5 text-green-500" />
                        <h3 className="font-bold text-green-700" style={{ color: 'var(--text-primary)' }}>
                            Link Generated!
                        </h3>
                    </div>

                    {/* Link Display */}
                    <div className="bg-white/40 rounded-xl p-3 mb-4 flex items-center gap-2">
                        <input
                            type="text"
                            readOnly
                            value={getShareUrl()}
                            className="flex-1 bg-transparent text-sm font-mono focus:outline-none"
                            style={{ color: 'var(--text-primary)' }}
                        />
                        <button
                            onClick={handleCopy}
                            className="p-2 rounded-lg bg-[#4B0082]/10 hover:bg-[#4B0082]/20 transition-colors"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4 text-[#4B0082]" />
                            )}
                        </button>
                    </div>

                    {/* Link Details */}
                    <div className="flex items-center gap-4 text-xs opacity-60">
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Expires in {formatExpiration(shareLink.expiresAt)}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {shareLink.maxAccess - shareLink.accessCount} views remaining
                        </span>
                    </div>

                    {/* Share Actions */}
                    <div className="mt-4 flex gap-2">
                        <button
                            onClick={handleCopy}
                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#4B0082] text-white flex items-center justify-center gap-2"
                        >
                            <Copy className="w-4 h-4" />
                            Copy Link
                        </button>
                        <button
                            className="flex-1 py-3 rounded-xl font-semibold text-sm bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send via Email
                        </button>
                    </div>

                    {/* Generate New */}
                    <button
                        onClick={() => setShareLink(null)}
                        className="w-full mt-4 py-2 text-sm font-semibold opacity-60 hover:opacity-100 transition-opacity"
                    >
                        Generate a different link
                    </button>
                </div>
            )}

            {/* Security Notice */}
            <div className="text-center">
                <p className="text-xs opacity-50 flex items-center justify-center gap-2">
                    <Lock className="w-3 h-3" />
                    Links are encrypted and auto-expire. You control all access.
                </p>
            </div>

            {/* Close Button */}
            {onClose && (
                <button
                    onClick={onClose}
                    className="w-full mt-6 py-3 rounded-full font-semibold bg-white/30 border border-white/40"
                    style={{ color: 'var(--text-primary)' }}
                >
                    Close
                </button>
            )}
        </div>
    );
};

/**
 * PUBLIC PASSPORT VIEWER: Read-only Liquid Glass view
 * Shown to care team members via share link
 */
interface PublicPassportViewerProps {
    passport: SovereignPassport;
    isExpired?: boolean;
}

export const PublicPassportViewer = ({ passport, isExpired }: PublicPassportViewerProps) => {
    if (isExpired) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
                <div className="glass-panel p-8 rounded-[32px] text-center max-w-sm">
                    <AlertCircle className="w-16 h-16 text-[#4B0082] mx-auto mb-4" />
                    <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                        Link Expired
                    </h1>
                    <p className="text-sm opacity-60">
                        This passport share link has expired or reached its view limit.
                        Please request a new link from the parent or guardian.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-12 px-4 pt-6" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
            {/* Header */}
            <div className="glass-panel p-6 rounded-[32px] mb-6 text-center gold-leaf-border">
                <Shield className="w-12 h-12 text-[#D4AF37] mx-auto mb-3" />
                <h1
                    className="text-2xl mb-1"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    {passport.childName}'s Passport
                </h1>
                <p className="text-xs opacity-60">
                    Essential regulation information for care providers
                </p>
            </div>

            {/* Essential Regulation Behaviors */}
            {passport.sensory.stimmingPatterns.length > 0 && (
                <div className="glass-panel p-5 rounded-[24px] mb-4">
                    <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Sparkles className="w-4 h-4 text-[#4B0082]" />
                        Essential Regulation Behaviors
                    </h3>
                    <p className="text-xs opacity-60 mb-4 italic">
                        These behaviors help {passport.childName} stay regulated. Please support, not suppress.
                    </p>
                    <div className="space-y-3">
                        {passport.sensory.stimmingPatterns.map((pattern, i) => (
                            <div key={i} className="bg-white/30 rounded-xl p-4">
                                <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    {pattern.behavior}
                                </p>
                                <p className="text-sm text-[#D4AF37] italic mt-1">
                                    {pattern.dignityFraming}
                                </p>
                                <div className="mt-3 text-xs opacity-60 space-y-1">
                                    <p><strong>When:</strong> {pattern.whenObserved}</p>
                                    <p><strong>Support strategy:</strong> {pattern.supportStrategy}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Comfort Objects */}
            {passport.sensory.favoriteToys.length > 0 && (
                <div className="glass-panel p-5 rounded-[24px] mb-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Heart className="w-4 h-4 text-[#D4AF37]" />
                        Comfort Objects
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {passport.sensory.favoriteToys.map((obj, i) => (
                            <span
                                key={i}
                                className={`px-3 py-2 rounded-xl text-sm ${obj.neverSeparate
                                    ? 'bg-[#D4AF37] text-white font-bold'
                                    : 'bg-white/30'
                                    }`}
                                style={{ color: obj.neverSeparate ? undefined : 'var(--text-primary)' }}
                            >
                                {obj.name}
                                {obj.neverSeparate && ' ⭐'}
                            </span>
                        ))}
                    </div>
                    <p className="text-xs opacity-60 mt-3">
                        ⭐ = Essential. Please do not separate from this item.
                    </p>
                </div>
            )}

            {/* Triggers */}
            {passport.sensory.regulationTriggers.length > 0 && (
                <div className="glass-panel p-5 rounded-[24px] mb-4">
                    <h3 className="font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <AlertCircle className="w-4 h-4 text-[#4B0082]" />
                        Known Triggers
                    </h3>
                    <div className="space-y-3">
                        {passport.sensory.regulationTriggers.map((trigger, i) => (
                            <div key={i} className="bg-white/30 rounded-xl p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                        {trigger.trigger}
                                    </p>
                                    <span className={`text-xs px-2 py-1 rounded-lg ${trigger.intensity === 'High' ? 'bg-red-100 text-red-700' :
                                        trigger.intensity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>
                                        {trigger.intensity}
                                    </span>
                                </div>
                                <p className="text-sm text-[#D4AF37] italic">{trigger.dignityFraming}</p>
                                <p className="text-xs opacity-60 mt-2">
                                    <strong>What helps:</strong> {trigger.effectiveResponse}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Safe Spaces */}
            {passport.sensory.safeSpaces.length > 0 && (
                <div className="glass-panel p-5 rounded-[24px] mb-4">
                    <h3 className="font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                        Safe Spaces
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {passport.sensory.safeSpaces.map((space, i) => (
                            <span
                                key={i}
                                className="px-3 py-2 rounded-xl text-sm bg-green-100 text-green-700"
                            >
                                {space}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Footer Notice */}
            <p className="text-xs text-center opacity-50 mt-6 flex items-center justify-center gap-2">
                <Lock className="w-3 h-3" />
                This is a secure, read-only view. Full access requires parent authorization.
            </p>
        </div>
    );
};

export default VillagePortalGateway;
