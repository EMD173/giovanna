/**
 * THEORY HUB
 * 
 * Parent education and empowerment center.
 * 
 * Content Areas:
 * - Understanding Autism (neuroscience, sensory, development)
 * - Regulation Theory (polyvagal, co-regulation)
 * - Behavior as Communication (Gabor Maté, Ross Greene)
 * - The Giovanna Philosophy (epigenetic consciousness, dignity)
 * - Advocacy Training (IEP rights, self-advocacy)
 * 
 * Features:
 * - Digestible lesson format
 * - Progress tracking
 * - Key takeaways
 * - Practical applications
 */

import { useState, useEffect } from 'react';
import {
    ArrowLeft,
    BookOpen,
    CheckCircle,
    ChevronRight,
    Heart,
    Sparkles,
    Lock,
    Star,
    Clock,
} from 'lucide-react';
import { useAuthStore } from '../../core/stores/useAuthStore';

// ============================================================================
// TYPES
// ============================================================================

export interface Lesson {
    id: string;
    title: string;
    subtitle: string;
    readTime: number;           // Minutes
    content: LessonContent[];
    keyTakeaways: string[];
    practicalApplication: string;
}

export interface LessonContent {
    type: 'heading' | 'paragraph' | 'quote' | 'highlight' | 'list';
    text: string;
    items?: string[];           // For list type
    source?: string;            // For quote type
}

export interface Course {
    id: string;
    title: string;
    description: string;
    emoji: string;
    color: string;
    bgColor: string;
    lessons: Lesson[];
}

// ============================================================================
// COURSE CONTENT
// ============================================================================

