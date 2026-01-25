/**
 * STRATEGY DATA: Multi-Lens Regulation Library
 * 
 * Research-backed strategies organized by therapeutic lens:
 * - Polyvagal (Stephen Porges)
 * - Epigenetic (Bruce Perry, Oprah Winfrey)
 * - Somatic (Bessel van der Kolk)
 * - Spiritual (Eckhart Tolle, Wayne Dyer, Gary Zukav)
 * - Intergenerational (Mark Wolynn)
 * - ABA Alternatives (PBIS, naturalistic approaches)
 */

// ========================================================================
// TYPE DEFINITIONS
// ========================================================================

export type StrategyCategory = 
    | 'sensory' 
    | 'breathwork' 
    | 'movement' 
    | 'co-regulation' 
    | 'somatic' 
    | 'mindfulness';

export type TherapeuticLens = 
    | 'polyvagal'
    | 'epigenetic'
    | 'somatic'
    | 'aba_alternative'
    | 'spiritual'
    | 'intergenerational';

export type NervousSystemBranch = 
    | 'sympathetic'      // Fight/flight activation
    | 'parasympathetic'  // Rest/digest calming
    | 'social_engagement'; // Ventral vagal connection

export interface NervousSystemEffect {
    primarySystem: NervousSystemBranch;
    action: string;
    bodyEffect: string;
    tooltipEducation: string;
}

export interface ResearchSource {
    author: string;
    work: string;
    quote?: string;
}

export interface EnhancedStrategy {
    id: string;
    title: string;
    category: StrategyCategory;
    icon: string; // Emoji for now, will use Tabler icons
    color: string;
    lenses: TherapeuticLens[];
    nervousSystemEffect: NervousSystemEffect;
    description: string;
    howToUse: string[];
    whenToUse: string[];
    contraindications?: string[];
    researchSources: ResearchSource[];
    relatedStrategies?: string[];
}

// ========================================================================
// LENS METADATA
// ========================================================================

export const LENS_INFO: Record<TherapeuticLens, { label: string; simpleLabel: string; color: string; description: string }> = {
    polyvagal: {
        label: 'Polyvagal',
        simpleLabel: 'Nervous System',
        color: '#4B0082',
        description: 'Based on how our nervous system detects safety — calming through the body'
    },
    epigenetic: {
        label: 'Epigenetic',
        simpleLabel: 'Brain Development',
        color: '#D4AF37',
        description: 'How experiences shape the developing brain — patterned, rhythmic, relational'
    },
    somatic: {
        label: 'Somatic',
        simpleLabel: 'Body-Based',
        color: '#2E8B57',
        description: 'Working through the body to release stress and find calm'
    },
    spiritual: {
        label: 'Spiritual',
        simpleLabel: 'Presence & Mindfulness',
        color: '#9370DB',
        description: 'Finding peace through presence, acceptance, and consciousness'
    },
    intergenerational: {
        label: 'Intergenerational',
        simpleLabel: 'Family Patterns',
        color: '#CD853F',
        description: 'Understanding how family history affects our responses'
    },
    aba_alternative: {
        label: 'Naturalistic',
        simpleLabel: 'Child-Led',
        color: '#20B2AA',
        description: 'Relationship-based approaches that honor your child\'s autonomy'
    }
};

export const CATEGORY_INFO: Record<StrategyCategory, { label: string; icon: string }> = {
    sensory: { label: 'Sensory', icon: '✋' },
    breathwork: { label: 'Breathwork', icon: '🌬️' },
    movement: { label: 'Movement', icon: '🏃' },
    'co-regulation': { label: 'Co-Regulation', icon: '💜' },
    somatic: { label: 'Somatic', icon: '🧘' },
    mindfulness: { label: 'Mindfulness', icon: '🙏' }
};

// ========================================================================
// STRATEGY DATABASE
// ========================================================================

