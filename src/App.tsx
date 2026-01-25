import { useState, useEffect } from 'react';
import { Layout } from './design/molecules/Layout';
import { useAuthStore } from './core/stores/useAuthStore';
import { LoginScreen } from './core/auth/LoginScreen';
import { getProfile } from './core/firebase/profiles';
import type { UserProfile } from './core/stores/profileTypes';

// Import Core Components
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { SOSPulse } from './components/SOSPulse';
import { InstallPrompt } from './components/InstallPrompt';
import { FeedbackButton } from './components/FeedbackButton';
import { PageTransition } from './components/PageTransition';
import { DevWorkstation } from './components/DevWorkstation';
import { trackEvent, setAnalyticsUser, initAnalytics, Events } from './lib/analytics';

// Import Features
import { Dashboard } from './features/sanctuary/Dashboard';
import { Capture } from './features/capture/Capture';
import { Village } from './features/village/Village';
import { Oracle } from './features/oracle/Oracle';
import { Journey } from './features/journey/Journey';
import { ObservationsTimeline } from './features/observations/ObservationsTimeline';
import { Skills } from './features/skills/Skills';
import { MemoryInsights } from './features/memory/MemoryInsights';
import { ProgressDashboard } from './features/progress/ProgressDashboard';
import { TherapySessionPrep } from './features/therapy/TherapySessionPrep';
import { WellnessHub } from './features/wellness/WellnessHub';
import { PracticeHub } from './features/practice/PracticeHub';

// Import Profile & Vault Components
import { DigitalPassport } from './features/profile/DigitalPassport';
import { InstitutionalVault } from './features/profile/InstitutionalVault';
import { RecognitionRite } from './features/auth/RecognitionRite';
import { ProfessionalDashboard } from './features/village/ProfessionalDashboard';
import { AboutEli } from './features/about/AboutEli';
import { UsageDashboard } from './features/admin/UsageDashboard';
import { ExportCenter } from './features/capture/ExportCenter';
import { VisionAgent } from './features/capture/VisionAgent';
import { PatternDashboard } from './features/analytics/PatternDashboard';
import { SkillTracker } from './features/skills/SkillTracker';
import { StrategyLibrary } from './features/resources/StrategyLibrary';
import { TheoryHub } from './features/resources/TheoryHub';
import { LegacyCenter } from './features/legacy/LegacyCenter';
import { WellnessHub } from './features/wellness/WellnessHub';
import { CommunityHub } from './features/community/CommunityHub';
import { RespiteCenter } from './features/community/RespiteCenter';