const COURSES: Course[] = [
    // COURSE 1: Understanding Autism
    {
        id: 'understanding-autism',
        title: 'Understanding Autism',
        description: 'The neuroscience behind your child\'s unique brain',
        emoji: '🧠',
        color: '#4B0082',
        bgColor: 'rgba(75, 0, 130, 0.1)',
        lessons: [
            {
                id: 'autism-1',
                title: 'The Autistic Brain',
                subtitle: 'Different, not less',
                readTime: 5,
                content: [
                    { type: 'paragraph', text: 'Autism is a neurological difference — not a disease, not a tragedy, and not a puzzle to solve. The autistic brain processes information differently, often leading to unique strengths and challenges.' },
                    { type: 'heading', text: 'Key Differences' },
                    { type: 'list', text: '', items: [
                        'Intense focus and attention to detail',
                        'Different sensory processing (heightened or reduced sensitivity)',
                        'Pattern recognition and systematic thinking',
                        'Direct, honest communication style',
                        'Deep passions and interests',
                    ]},
                    { type: 'quote', text: 'If you\'ve met one autistic person, you\'ve met one autistic person.', source: 'Dr. Stephen Shore' },
                    { type: 'highlight', text: 'The goal is never to make your child "less autistic," but to support them in navigating a world not designed for their neurotype.' },
                ],
                keyTakeaways: [
                    'Autism is a neurological difference, not a disorder to fix',
                    'Every autistic person is unique',
                    'Strengths and challenges are two sides of the same coin',
                ],
                practicalApplication: 'This week, notice one strength that comes from your child\'s different way of processing the world.',
            },
            {
                id: 'autism-2',
                title: 'Sensory Processing',
                subtitle: 'Experiencing the world intensely',
                readTime: 6,
                content: [
                    { type: 'paragraph', text: 'Many autistic individuals experience the world at "volume 11." Lights are brighter, sounds are louder, textures are more intense. This is not behavior — it is neurology.' },
                    { type: 'heading', text: 'The Eight Senses' },
                    { type: 'list', text: '', items: [
                        'Visual (sight)',
                        'Auditory (hearing)',
                        'Tactile (touch)',
                        'Gustatory (taste)',
                        'Olfactory (smell)',
                        'Vestibular (balance and movement)',
                        'Proprioceptive (body awareness)',
                        'Interoceptive (internal body signals)',
                    ]},
                    { type: 'highlight', text: 'When behavior seems "out of nowhere," look for sensory factors first. The fluorescent lights, the scratchy tag, the background hum — these are real assaults on the nervous system.' },
                    { type: 'paragraph', text: 'Sensory seeking (craving input) and sensory avoiding (escaping input) are both attempts at regulation, not misbehavior.' },
                ],
                keyTakeaways: [
                    'There are 8 senses, not 5',
                    'Sensory overwhelm is neurological, not behavioral',
                    'Both seeking and avoiding are regulation strategies',
                ],
                practicalApplication: 'Observe your child today. What sensory input are they seeking? What are they avoiding?',
            },
            {
                id: 'autism-3',
                title: 'Stimming is Sacred',
                subtitle: 'Self-regulation, not something to stop',
                readTime: 4,
                content: [
                    { type: 'paragraph', text: '"Stimming" (self-stimulatory behavior) includes hand-flapping, rocking, spinning, humming, and countless other repetitive movements. These are not tics to eliminate — they are essential regulation tools.' },
                    { type: 'quote', text: 'When you quiet a child\'s stim, you quiet their voice.', source: 'Julia Bascom' },
                    { type: 'heading', text: 'Why Stimming Matters' },
                    { type: 'list', text: '', items: [
                        'Regulates the nervous system during overwhelm',
                        'Expresses joy and excitement',
                        'Helps with focus and concentration',
                        'Provides predictable, controllable sensory input',
                        'Is a fundamental form of self-expression',
                    ]},
                    { type: 'highlight', text: 'The only time to redirect stimming is if it causes harm. Even then, offer an alternative — never simply stop the behavior.' },
                ],
                keyTakeaways: [
                    'Stimming is regulation, not misbehavior',
                    'Suppressing stims causes psychological harm',
                    'Celebrate stims as communication and expression',
                ],
                practicalApplication: 'Next time your child stims, pause. Instead of redirecting, observe: what are they communicating?',
            },
        ],
    },
    
    // COURSE 2: Regulation Theory
    {
        id: 'regulation-theory',
        title: 'Regulation Theory',
        description: 'The nervous system science behind calm and chaos',
        emoji: '🌿',
        color: '#16A34A',
        bgColor: 'rgba(22, 163, 74, 0.1)',
        lessons: [
            {
                id: 'reg-1',
                title: 'The Polyvagal Ladder',
                subtitle: 'Understanding the nervous system',
                readTime: 5,
                content: [
                    { type: 'paragraph', text: 'Dr. Stephen Porges\' Polyvagal Theory reveals that our nervous system has three states, like rungs on a ladder. Understanding where your child is on this ladder changes everything.' },
                    { type: 'heading', text: 'The Three States' },
                    { type: 'list', text: '', items: [
                        '🟢 SAFE & SOCIAL (Green): Calm, connected, can learn and play',
                        '🟡 FIGHT or FLIGHT (Yellow): Anxious, defensive, mobilized for action',
                        '🔴 SHUTDOWN (Red): Collapsed, withdrawn, frozen',
                    ]},
                    { type: 'highlight', text: 'You cannot reason with a child in fight/flight or shutdown. Regulation must come BEFORE conversation, learning, or consequences.' },
                    { type: 'paragraph', text: 'The nervous system moves up and down this ladder automatically. Our job is not to prevent movement, but to provide safety cues that invite return to the green zone.' },
                ],
                keyTakeaways: [
                    'There are three nervous system states',
                    'Learning and connection require the green zone',
                    'Regulation comes before everything else',
                ],
                practicalApplication: 'Notice your child\'s nervous system state right now. Green, yellow, or red?',
            },
            {
                id: 'reg-2',
                title: 'Co-Regulation',
                subtitle: 'Your calm is their anchor',
                readTime: 5,
                content: [
                    { type: 'paragraph', text: 'Children learn to self-regulate through thousands of experiences of being co-regulated by a calm adult. Your nervous system speaks directly to theirs — for better or worse.' },
                    { type: 'quote', text: 'A dysregulated adult cannot regulate a dysregulated child.', source: 'Dr. Bruce Perry' },
                    { type: 'heading', text: 'Co-Regulation in Practice' },
                    { type: 'list', text: '', items: [
                        'Slow your breathing (visible, audible)',
                        'Lower your voice volume and pitch',
                        'Soften your facial muscles',
                        'Lower your body position',
                        'Reduce your words to almost nothing',
                        'Project safety through your presence',
                    ]},
                    { type: 'highlight', text: 'Before you try to calm your child, ask: "Am I regulated?" If not, your first job is to regulate yourself.' },
                ],
                keyTakeaways: [
                    'Children borrow our calm',
                    'Your nervous system state is contagious',
                    'Self-regulation for parent comes first',
                ],
                practicalApplication: 'Practice: Take three slow breaths right now. Notice your shoulders drop. This is the state your child needs to borrow.',
            },
            {
                id: 'reg-3',
                title: 'Meltdown vs. Tantrum',
                subtitle: 'They are NOT the same thing',
                readTime: 4,
                content: [
                    { type: 'paragraph', text: 'A tantrum is goal-directed: the child wants something and is using behavior to get it. A meltdown is a nervous system crisis: the child has lost all ability to regulate.' },
                    { type: 'heading', text: 'Key Differences' },
                    { type: 'list', text: '', items: [
                        'Tantrum: Child looks for audience, can stop if goal is met',
                        'Meltdown: Child is beyond voluntary control, no goal can help',
                        'Tantrum: Child feels in control',
                        'Meltdown: Child is as scared as you are',
                    ]},
                    { type: 'highlight', text: 'Meltdowns are not manipulation. Your child is not "in control" or "choosing" this. Their nervous system has taken over.' },
                    { type: 'paragraph', text: 'Treating a meltdown like a tantrum (ignoring, punishing) causes trauma. Treating a tantrum like a meltdown (excessive accommodation) reinforces the behavior. Learn to tell the difference.' },
                ],
                keyTakeaways: [
                    'Meltdowns are involuntary nervous system events',
                    'Different response is required for each',
                    'Punishment during a meltdown causes harm',
                ],
                practicalApplication: 'Reflect: Think of a recent "big behavior." Was it a meltdown or a tantrum? How does that change your response strategy?',
            },
        ],
    },
    
    // COURSE 3: Behavior as Communication
    {
        id: 'behavior-communication',
        title: 'Behavior as Communication',
        description: 'What your child is really telling you',
        emoji: '💬',
        color: '#D97706',
        bgColor: 'rgba(217, 119, 6, 0.1)',
        lessons: [
            {
                id: 'behav-1',
                title: 'There\'s No Such Thing as Bad Behavior',
                subtitle: 'Reframing the story we tell',
                readTime: 5,
                content: [
                    { type: 'paragraph', text: 'Every behavior is an attempt to meet a need. Every single one. When we label behavior as "bad," we miss the communication happening underneath.' },
                    { type: 'quote', text: 'Children do well when they can. If they\'re not doing well, something is getting in the way.', source: 'Dr. Ross Greene' },
                    { type: 'heading', text: 'Reframes' },
                    { type: 'list', text: '', items: [
                        '"Aggressive" → Overwhelmed and communicating through body',
                        '"Manipulative" → Resourcefully trying to get needs met',
                        '"Attention-seeking" → Connection-needing',
                        '"Defiant" → Unable, not unwilling',
                        '"Playing games" → Using play to process or connect',
                    ]},
                    { type: 'highlight', text: 'The question is never "How do I stop this behavior?" It is always "What is this behavior communicating?"' },
                ],
                keyTakeaways: [
                    'All behavior is communication',
                    'Labels like "bad" obscure the message',
                    'Kids do well when they can',
                ],
                practicalApplication: 'Pick one "challenging behavior." What need might it be communicating?',
            },
            {
                id: 'behav-2',
                title: 'The Gabor Maté Approach',
                subtitle: 'Compassionate inquiry into behavior',
                readTime: 6,
                content: [
                    { type: 'paragraph', text: 'Dr. Gabor Maté teaches that all human behavior, even the most troubling, is an adaptation to something — often to pain, stress, or unmet needs early in life.' },
                    { type: 'quote', text: 'The question is not why the addiction, but why the pain.', source: 'Dr. Gabor Maté' },
                    { type: 'heading', text: 'Applied to Children' },
                    { type: 'paragraph', text: 'When your child displays behavior that challenges you, Maté invites us to ask:' },
                    { type: 'list', text: '', items: [
                        'What is this child adapting to?',
                        'What stress is the nervous system carrying?',
                        'What need is not being met in this moment?',
                        'What is the function of this behavior for survival?',
                    ]},
                    { type: 'highlight', text: 'This is not about excusing harmful behavior. It\'s about understanding its roots so we can offer what\'s truly needed.' },
                ],
                keyTakeaways: [
                    'Behavior is adaptation, not character flaw',
                    'Ask "what happened?" not "what\'s wrong?"',
                    'Compassionate inquiry opens doors that punishment closes',
                ],
                practicalApplication: 'The next time you feel frustrated with a behavior, pause and ask: "What might my child be adapting to?"',
            },
        ],
    },
    
    // COURSE 4: The Giovanna Philosophy
    {
        id: 'giovanna-philosophy',
        title: 'The Giovanna Philosophy',
        description: 'Dignity-centered care and epigenetic consciousness',
        emoji: '✨',
        color: '#D4AF37',
        bgColor: 'rgba(212, 175, 55, 0.1)',
        lessons: [
            {
                id: 'gio-1',
                title: 'Dignity as Foundation',
                subtitle: 'Your child is not a problem to solve',
                readTime: 4,
                content: [
                    { type: 'paragraph', text: 'Giovanna was built on one core belief: every child possesses inherent dignity that no diagnosis, behavior, or system can diminish.' },
                    { type: 'highlight', text: 'We do not "manage behaviors." We witness communications. We do not "treat symptoms." We honor the whole person.' },
                    { type: 'heading', text: 'Dignity in Practice' },
                    { type: 'list', text: '', items: [
                        'Language matters: "communication" not "behavior"',
                        'Strengths-based: what IS working, not just what isn\'t',
                        'Presuming competence: assume your child understands',
                        'Parent as expert: you know your child most deeply',
                        'Systems serve families, not the other way around',
                    ]},
                    { type: 'paragraph', text: 'Every feature in Giovanna is designed to reflect your child\'s dignity back to you, and to translate that dignity into language institutions understand.' },
                ],
                keyTakeaways: [
                    'Dignity is non-negotiable',
                    'Language shapes how we see the child',
                    'You are the expert on your child',
                ],
                practicalApplication: 'Review any IEP or medical document. Circle every deficit-based phrase. How would you reframe it?',
            },
            {
                id: 'gio-2',
                title: 'Witnessing Over Tracking',
                subtitle: 'Presence, not surveillance',
                readTime: 4,
                content: [
                    { type: 'paragraph', text: 'Many apps "track behaviors" like counting problems. Giovanna witnesses moments — holding space for the full complexity of your child\'s inner world.' },
                    { type: 'quote', text: 'The most precious gift we can offer anyone is our attention.', source: 'Thich Nhat Hanh' },
                    { type: 'heading', text: 'What Witnessing Means' },
                    { type: 'list', text: '', items: [
                        'Observing without judgment',
                        'Recording strengths alongside challenges',
                        'Noting context, not just behavior',
                        'Honoring the narrative, not just the data',
                        'Holding moments with reverence',
                    ]},
                    { type: 'highlight', text: 'Your observations are not evidence against your child. They are love letters to their future self and testimonies of your devotion.' },
                ],
                keyTakeaways: [
                    'Witnessing is an act of love',
                    'Context matters as much as content',
                    'Observations build understanding, not cases',
                ],
                practicalApplication: 'When you capture your next observation, ask: "What am I witnessing, not what am I tracking?"',
            },
        ],
    },
    
    // COURSE 5: Advocacy Training
    {
        id: 'advocacy',
        title: 'Advocacy Training',
        description: 'Navigate the system and fight for your child',
        emoji: '⚖️',
        color: '#DC2626',
        bgColor: 'rgba(220, 38, 38, 0.1)',
        lessons: [
            {
                id: 'adv-1',
                title: 'IEP Fundamentals',
                subtitle: 'Know your rights',
                readTime: 7,
                content: [
                    { type: 'paragraph', text: 'The Individualized Education Program (IEP) is a legal document. You are an equal member of the IEP team — not a guest at the table.' },
                    { type: 'heading', text: 'Your Rights Under IDEA' },
                    { type: 'list', text: '', items: [
                        'Right to participate in all meetings',
                        'Right to receive Prior Written Notice of any changes',
                        'Right to request an IEE (Independent Educational Evaluation)',
                        'Right to review all educational records',
                        'Right to disagree and dispute decisions',
                        'Right to bring advocates or attorneys to meetings',
                    ]},
                    { type: 'highlight', text: 'If it\'s not in writing, it didn\'t happen. Document everything. Request meeting notes. Follow up verbal agreements with email summaries.' },
                    { type: 'heading', text: 'Power Phrases' },
                    { type: 'list', text: '', items: [
                        '"I\'d like that in writing, please."',
                        '"What is the data supporting that recommendation?"',
                        '"I do not consent to that at this time."',
                        '"I\'d like to bring my child\'s advocate to the next meeting."',
                        '"Please provide Prior Written Notice."',
                    ]},
                ],
                keyTakeaways: [
                    'You are an EQUAL member of the IEP team',
                    'Document everything in writing',
                    'You have the right to disagree and dispute',
                ],
                practicalApplication: 'Before your next IEP meeting, write down three specific requests. Practice saying them out loud.',
            },
            {
                id: 'adv-2',
                title: 'Self-Advocacy Skills',
                subtitle: 'Teaching your child to speak up',
                readTime: 5,
                content: [
                    { type: 'paragraph', text: 'The ultimate goal of advocacy is to teach your child to advocate for themselves. This begins early, even without words.' },
                    { type: 'heading', text: 'Building Self-Advocacy' },
                    { type: 'list', text: '', items: [
                        'Help them identify their needs and preferences',
                        'Practice scripts for common situations',
                        'Create a "User Manual" they can share',
                        'Involve them in IEP meetings when appropriate',
                        'Celebrate every time they speak up',
                    ]},
                    { type: 'quote', text: 'Nothing about us, without us.', source: 'Disability Rights Movement' },
                    { type: 'highlight', text: 'Self-advocacy is not about making your child independent of support. It\'s about giving them a voice in what support looks like.' },
                ],
                keyTakeaways: [
                    'Self-advocacy begins in childhood',
                    'Scripts and practice build confidence',
                    'Include your child in decisions about them',
                ],
                practicalApplication: 'Ask your child (at their level): "What\'s one thing you wish adults knew about you?"',
            },
        ],
    },
];