export const STRATEGIES: EnhancedStrategy[] = [
    // ====== SENSORY STRATEGIES ======
    {
        id: 'deep-pressure',
        title: 'Deep Pressure',
        category: 'sensory',
        icon: '🫂',
        color: 'bg-blue-500',
        lenses: ['polyvagal', 'somatic', 'epigenetic'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Activates vagal tone through mechanoreceptor stimulation',
            bodyEffect: 'Slows heart rate, releases oxytocin, reduces cortisol',
            tooltipEducation: 'Deep pressure activates Pacinian corpuscles in the skin, which send calming signals through the vagus nerve to the brainstem. This shifts the autonomic nervous system from "fight or flight" (sympathetic) to "rest and digest" (parasympathetic).'
        },
        description: 'Apply firm, even pressure to help calm the nervous system and reduce anxiety through proprioceptive input.',
        howToUse: [
            'Find a weighted blanket, compression vest, or use firm hugs',
            'Apply gentle, firm pressure across the body — not squeezing',
            'Hold for 5-10 minutes or until you feel the body soften',
            'Breathe slowly and deeply together'
        ],
        whenToUse: ['Sensory overload', 'Anxiety', 'Before transitions', 'Bedtime', 'After big emotions'],
        contraindications: ['If child actively resists touch', 'During peak of meltdown (wait for downslope)'],
        researchSources: [
            { author: 'Bruce Perry', work: 'What Happened to You?', quote: 'Regulation happens through patterned, repetitive, rhythmic, relational activities.' },
            { author: 'Temple Grandin', work: 'Thinking in Pictures', quote: 'Deep pressure has a calming effect on the nervous system.' },
            { author: 'A. Jean Ayres', work: 'Sensory Integration and the Child' }
        ],
        relatedStrategies: ['heavy-work', 'co-regulation-presence']
    },
    {
        id: 'dim-lighting',
        title: 'Dim Lighting',
        category: 'sensory',
        icon: '🌙',
        color: 'bg-indigo-500',
        lenses: ['polyvagal', 'somatic'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Reduces visual cortex activation and signals "rest" to the brain',
            bodyEffect: 'Triggers melatonin production, lowers arousal state',
            tooltipEducation: 'Bright light stimulates the sympathetic nervous system and suppresses melatonin. Dimming lights sends a neurological signal that it\'s safe to rest, activating the parasympathetic "rest and digest" response.'
        },
        description: 'Reduce visual stimulation by lowering lights to create a calming sanctuary environment.',
        howToUse: [
            'Turn off harsh overhead lights',
            'Use warm-toned lamps or candlelight (safe flameless)',
            'Close curtains or blinds if daylight is intense',
            'Create a cozy, cave-like space'
        ],
        whenToUse: ['Overstimulation', 'Before sleep', 'During sensory breaks', 'Screen fatigue'],
        researchSources: [
            { author: 'Stephen Porges', work: 'The Polyvagal Theory', quote: 'Neuroception of safety includes environmental cues like lighting.' }
        ],
        relatedStrategies: ['safe-song', 'sanctuary-space']
    },
    {
        id: 'safe-song',
        title: 'Safe Song',
        category: 'sensory',
        icon: '🎵',
        color: 'bg-purple-500',
        lenses: ['polyvagal', 'epigenetic', 'spiritual'],
        nervousSystemEffect: {
            primarySystem: 'social_engagement',
            action: 'Activates the social engagement system through auditory processing',
            bodyEffect: 'Regulates middle ear muscles, calms the heart through vagal pathways',
            tooltipEducation: 'Stephen Porges discovered that prosodic (melodic) sounds activate the middle ear muscles connected to the vagus nerve. Familiar, soothing music signals safety to the nervous system and activates the "social engagement" branch.'
        },
        description: 'Play familiar, soothing music that provides comfort, predictability, and co-regulation through sound.',
        howToUse: [
            'Choose a favorite calming song (child\'s preference matters)',
            'Play at a low, comfortable volume',
            'Hum or sing along softly if helpful — your voice is regulating',
            'Use headphones if noise-canceling helps'
        ],
        whenToUse: ['Transitions', 'Car rides', 'Medical appointments', 'Bedtime routine', 'Recovery after distress'],
        researchSources: [
            { author: 'Stephen Porges', work: 'The Polyvagal Theory', quote: 'Prosodic vocalizations signal safety and activate the social engagement system.' },
            { author: 'Eckhart Tolle', work: 'The Power of Now', quote: 'Music can be a doorway into presence.' }
        ],
        relatedStrategies: ['humming-voo', 'co-regulation-prosody']
    },

    // ====== MOVEMENT STRATEGIES ======
    {
        id: 'heavy-work',
        title: 'Heavy Work',
        category: 'movement',
        icon: '💪',
        color: 'bg-orange-500',
        lenses: ['polyvagal', 'somatic', 'aba_alternative'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Provides proprioceptive input that organizes the nervous system',
            bodyEffect: 'Activates muscle and joint receptors, releases tension, calms arousal',
            tooltipEducation: 'Proprioceptive input from muscles and joints sends powerful organizing signals to the brain. "Heavy work" — pushing, pulling, carrying — gives the nervous system the sensory input it craves during dysregulation, helping shift from chaos to calm.'
        },
        description: 'Engage muscles through pushing, pulling, or carrying to reorganize the body and regulate arousal.',
        howToUse: [
            'Push against a wall with flat palms for 10-30 seconds',
            'Carry a heavy basket of laundry or stack of books',
            'Do wall push-ups, animal walks, or wheelbarrow walking',
            'Jump on a trampoline or stomp feet rhythmically'
        ],
        whenToUse: ['Restlessness', 'Seeking sensory input', 'Before focus tasks', 'After prolonged sitting', 'High energy states'],
        researchSources: [
            { author: 'A. Jean Ayres', work: 'Sensory Integration and the Child' },
            { author: 'Bruce Perry', work: 'The Boy Who Was Raised as a Dog', quote: 'Movement is one of the most regulating activities for the developing brain.' }
        ],
        relatedStrategies: ['deep-pressure', 'rhythmic-movement']
    },
    {
        id: 'rhythmic-movement',
        title: 'Rhythmic Movement',
        category: 'movement',
        icon: '🎪',
        color: 'bg-pink-500',
        lenses: ['epigenetic', 'polyvagal', 'somatic'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Patterned repetition entrains brainstem regulation',
            bodyEffect: 'Synchronizes heart rate with breath, calms the primitive brain',
            tooltipEducation: 'Bruce Perry emphasizes that "patterned, repetitive, rhythmic" activities are key to regulation. Rocking, swinging, and bouncing mimic the movements we experienced in the womb and as infants, activating deep regulatory circuits in the brainstem.'
        },
        description: 'Use rocking, swinging, or bouncing to engage the body\'s natural calming rhythms.',
        howToUse: [
            'Rock gently in a rocking chair or swing',
            'Sway side to side while standing or sitting',
            'Bounce gently on an exercise ball or bed',
            'Match the rhythm to the child\'s current state, then gradually slow'
        ],
        whenToUse: ['Emotional distress', 'Difficulty transitioning', 'Before bedtime', 'During anxiety'],
        researchSources: [
            { author: 'Bruce Perry', work: 'What Happened to You?', quote: 'Patterned, repetitive, rhythmic, relational activities are the most powerful regulators.' },
            { author: 'Bessel van der Kolk', work: 'The Body Keeps the Score' }
        ],
        relatedStrategies: ['safe-song', 'co-regulation-presence']
    },

    // ====== BREATHWORK STRATEGIES ======
    {
        id: 'physiological-sigh',
        title: 'Physiological Sigh',
        category: 'breathwork',
        icon: '😮‍💨',
        color: 'bg-teal-500',
        lenses: ['polyvagal', 'somatic'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Activates the vagal brake through extended exhale',
            bodyEffect: 'Immediately lowers heart rate and blood pressure',
            tooltipEducation: 'The physiological sigh (double inhale + long exhale) is the fastest known way to calm the nervous system in real-time. The extended exhale activates the "vagal brake," slowing the heart and signaling safety to the body.'
        },
        description: 'Two quick inhales through the nose followed by a long exhale — the fastest way to calm the nervous system.',
        howToUse: [
            'Inhale through the nose',
            'Take a second quick "sip" of air through the nose',
            'Exhale slowly and fully through the mouth',
            'Repeat 1-3 times'
        ],
        whenToUse: ['Acute stress', 'Panic', 'Before challenging moments', 'Anger surge', 'Immediate calming needed'],
        researchSources: [
            { author: 'Andrew Huberman', work: 'Huberman Lab Podcast', quote: 'The physiological sigh is the fastest way to calm the nervous system in real-time.' },
            { author: 'Stephen Porges', work: 'The Polyvagal Theory' }
        ],
        relatedStrategies: ['box-breathing', 'humming-voo']
    },
    {
        id: 'humming-voo',
        title: 'Humming / Voo Sound',
        category: 'breathwork',
        icon: '🐝',
        color: 'bg-amber-500',
        lenses: ['polyvagal', 'somatic', 'spiritual'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Vibrates the vagus nerve through vocal cord resonance',
            bodyEffect: 'Directly stimulates vagal tone, calms the gut and heart',
            tooltipEducation: 'The vagus nerve runs through the throat. When you hum or make a low "voo" sound, the vibrations physically massage the vagus nerve, activating the parasympathetic response. Peter Levine teaches this as a core somatic regulation tool.'
        },
        description: 'Make a low humming or "voo" sound to vibrate the vagus nerve and activate deep calm.',
        howToUse: [
            'Take a deep breath in',
            'Exhale while making a low "vooooo" or humming sound',
            'Feel the vibration in your chest and throat',
            'Continue for 1-3 minutes or until calm spreads'
        ],
        whenToUse: ['Anxiety', 'Before sleep', 'After conflict', 'When words are hard', 'Gut distress'],
        researchSources: [
            { author: 'Peter Levine', work: 'In an Unspoken Voice', quote: 'Vocalizations like humming directly stimulate vagal tone.' },
            { author: 'Stephen Porges', work: 'The Polyvagal Theory' }
        ],
        relatedStrategies: ['safe-song', 'physiological-sigh']
    },

    // ====== CO-REGULATION STRATEGIES ======
    {
        id: 'co-regulation-presence',
        title: 'Calm Presence',
        category: 'co-regulation',
        icon: '💜',
        color: 'bg-rose-500',
        lenses: ['polyvagal', 'epigenetic', 'spiritual'],
        nervousSystemEffect: {
            primarySystem: 'social_engagement',
            action: 'Offers a regulated nervous system for the child to "borrow"',
            bodyEffect: 'Mirror neurons and vagal social engagement activate reciprocal calm',
            tooltipEducation: 'Children cannot regulate alone — they need to "borrow" a calm nervous system from a regulated adult. Your calm presence literally teaches their brain how to calm itself. Eckhart Tolle calls this "presence" — being fully here without reactivity.'
        },
        description: 'Stay calm and present so your child can borrow your regulated nervous system state.',
        howToUse: [
            'Take slow, visible breaths (let them see and hear you breathe)',
            'Speak in a calm, low tone — not whisper, but grounded',
            'Offer quiet physical presence without demands',
            'Wait patiently without rushing to "fix"'
        ],
        whenToUse: ['During any dysregulation', 'Meltdowns', 'Tantrums', 'Fear responses', 'After overwhelming events'],
        researchSources: [
            { author: 'Bruce Perry', work: 'What Happened to You?', quote: 'Regulation is relational. Children learn to regulate through the presence of regulated adults.' },
            { author: 'Eckhart Tolle', work: 'The Power of Now', quote: 'Your presence is the greatest gift you can give.' },
            { author: 'Stephen Porges', work: 'The Polyvagal Theory' }
        ],
        relatedStrategies: ['co-regulation-prosody', 'deep-pressure']
    },
    {
        id: 'co-regulation-prosody',
        title: 'Soothing Voice',
        category: 'co-regulation',
        icon: '🗣️',
        color: 'bg-violet-500',
        lenses: ['polyvagal', 'epigenetic'],
        nervousSystemEffect: {
            primarySystem: 'social_engagement',
            action: 'Melodic voice activates middle ear muscles connected to vagus',
            bodyEffect: 'Signals safety through auditory neuroception',
            tooltipEducation: 'Stephen Porges discovered that the tone of voice matters more than words. A melodic, prosodic voice (like singing or gentle talking) signals safety to the child\'s nervous system through the auditory pathway connected to the vagus nerve.'
        },
        description: 'Use a warm, melodic tone of voice to signal safety to the child\'s nervous system.',
        howToUse: [
            'Lower your pitch slightly — deep tones signal safety',
            'Add melody to your voice (like talking to an infant)',
            'Speak slowly with pauses',
            'Avoid flat, command-like tones during distress'
        ],
        whenToUse: ['During dysregulation', 'Before requests', 'At bedtime', 'When reconnecting after rupture'],
        researchSources: [
            { author: 'Stephen Porges', work: 'The Polyvagal Theory', quote: 'The melodic contours of voice activate the social engagement system and signal safety.' }
        ],
        relatedStrategies: ['co-regulation-presence', 'safe-song']
    },

    // ====== SOMATIC STRATEGIES ======
    {
        id: 'grounding-5-4-3-2-1',
        title: '5-4-3-2-1 Grounding',
        category: 'somatic',
        icon: '🦶',
        color: 'bg-emerald-500',
        lenses: ['somatic', 'polyvagal', 'spiritual'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Redirects attention from internal chaos to external present moment',
            bodyEffect: 'Activates prefrontal cortex, down-regulates amygdala',
            tooltipEducation: 'Grounding exercises shift attention from the internal alarm (amygdala) to the present moment through the senses. This activates the prefrontal cortex and naturally calms the threat response. Eckhart Tolle teaches this as returning to "the Now."'
        },
        description: 'Use the five senses to anchor into the present moment and reduce overwhelm.',
        howToUse: [
            '5: Name 5 things you can SEE',
            '4: Name 4 things you can TOUCH',
            '3: Name 3 things you can HEAR',
            '2: Name 2 things you can SMELL',
            '1: Name 1 thing you can TASTE'
        ],
        whenToUse: ['Dissociation', 'Panic', 'Flashbacks', 'Feeling "not in body"', 'Overwhelming emotions'],
        researchSources: [
            { author: 'Bessel van der Kolk', work: 'The Body Keeps the Score' },
            { author: 'Eckhart Tolle', work: 'The Power of Now', quote: 'The present moment is the only place where life happens.' }
        ],
        relatedStrategies: ['body-scan', 'cold-water']
    },
    {
        id: 'cold-water',
        title: 'Cold Water Reset',
        category: 'somatic',
        icon: '💧',
        color: 'bg-cyan-500',
        lenses: ['polyvagal', 'somatic'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Triggers the "dive reflex" which immediately calms the heart',
            bodyEffect: 'Slows heart rate by 10-25%, shifts out of panic',
            tooltipEducation: 'Cold water on the face triggers the mammalian "dive reflex" — an ancient survival mechanism that immediately slows the heart rate and shifts the nervous system out of panic. It\'s one of the fastest ways to interrupt an anxiety spiral.'
        },
        description: 'Apply cold water to the face to trigger the dive reflex and immediately calm the nervous system.',
        howToUse: [
            'Fill a bowl with cold water and ice',
            'Hold your breath and submerge your face for 10-30 seconds',
            'Or: splash cold water on face, especially around eyes and cheeks',
            'Or: hold a cold pack to the face'
        ],
        whenToUse: ['Panic attack', 'Rage surge', 'Can\'t calm down', 'Sensory overload at peak'],
        contraindications: ['Heart conditions (consult doctor)', 'Very young children (use gentle splash instead)'],
        researchSources: [
            { author: 'Stephen Porges', work: 'The Polyvagal Theory' },
            { author: 'Andrew Huberman', work: 'Huberman Lab Podcast' }
        ],
        relatedStrategies: ['physiological-sigh', 'grounding-5-4-3-2-1']
    },

    // ====== MINDFULNESS / SPIRITUAL STRATEGIES ======
    {
        id: 'witnessing-presence',
        title: 'Witnessing (Not Fixing)',
        category: 'mindfulness',
        icon: '👁️',
        color: 'bg-slate-500',
        lenses: ['spiritual', 'epigenetic', 'intergenerational'],
        nervousSystemEffect: {
            primarySystem: 'social_engagement',
            action: 'Offers unconditional acceptance which signals deep safety',
            bodyEffect: 'Reduces shame-based cortisol, allows authentic expression',
            tooltipEducation: 'Eckhart Tolle teaches that the deepest gift we can give is our witness — being present without judgment or the need to fix. This communicates unconditional acceptance, which is profoundly regulating. Mark Wolynn notes this heals intergenerational wounds of being "too much."'
        },
        description: 'Be fully present with the child\'s experience without trying to fix, change, or rush it.',
        howToUse: [
            'Silently witness the emotion without interpretation',
            'Resist the urge to explain, distract, or solve',
            'Let them feel felt — your presence is enough',
            'Trust that emotions have a beginning, middle, and end'
        ],
        whenToUse: ['Grief', 'Big emotions', 'After trauma', 'When words fail', 'Processing difficult experiences'],
        researchSources: [
            { author: 'Eckhart Tolle', work: 'The Power of Now', quote: 'Presence is the greatest gift you can give.' },
            { author: 'Wayne Dyer', work: 'The Power of Intention', quote: 'When you change the way you look at things, the things you look at change.' },
            { author: 'Mark Wolynn', work: 'It Didn\'t Start with You', quote: 'What we don\'t repair, we repeat.' }
        ],
        relatedStrategies: ['co-regulation-presence', 'acceptance-surrender']
    },
    {
        id: 'acceptance-surrender',
        title: 'Acceptance & Surrender',
        category: 'mindfulness',
        icon: '🙏',
        color: 'bg-amber-600',
        lenses: ['spiritual', 'somatic', 'intergenerational'],
        nervousSystemEffect: {
            primarySystem: 'parasympathetic',
            action: 'Releases resistance which perpetuates stress chemistry',
            bodyEffect: 'Reduces cortisol, relaxes muscle tension, opens breath',
            tooltipEducation: 'Gary Zukav teaches that suffering comes from resistance. When we accept "what is" — not approval, but acknowledgment — the nervous system stops fighting and can find peace. Wayne Dyer called this "letting go and letting God."'
        },
        description: 'Release the need to control the moment and accept what is arising without resistance.',
        howToUse: [
            'Notice where you\'re gripping or resisting in your body',
            'Breathe into that place and whisper "I accept this moment"',
            'Let go of the timeline — healing has its own pace',
            'Trust that this too shall pass'
        ],
        whenToUse: ['Feeling stuck', 'Control battles', 'Chronic stress', 'Grief', 'When effort isn\'t working'],
        researchSources: [
            { author: 'Gary Zukav', work: 'The Seat of the Soul', quote: 'Authentic power is the alignment of your personality with your soul.' },
            { author: 'Wayne Dyer', work: 'Wishes Fulfilled', quote: 'Let go and let God.' },
            { author: 'Eckhart Tolle', work: 'A New Earth', quote: 'Whatever you accept completely will take you to peace.' }
        ],
        relatedStrategies: ['witnessing-presence', 'grounding-5-4-3-2-1']
    }
];

