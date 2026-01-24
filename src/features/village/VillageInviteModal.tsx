/**
 * Village Invite Modal
 * 
 * Allows caregivers to invite team members to their village:
 * - Generate shareable invite links
 * - Send invites via email (uses native share)
 * - Assign roles (Teacher, Therapist, Family, etc.)
 */

import { useState } from 'react';
import {
    X,
    Copy,
    Share2,
    Mail,
    Check,
    UserPlus,
    GraduationCap,
    Heart,
    Stethoscope,
    Users,
    Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../core/stores/useAuthStore';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../core/firebase/config';
import { trackEvent } from '../../lib/analytics';

interface VillageInviteModalProps {
    isOpen: boolean;
    onClose: () => void;
    childName: string;
}

type VillageRole = 'Teacher' | 'Therapist' | 'Family' | 'Caregiver' | 'Other';

interface InviteData {
    id: string;
    createdBy: string;
    childName: string;
    role: VillageRole;
    inviteCode: string;
    email?: string;
    status: 'pending' | 'accepted' | 'expired';
    createdAt: Date;
    expiresAt: Date;
}

const ROLE_CONFIG: { role: VillageRole; icon: typeof GraduationCap; color: string; label: string }[] = [
    { role: 'Teacher', icon: GraduationCap, color: '#22c55e', label: 'Teacher / School' },
    { role: 'Therapist', icon: Stethoscope, color: '#4B0082', label: 'Therapist' },
    { role: 'Family', icon: Heart, color: '#ef4444', label: 'Family Member' },
    { role: 'Caregiver', icon: Users, color: '#D4AF37', label: 'Caregiver / Nanny' },
];

export const VillageInviteModal = ({ isOpen, onClose, childName }: VillageInviteModalProps) => {
    const { user } = useAuthStore();
    const [selectedRole, setSelectedRole] = useState<VillageRole | null>(null);
    const [email, setEmail] = useState('');
    const [inviteLink, setInviteLink] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState<'role' | 'details' | 'success'>('role');

    const generateInviteCode = () => {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    const createInvite = async () => {
        if (!user || !selectedRole) return;

        setLoading(true);
        try {
            const inviteCode = generateInviteCode();
            const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

            const inviteData: Omit<InviteData, 'id'> = {
                createdBy: user.uid,
                childName,
                role: selectedRole,
                inviteCode,
                email: email || undefined,
                status: 'pending',
                createdAt: new Date(),
                expiresAt,
            };

            const docRef = await addDoc(collection(db, 'villageInvites'), {
                ...inviteData,
                createdAt: Timestamp.fromDate(inviteData.createdAt),
                expiresAt: Timestamp.fromDate(inviteData.expiresAt),
            });

            // Generate invite link
            const baseUrl = window.location.origin;
            const link = `${baseUrl}?invite=${inviteCode}`;
            setInviteLink(link);
            setStep('success');

            trackEvent('village_invite_created', {
                role: selectedRole,
                hasEmail: !!email,
                inviteId: docRef.id,
            });
        } catch (error) {
            console.error('Failed to create invite:', error);
            alert('Failed to create invite. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const copyLink = async () => {
        if (!inviteLink) return;
        try {
            await navigator.clipboard.writeText(inviteLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            trackEvent('village_invite_link_copied');
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    const shareInvite = async () => {
        if (!inviteLink || !selectedRole) return;

        const shareData = {
            title: `Join ${childName}'s Care Village`,
            text: `You're invited to join ${childName}'s care team as a ${selectedRole}. Click the link to join and help coordinate care.`,
            url: inviteLink,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                trackEvent('village_invite_shared');
            } catch (error) {
                // User cancelled or share failed
                console.log('Share cancelled');
            }
        } else {
            copyLink();
        }
    };

    const sendEmail = () => {
        if (!inviteLink || !email || !selectedRole) return;

        const subject = encodeURIComponent(`Join ${childName}'s Care Village`);
        const body = encodeURIComponent(
            `Hi,\n\nYou're invited to join ${childName}'s care team as a ${selectedRole}.\n\nClick the link below to join and help coordinate care:\n${inviteLink}\n\nThis link expires in 7 days.\n\nThank you for being part of the village!`
        );

        window.open(`mailto:${email}?subject=${subject}&body=${body}`);
        trackEvent('village_invite_email_sent');
    };

    const resetAndClose = () => {
        setStep('role');
        setSelectedRole(null);
        setEmail('');
        setInviteLink(null);
        setCopied(false);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40"
                    onClick={resetAndClose}
                >
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="w-full max-w-lg bg-white rounded-t-[32px] p-6 pb-10 max-h-[85vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-[#4B0082]/10">
                                    <UserPlus className="w-6 h-6 text-[#4B0082]" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-[#1A1A1A]">
                                        Invite to Village
                                    </h2>
                                    <p className="text-sm opacity-60">
                                        Add a care team member
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={resetAndClose}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Step 1: Choose Role */}
                        {step === 'role' && (
                            <div className="space-y-4">
                                <p className="text-sm opacity-70 mb-4">
                                    What role will this person play in {childName}'s care?
                                </p>

                                <div className="grid grid-cols-2 gap-3">
                                    {ROLE_CONFIG.map(({ role, icon: Icon, color, label }) => (
                                        <button
                                            key={role}
                                            onClick={() => setSelectedRole(role)}
                                            className={`p-4 rounded-2xl border-2 transition-all ${selectedRole === role
                                                    ? 'border-[#4B0082] bg-[#4B0082]/5'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div
                                                className="w-10 h-10 rounded-xl flex items-center justify-center mb-2 mx-auto"
                                                style={{ backgroundColor: `${color}20` }}
                                            >
                                                <Icon className="w-5 h-5" style={{ color }} />
                                            </div>
                                            <p className="text-sm font-semibold text-center">{label}</p>
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => selectedRole && setStep('details')}
                                    disabled={!selectedRole}
                                    className="w-full py-4 mt-4 rounded-full font-bold bg-[#4B0082] text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#3a006b] transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 'details' && (
                            <div className="space-y-4">
                                <button
                                    onClick={() => setStep('role')}
                                    className="text-sm text-[#4B0082] font-semibold mb-2"
                                >
                                    ← Back
                                </button>

                                <p className="text-sm opacity-70">
                                    Optionally add their email for a direct invitation, or just generate a share link.
                                </p>

                                <div>
                                    <label className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2 block">
                                        Email (Optional)
                                    </label>
                                    <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-100">
                                        <Mail className="w-5 h-5 opacity-40" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="teacher@school.edu"
                                            className="flex-1 bg-transparent focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={createInvite}
                                    disabled={loading}
                                    className="w-full py-4 rounded-full font-bold bg-gradient-to-r from-[#4B0082] to-[#D4AF37] text-white disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Creating Invite...
                                        </>
                                    ) : (
                                        <>
                                            <UserPlus className="w-5 h-5" />
                                            Create Invite Link
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Step 3: Success */}
                        {step === 'success' && inviteLink && (
                            <div className="space-y-4">
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                                        <Check className="w-8 h-8 text-green-600" />
                                    </div>
                                    <h3 className="text-lg font-bold mb-2">Invite Created!</h3>
                                    <p className="text-sm opacity-70">
                                        Share this link with your {selectedRole?.toLowerCase()} to add them to {childName}'s village.
                                    </p>
                                </div>

                                {/* Invite Link */}
                                <div className="p-4 rounded-xl bg-gray-100">
                                    <p className="text-xs font-bold uppercase tracking-wider opacity-60 mb-2">
                                        Invite Link (expires in 7 days)
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm flex-1 truncate font-mono">{inviteLink}</p>
                                        <button
                                            onClick={copyLink}
                                            className="p-2 rounded-lg bg-white hover:bg-gray-50"
                                        >
                                            {copied ? (
                                                <Check className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <Copy className="w-5 h-5 text-[#4B0082]" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={shareInvite}
                                        className="py-3 px-4 rounded-xl bg-[#4B0082] text-white font-semibold flex items-center justify-center gap-2"
                                    >
                                        <Share2 className="w-5 h-5" />
                                        Share
                                    </button>
                                    {email && (
                                        <button
                                            onClick={sendEmail}
                                            className="py-3 px-4 rounded-xl bg-gray-100 text-[#1A1A1A] font-semibold flex items-center justify-center gap-2"
                                        >
                                            <Mail className="w-5 h-5" />
                                            Email
                                        </button>
                                    )}
                                    {!email && (
                                        <button
                                            onClick={copyLink}
                                            className="py-3 px-4 rounded-xl bg-gray-100 text-[#1A1A1A] font-semibold flex items-center justify-center gap-2"
                                        >
                                            {copied ? (
                                                <>
                                                    <Check className="w-5 h-5 text-green-600" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5" />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    )}
                                </div>

                                <button
                                    onClick={resetAndClose}
                                    className="w-full py-3 text-sm text-[#4B0082] font-semibold"
                                >
                                    Done
                                </button>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