// ============================================================================
// COMPONENT
// ============================================================================

interface TheoryHubProps {
    onBack: () => void;
}

export const TheoryHub = ({ onBack }: TheoryHubProps) => {
    const { user } = useAuthStore();
    const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
    
    // Load progress
    useEffect(() => {
        if (user) {
            const stored = localStorage.getItem(`giovanna-theory-${user.uid}`);
            if (stored) {
                try {
                    setCompletedLessons(new Set(JSON.parse(stored)));
                } catch (e) {
                    console.error('Failed to load theory progress:', e);
                }
            }
        }
    }, [user]);
    
    // Save progress
    const markComplete = (lessonId: string) => {
        const newCompleted = new Set(completedLessons);
        newCompleted.add(lessonId);
        setCompletedLessons(newCompleted);
        
        if (user) {
            localStorage.setItem(
                `giovanna-theory-${user.uid}`,
                JSON.stringify([...newCompleted])
            );
        }
    };
    
    // Calculate course progress
    const getCourseProgress = (course: Course) => {
        const completed = course.lessons.filter(l => completedLessons.has(l.id)).length;
        return {
            completed,
            total: course.lessons.length,
            percentage: Math.round((completed / course.lessons.length) * 100),
        };
    };
    
    // Total stats
    const totalLessons = COURSES.reduce((sum, c) => sum + c.lessons.length, 0);
    const totalCompleted = completedLessons.size;
    
    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500">Please sign in to access learning</p>
            </div>
        );
    }
    
    // LESSON VIEW
    if (selectedLesson && selectedCourse) {
        return (
            <LessonView
                lesson={selectedLesson}
                course={selectedCourse}
                isComplete={completedLessons.has(selectedLesson.id)}
                onBack={() => setSelectedLesson(null)}
                onComplete={() => markComplete(selectedLesson.id)}
            />
        );
    }
    
    // COURSE VIEW
    if (selectedCourse) {
        return (
            <CourseView
                course={selectedCourse}
                completedLessons={completedLessons}
                onBack={() => setSelectedCourse(null)}
                onSelectLesson={setSelectedLesson}
            />
        );
    }
    
    // MAIN HUB VIEW
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
                        Theory Hub
                    </h1>
                    <p className="text-sm opacity-70">
                        Parent education and empowerment
                    </p>
                </div>
            </header>
            
            {/* Progress Overview */}
            <div className="glass-panel p-4 rounded-2xl mb-6 gold-leaf-border">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#4B0082] to-[#D4AF37] flex items-center justify-center">
                        <BookOpen className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm opacity-70">Your Progress</p>
                        <p className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            {totalCompleted} of {totalLessons} lessons
                        </p>
                        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                                className="h-full rounded-full bg-gradient-to-r from-[#4B0082] to-[#D4AF37] transition-all"
                                style={{ width: `${(totalCompleted / totalLessons) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Course Cards */}
            <div className="space-y-3">
                {COURSES.map(course => {
                    const progress = getCourseProgress(course);
                    const isComplete = progress.completed === progress.total;
                    
                    return (
                        <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course)}
                            className="glass-panel p-4 rounded-2xl w-full text-left hover:scale-[1.01] active:scale-[0.99] transition-transform"
                        >
                            <div className="flex items-center gap-4">
                                <div 
                                    className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl relative"
                                    style={{ backgroundColor: course.bgColor }}
                                >
                                    {course.emoji}
                                    {isComplete && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                                            <CheckCircle className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>
                                            {course.title}
                                        </h3>
                                        <ChevronRight className="w-5 h-5 opacity-30" />
                                    </div>
                                    <p className="text-xs opacity-60">{course.description}</p>
                                    
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full rounded-full transition-all"
                                                style={{ 
                                                    width: `${progress.percentage}%`,
                                                    backgroundColor: course.color,
                                                }}
                                            />
                                        </div>
                                        <span className="text-xs opacity-50">
                                            {progress.completed}/{progress.total}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const CourseView = ({
    course,
    completedLessons,
    onBack,
    onSelectLesson,
}: {
    course: Course;
    completedLessons: Set<string>;
    onBack: () => void;
    onSelectLesson: (lesson: Lesson) => void;
}) => {
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to courses
            </button>
            
            {/* Course Header */}
            <div 
                className="glass-panel p-6 rounded-2xl mb-6"
                style={{ borderLeft: `4px solid ${course.color}` }}
            >
                <div className="flex items-center gap-4">
                    <span className="text-4xl">{course.emoji}</span>
                    <div>
                        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                            {course.title}
                        </h1>
                        <p className="text-sm opacity-70">{course.description}</p>
                    </div>
                </div>
            </div>
            
            {/* Lesson List */}
            <div className="space-y-2">
                {course.lessons.map((lesson, index) => {
                    const isComplete = completedLessons.has(lesson.id);
                    const isUnlocked = index === 0 || completedLessons.has(course.lessons[index - 1].id);
                    
                    return (
                        <button
                            key={lesson.id}
                            onClick={() => isUnlocked && onSelectLesson(lesson)}
                            disabled={!isUnlocked}
                            className={`glass-panel p-4 rounded-xl w-full text-left transition-all ${
                                isUnlocked 
                                    ? 'hover:bg-white/50 cursor-pointer'
                                    : 'opacity-50 cursor-not-allowed'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <div 
                                    className="w-10 h-10 rounded-full flex items-center justify-center"
                                    style={{ 
                                        backgroundColor: isComplete ? course.color : 'rgba(0,0,0,0.05)',
                                        color: isComplete ? 'white' : course.color,
                                    }}
                                >
                                    {isComplete ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : isUnlocked ? (
                                        <span className="font-bold">{index + 1}</span>
                                    ) : (
                                        <Lock className="w-4 h-4" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                        {lesson.title}
                                    </h3>
                                    <p className="text-xs opacity-60">{lesson.subtitle}</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 text-xs opacity-50">
                                        <Clock className="w-3 h-3" />
                                        {lesson.readTime} min
                                    </div>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const LessonView = ({
    lesson,
    course,
    isComplete,
    onBack,
    onComplete,
}: {
    lesson: Lesson;
    course: Course;
    isComplete: boolean;
    onBack: () => void;
    onComplete: () => void;
}) => {
    return (
        <div className="flex flex-col h-full pt-6 pb-32 px-4 fade-in overflow-y-auto">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="flex items-center gap-2 text-sm text-[#4B0082] hover:opacity-70 mb-4"
            >
                <ArrowLeft className="w-4 h-4" />
                Back to {course.title}
            </button>
            
            {/* Lesson Header */}
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <span 
                        className="text-xs px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: course.bgColor, color: course.color }}
                    >
                        {course.title}
                    </span>
                    <span className="text-xs opacity-50 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {lesson.readTime} min read
                    </span>
                </div>
                <h1 
                    className="text-2xl font-bold"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
                >
                    {lesson.title}
                </h1>
                <p className="text-sm opacity-70">{lesson.subtitle}</p>
            </div>
            
            {/* Content */}
            <div className="space-y-4">
                {lesson.content.map((block, i) => (
                    <ContentBlock key={i} block={block} courseColor={course.color} />
                ))}
            </div>
            
            {/* Key Takeaways */}
            <div className="mt-8 glass-panel p-4 rounded-2xl border-l-4" style={{ borderColor: course.color }}>
                <h3 className="font-bold mb-3 flex items-center gap-2">
                    <Star className="w-4 h-4" style={{ color: course.color }} />
                    Key Takeaways
                </h3>
                <ul className="space-y-2">
                    {lesson.keyTakeaways.map((takeaway, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: course.color }} />
                            <span>{takeaway}</span>
                        </li>
                    ))}
                </ul>
            </div>
            
            {/* Practical Application */}
            <div className="mt-4 glass-panel p-4 rounded-2xl gold-leaf-border">
                <h3 className="font-bold mb-2 flex items-center gap-2">
                    <Heart className="w-4 h-4 text-[#D4AF37]" />
                    Try This
                </h3>
                <p className="text-sm">{lesson.practicalApplication}</p>
            </div>
            
            {/* Complete Button */}
            <div className="mt-8">
                {isComplete ? (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-100 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-bold">Lesson Complete</span>
                    </div>
                ) : (
                    <button
                        onClick={onComplete}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4B0082] to-[#7C3AED] text-white font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    >
                        <CheckCircle className="w-5 h-5" />
                        Mark as Complete
                    </button>
                )}
            </div>
        </div>
    );
};

const ContentBlock = ({
    block,
    courseColor,
}: {
    block: LessonContent;
    courseColor: string;
}) => {
    switch (block.type) {
        case 'heading':
            return (
                <h2 className="text-lg font-bold mt-6" style={{ color: 'var(--text-primary)' }}>
                    {block.text}
                </h2>
            );
        
        case 'paragraph':
            return (
                <p className="text-sm leading-relaxed opacity-80">
                    {block.text}
                </p>
            );
        
        case 'quote':
            return (
                <blockquote 
                    className="pl-4 py-2 italic text-sm border-l-4"
                    style={{ borderColor: courseColor }}
                >
                    "{block.text}"
                    {block.source && (
                        <footer className="mt-1 not-italic opacity-60 text-xs">
                            — {block.source}
                        </footer>
                    )}
                </blockquote>
            );
        
        case 'highlight':
            return (
                <div 
                    className="p-4 rounded-xl text-sm"
                    style={{ backgroundColor: `${courseColor}15` }}
                >
                    <Sparkles className="w-4 h-4 mb-2" style={{ color: courseColor }} />
                    {block.text}
                </div>
            );
        
        case 'list':
            return (
                <ul className="space-y-2 ml-4">
                    {block.items?.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                            <span 
                                className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
                                style={{ backgroundColor: courseColor }}
                            />
                            {item}
                        </li>
                    ))}
                </ul>
            );
        
        default:
            return null;
    }
};

export default TheoryHub;