function AppContent() {
  const { user, loading } = useAuthStore();
  const [currentView, setCurrentView] = useState('Sanctuary');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Load user profile
  useEffect(() => {
    if (!user) {
      setProfileLoading(false);
      return;
    }

    const loadProfile = async () => {
      try {
        const p = await getProfile(user.uid);
        setProfile(p);

        // Show onboarding if profile incomplete
        if (!p || !p.onboardingComplete) {
          setShowOnboarding(true);
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  // Initialize analytics and track user
  useEffect(() => {
    initAnalytics();
    if (user) {
      setAnalyticsUser(user.uid);
    }
  }, [user]);

  // Track view changes
  useEffect(() => {
    const eventMap: Record<string, string> = {
      'Sanctuary': Events.VIEW_DASHBOARD,
      'Oracle': Events.VIEW_ORACLE,
      'Capture': Events.VIEW_CAPTURE,
      'Village': Events.VIEW_VILLAGE,
      'Journey': Events.VIEW_JOURNEY,
    };
    const event = eventMap[currentView];
    if (event) {
      trackEvent(event);
    }
  }, [currentView]);

  // Show login screen if not authenticated
  if (!user && !loading) {
    return (
      <>
        <LoginScreen />
        <SOSPulse />
      </>
    );
  }

  // Show loading while checking profile
  if (loading || profileLoading) {
    return <LoadingSkeleton fullScreen message="Entering the Sanctuary..." />;
  }

  // Show onboarding if needed
  if (showOnboarding) {
    return (
      <>
        <RecognitionRite
          onComplete={() => {
            setShowOnboarding(false);
            setCurrentView('Sanctuary');
          }}
        />
        <DevWorkstation
          currentView="Onboarding"
          onNavigate={(view) => {
            setShowOnboarding(false);
            setCurrentView(view);
          }}
          onSkipOnboarding={() => setShowOnboarding(false)}
        />
      </>
    );
  }

  const renderView = () => {
    let content;
    switch (currentView) {
      // Main Navigation
      case 'Sanctuary': content = <Dashboard onNavigate={setCurrentView} />; break;
      case 'Village': content = <Village onNavigate={setCurrentView} />; break;
      case 'Capture': content = <Capture onNavigate={setCurrentView} />; break;
      case 'Oracle': content = <Oracle />; break;
      case 'Journey': content = <ObservationsTimeline onNavigate={setCurrentView} />; break;
      case 'Strategies': content = <Journey />; break;
      case 'Skills': content = <Skills onNavigate={setCurrentView} />; break;
      case 'Memory': content = <MemoryInsights onNavigate={setCurrentView} />; break;
      case 'Progress': content = <ProgressDashboard onNavigate={setCurrentView} />; break;
      case 'Therapy': content = <TherapySessionPrep onNavigate={setCurrentView} />; break;
      case 'Wellness': content = <WellnessHub onNavigate={setCurrentView} />; break;
      case 'Practice': content = <PracticeHub onNavigate={setCurrentView} />; break;

      // Profile & Vault Routes
      case 'Passport': content = <DigitalPassport />; break;
      case 'Vault': content = <InstitutionalVault />; break;
      case 'Onboarding': content = (
        <RecognitionRite onComplete={() => setCurrentView('Sanctuary')} />
      ); break;

      // Professional Routes
      case 'ProfessionalDashboard': content = (
        <ProfessionalDashboard
          careTeamId="team-1"
          practitionerName={profile?.parent?.title || 'Caregiver'}
          childName={profile?.childName || 'Child'}
        />
      ); break;

      // About / Story Route
      case 'About': content = <AboutEli />; break;

      // Admin Route
      case 'AdminDashboard': content = <UsageDashboard onBack={() => setCurrentView('Sanctuary')} />; break;

      // Export Center Route
      case 'ExportCenter': content = <ExportCenter onBack={() => setCurrentView('Capture')} />; break;

      // Vision Agent (Video Capture) Route
      case 'VisionAgent': content = <VisionAgent />; break;

      // Pattern Dashboard Route
      case 'PatternDashboard': content = <PatternDashboard onBack={() => setCurrentView('Sanctuary')} />; break;

      // Wave 3: Skills & Education Routes
      case 'SkillTracker': content = <SkillTracker onBack={() => setCurrentView('Sanctuary')} />; break;
      case 'StrategyLibrary': content = <StrategyLibrary onBack={() => setCurrentView('Sanctuary')} />; break;
      case 'TheoryHub': content = <TheoryHub onBack={() => setCurrentView('Sanctuary')} />; break;

      // Wave 4: Lifetime Continuity Routes
      case 'LegacyCenter': content = <LegacyCenter onBack={() => setCurrentView('Sanctuary')} />; break;

      // Wave 5: Wellness & Community Routes
      case 'WellnessHub': content = <WellnessHub onBack={() => setCurrentView('Sanctuary')} />; break;
      case 'CommunityHub': content = <CommunityHub onBack={() => setCurrentView('Sanctuary')} />; break;
      case 'RespiteCenter': content = <RespiteCenter onBack={() => setCurrentView('Sanctuary')} />; break;

      default: content = <Dashboard onNavigate={setCurrentView} />;
    }

    return (
      <PageTransition key={currentView}>
        {content}
      </PageTransition>
    );
  };

  // Hide bottom nav for certain views
  const hideNav = ['Passport', 'Vault', 'Onboarding', 'ProfessionalDashboard', 'About', 'AdminDashboard', 'ExportCenter', 'VisionAgent'].includes(currentView);

  if (hideNav) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('Sanctuary')}
          className="fixed top-6 right-6 z-50 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md font-semibold text-sm flex items-center gap-2"
          style={{ color: 'var(--text-primary)' }}
        >
          ← Back
        </button>
        {renderView()}
      </div>
    );
  }

  return (
    <Layout currentTab={currentView} onTabChange={setCurrentView}>
      {renderView()}
      <DevWorkstation
        currentView={currentView}
        onNavigate={setCurrentView}
        onSkipOnboarding={() => setShowOnboarding(false)}
      />
    </Layout>
  );
}

// Wrap entire app with ErrorBoundary for graceful crash handling
function App() {
  return (
    <ErrorBoundary>
      <AppContent />
      <InstallPrompt />
      <FeedbackButton />
    </ErrorBoundary>
  );
}

export default App;
