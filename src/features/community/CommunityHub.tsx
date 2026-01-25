/**
 * COMMUNITY HUB
 * 
 * Connect caregivers with resources, support, and community.
 * 
 * Features:
 * - Curated resource library
 * - Crisis support hotlines
 * - Recommended communities
 * - Local resource finder (conceptual)
 * - Advocacy organizations
 * - Parent wisdom/tips sharing
 */

import { useState } from 'react';
import {
    ArrowLeft,
    Heart,
    Phone,
    ExternalLink,
    Users,
    BookOpen,
    MessageCircle,
    Search,
    Star,
    Copy,
    Check,
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

type ResourceCategory = 'crisis' | 'support' | 'advocacy' | 'education' | 'community';

interface Resource {
    id: string;
    category: ResourceCategory;
    name: string;
    description: string;
    type: 'hotline' | 'website' | 'organization' | 'community' | 'book';
    url?: string;
    phone?: string;
    highlight?: string;
    tags: string[];
}

interface ParentTip {
    id: string;
    tip: string;
    category: string;
    author: string;
    likes: number;
}

// ============================================================================
// DATA
// ============================================================================

const CATEGORIES: Record<ResourceCategory, {
    label: string;
    emoji: string;
    color: string;
    description: string;
}> = {
    crisis: {
        label: 'Crisis Support',
        emoji: '🆘',
        color: '#DC2626',
        description: 'Immediate help when you need it most',
    },
    support: {
        label: 'Support Groups',
        emoji: '💞',
        color: '#EC4899',
        description: 'Connect with other families',
    },
    advocacy: {
        label: 'Advocacy',
        emoji: '📢',
        color: '#7C3AED',
        description: 'Know your rights and fight for them',
    },
    education: {
        label: 'Education',
        emoji: '📚',
        color: '#0EA5E9',
        description: 'Learn and grow together',
    },
    community: {
        label: 'Online Communities',
        emoji: '🌐',
        color: '#16A34A',
        description: 'Find your people online',
    },
};

const RESOURCES: Resource[] = [
    // Crisis Support
    {
        id: 'crisis-1',
        category: 'crisis',
        name: '988 Suicide & Crisis Lifeline',
        description: '24/7 support for mental health crises. Also available via chat.',
        type: 'hotline',
        phone: '988',
        highlight: 'Call or text 988',
        tags: ['mental health', 'crisis', '24/7'],
    },
    {
        id: 'crisis-2',
        category: 'crisis',
        name: 'Crisis Text Line',
        description: 'Text HOME to 741741 for free crisis support.',
        type: 'hotline',
        phone: '741741',
        highlight: 'Text HOME to 741741',
        tags: ['text', 'crisis', '24/7'],
    },
    {
        id: 'crisis-3',
        category: 'crisis',
        name: 'Autism Society Crisis Line',
        description: 'Support specifically for autism-related crises and challenges.',
        type: 'hotline',
        phone: '1-800-328-8476',
        url: 'https://autismsociety.org',
        tags: ['autism', 'crisis', 'family'],
    },
    
    // Support Groups
    {
        id: 'support-1',
        category: 'support',
        name: 'The Arc',
        description: 'The nation\'s largest community-based organization for people with disabilities and families.',
        type: 'organization',
        url: 'https://thearc.org',
        tags: ['disability', 'advocacy', 'local chapters'],
    },
    {
        id: 'support-2',
        category: 'support',
        name: 'Parent to Parent USA',
        description: 'Network connecting parents of children with special needs to trained support parents.',
        type: 'organization',
        url: 'https://www.p2pusa.org',
        tags: ['peer support', 'parents', 'training'],
    },
    {
        id: 'support-3',
        category: 'support',
        name: 'National Alliance on Mental Illness (NAMI)',
        description: 'Family support groups and education programs nationwide.',
        type: 'organization',
        url: 'https://nami.org',
        tags: ['mental health', 'family', 'education'],
    },
    
    // Advocacy
    {
        id: 'advocacy-1',
        category: 'advocacy',
        name: 'Wrightslaw',
        description: 'The go-to resource for special education law and advocacy.',
        type: 'website',
        url: 'https://wrightslaw.com',
        highlight: 'Essential for IEP advocacy',
        tags: ['IEP', 'law', 'education'],
    },
    {
        id: 'advocacy-2',
        category: 'advocacy',
        name: 'COPAA',
        description: 'Council of Parent Attorneys and Advocates - protecting children\'s right to education.',
        type: 'organization',
        url: 'https://www.copaa.org',
        tags: ['IEP', 'legal', 'education'],
    },
    {
        id: 'advocacy-3',
        category: 'advocacy',
        name: 'Autistic Self Advocacy Network (ASAN)',
        description: 'Run by and for autistic people, promoting inclusion and self-advocacy.',
        type: 'organization',
        url: 'https://autisticadvocacy.org',
        tags: ['autism', 'self-advocacy', 'neurodiversity'],
    },
    
    // Education
    {
        id: 'education-1',
        category: 'education',
        name: 'Understood.org',
        description: 'Expert resources for learning and attention issues.',
        type: 'website',
        url: 'https://understood.org',
        tags: ['learning', 'ADHD', 'dyslexia'],
    },
    {
        id: 'education-2',
        category: 'education',
        name: 'Think Inclusive',
        description: 'Podcast and resources celebrating inclusive education.',
        type: 'website',
        url: 'https://thinkinclusive.us',
        tags: ['inclusion', 'education', 'podcast'],
    },
    {
        id: 'education-3',
        category: 'education',
        name: 'Dr. Ross Greene - Lives in the Balance',
        description: 'Collaborative problem solving approach - "Kids do well if they can."',
        type: 'website',
        url: 'https://livesinthebalance.org',
        highlight: 'Recommended approach',
        tags: ['behavior', 'CPS', 'philosophy'],
    },
    
    // Online Communities
    {
        id: 'community-1',
        category: 'community',
        name: 'r/Autism_Parenting',
        description: 'Reddit community for parents of autistic children.',
        type: 'community',
        url: 'https://reddit.com/r/Autism_Parenting',
        tags: ['reddit', 'parents', 'community'],
    },
    {
        id: 'community-2',
        category: 'community',
        name: 'Facebook Parent Groups',
        description: 'Many condition-specific groups. Search "[condition] parents support group."',
        type: 'community',
        url: 'https://facebook.com/groups',
        tags: ['facebook', 'specific conditions', 'support'],
    },
    {
        id: 'community-3',
        category: 'community',
        name: 'Mighty Well\'s Discord',
        description: 'Active disability community with parent channels.',
        type: 'community',
        url: 'https://www.mightywellblog.com',
        tags: ['discord', 'chronic illness', 'community'],
    },
];

const PARENT_TIPS: ParentTip[] = [
    {
        id: 'tip-1',
        tip: 'Document everything. Take photos of behavior charts, keep copies of all IEP documents, and always follow up verbal conversations with email summaries.',
        category: 'Advocacy',
        author: 'Maria, mom of 12yo',
        likes: 47,
    },
    {
        id: 'tip-2',
        tip: 'Find your "one thing" each day. Some days survival IS the win. You don\'t have to do it all.',
        category: 'Self-Care',
        author: 'Jennifer, mom of twins',
        likes: 89,
    },
    {
        id: 'tip-3',
        tip: 'Visual schedules changed our lives. We laminated them and use velcro - flexible but predictable.',
        category: 'Strategies',
        author: 'David, dad of 8yo',
        likes: 62,
    },
    {
        id: 'tip-4',
        tip: 'Build your emergency backup list before you need it. Respite care, trusted neighbors, family members who can step in.',
        category: 'Planning',
        author: 'Sarah, single mom',
        likes: 71,
    },
    {
        id: 'tip-5',
        tip: 'Your child\'s therapist should be a partner, not a dictator. If you feel dismissed, it\'s okay to find someone new.',
        category: 'Healthcare',
        author: 'Mike & Lisa, parents of 6yo',
        likes: 55,
    },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface CommunityHubProps {
    onBack: () => void;
}

export const CommunityHub = ({ onBack }: CommunityHubProps) => {
    const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [copiedPhone, setCopiedPhone] = useState<string | null>(null);
    
    // Filter resources
    const filteredResources = RESOURCES.filter(r => {
        if (selectedCategory && r.category !== selectedCategory) return false;
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            return r.name.toLowerCase().includes(query) ||
                   r.description.toLowerCase().includes(query) ||
                   r.tags.some(t => t.toLowerCase().includes(query));
        }
        return true;
    });
    
    // Copy phone number
    const copyPhone = (phone: string) => {
        navigator.clipboard.writeText(phone);
        setCopiedPhone(phone);
        setTimeout(() => setCopiedPhone(null), 2000);
    };
    
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* Header */}
            <header className="flex items-center gap-3 mb-6">
                <button 
                    onClick={onBack}
                    className="p-2 rounded-full bg-white/40 hover:bg-white/60 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-[#4B0082]" />
                </button>
                <div className="flex-1">
                    <h1 
                        className="text-2xl font-bold"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                    >
                        Community Hub
                    </h1>
                    <p className="text-sm opacity-70">
                        You're not alone on this journey
                    </p>
                </div>
            </header>
            
            {/* Crisis Banner - Always visible */}
            <div className="glass-panel p-4 rounded-2xl mb-6 bg-red-50 border border-red-200">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
                        <Phone className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                        <p className="font-bold text-red-800 text-sm">In Crisis? Get Help Now</p>
                        <p className="text-xs text-red-700">988 (call/text) • Text HOME to 741741</p>
                    </div>
                    <a 
                        href="tel:988"
                        className="px-3 py-2 rounded-xl bg-red-600 text-white text-sm font-medium"
                    >
                        Call 988
                    </a>
                </div>
            </div>
            
            {/* Search */}
            <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 opacity-40" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search resources, organizations..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/60 border border-white/50 focus:ring-2 focus:ring-[#4B0082] outline-none text-sm"
                />
            </div>
            
            {/* Category Pills */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-4 -mx-4 px-4">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        selectedCategory === null
                            ? 'bg-[#4B0082] text-white'
                            : 'bg-white/40 hover:bg-white/60'
                    }`}
                >
                    All
                </button>
                {(Object.keys(CATEGORIES) as ResourceCategory[]).map(cat => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                            selectedCategory === cat
                                ? 'bg-[#4B0082] text-white'
                                : 'bg-white/40 hover:bg-white/60'
                        }`}
                    >
                        {CATEGORIES[cat].emoji} {CATEGORIES[cat].label}
                    </button>
                ))}
            </div>
            
            {/* Resources List */}
            <div className="space-y-3 mb-8">
                {filteredResources.map(resource => {
                    const catConfig = CATEGORIES[resource.category];
                    return (
                        <div 
                            key={resource.id}
                            className="glass-panel p-4 rounded-2xl"
                        >
                            <div className="flex items-start gap-3">
                                <div 
                                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${catConfig.color}15` }}
                                >
                                    {resource.type === 'hotline' ? (
                                        <Phone className="w-5 h-5" style={{ color: catConfig.color }} />
                                    ) : resource.type === 'community' ? (
                                        <Users className="w-5 h-5" style={{ color: catConfig.color }} />
                                    ) : resource.type === 'book' ? (
                                        <BookOpen className="w-5 h-5" style={{ color: catConfig.color }} />
                                    ) : (
                                        <ExternalLink className="w-5 h-5" style={{ color: catConfig.color }} />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                                            {resource.name}
                                        </h3>
                                        {resource.highlight && (
                                            <span 
                                                className="px-2 py-0.5 rounded-full text-xs font-medium"
                                                style={{ 
                                                    backgroundColor: `${catConfig.color}20`,
                                                    color: catConfig.color 
                                                }}
                                            >
                                                ★ {resource.highlight}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs opacity-70 mt-1">{resource.description}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {resource.phone && (
                                            <button
                                                onClick={() => copyPhone(resource.phone!)}
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/50 text-xs font-medium hover:bg-white/70 transition-colors"
                                            >
                                                {copiedPhone === resource.phone ? (
                                                    <>
                                                        <Check className="w-3 h-3 text-green-600" />
                                                        Copied!
                                                    </>
                                                ) : (
                                                    <>
                                                        <Copy className="w-3 h-3" />
                                                        {resource.phone}
                                                    </>
                                                )}
                                            </button>
                                        )}
                                        {resource.url && (
                                            <a
                                                href={resource.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#4B0082]/10 text-[#4B0082] text-xs font-medium hover:bg-[#4B0082]/20 transition-colors"
                                            >
                                                <ExternalLink className="w-3 h-3" />
                                                Visit
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            
            {/* Parent Wisdom Section */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                    <Star className="w-5 h-5 text-[#D4AF37]" />
                    <h2 className="text-sm font-bold">Parent Wisdom</h2>
                </div>
                
                <div className="space-y-3">
                    {PARENT_TIPS.map(tip => (
                        <div key={tip.id} className="glass-panel p-4 rounded-xl">
                            <p className="text-sm mb-2">"{tip.tip}"</p>
                            <div className="flex items-center justify-between text-xs opacity-60">
                                <span>— {tip.author}</span>
                                <span className="flex items-center gap-1">
                                    <Heart className="w-3 h-3" />
                                    {tip.likes}
                                </span>
                            </div>
                            <span 
                                className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs bg-[#4B0082]/10 text-[#4B0082]"
                            >
                                {tip.category}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* You're Not Alone Card */}
            <div className="glass-panel p-4 rounded-2xl bg-[#4B0082]/5 border border-[#4B0082]/10 text-center">
                <MessageCircle className="w-8 h-8 mx-auto mb-2 text-[#4B0082]" />
                <p className="font-bold text-sm mb-1">You're Not Alone</p>
                <p className="text-xs opacity-70">
                    Millions of families walk this path. Your struggles are valid. 
                    Your love is evident. Reach out when you need to.
                </p>
            </div>
        </div>
    );
};

export default CommunityHub;