// ========================================================================
// HELPER FUNCTIONS
// ========================================================================

export const getStrategyById = (id: string): EnhancedStrategy | undefined => 
    STRATEGIES.find(s => s.id === id);

export const getStrategiesByLens = (lens: TherapeuticLens): EnhancedStrategy[] =>
    STRATEGIES.filter(s => s.lenses.includes(lens));

export const getStrategiesByCategory = (category: StrategyCategory): EnhancedStrategy[] =>
    STRATEGIES.filter(s => s.category === category);

export const getRelatedStrategies = (strategy: EnhancedStrategy): EnhancedStrategy[] =>
    (strategy.relatedStrategies || [])
        .map(id => getStrategyById(id))
        .filter((s): s is EnhancedStrategy => s !== undefined);

export const getNervousSystemIcon = (system: NervousSystemBranch): string => {
    switch (system) {
        case 'parasympathetic': return '⬇️'; // Calming
        case 'sympathetic': return '⬆️'; // Activating
        case 'social_engagement': return '💜'; // Connection
    }
};

export const getNervousSystemLabel = (system: NervousSystemBranch): string => {
    switch (system) {
        case 'parasympathetic': return 'Calming';
        case 'sympathetic': return 'Activating';
        case 'social_engagement': return 'Connecting';
    }
};
