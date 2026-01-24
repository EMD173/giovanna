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

// Import Features
import { Dashboard } from './features/sanctuary/Dashboard';
import { Capture } from './features/capture/Capture';
import { Village } from './features/village/Village';
import { Oracle } from './features/oracle/Oracle';
import { Journey } from './features/journey/Journey';

// Import Profile & Vault Components
import { DigitalPassport } from './features/profile/DigitalPassport';
import { InstitutionalVault } from './features/profile/InstitutionalVault';
import { RecognitionRite } from './features/auth/RecognitionRite';
import { ProfessionalDashboard } from './features/village/ProfessionalDashboard';
import { AboutEli } from './features/about/AboutEli';

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
      <RecognitionRite
        onComplete={() => {
          setShowOnboarding(false);
          setCurrentView('Sanctuary');
        }}
      />
    );
  }

  const renderView = () => {
    switch (currentView) {
      // Main Navigation
      case 'Sanctuary': return <Dashboard onNavigate={setCurrentView} />;
      case 'Village': return <Village onNavigate={setCurrentView} />;
      case 'Capture': return <Capture />;
      case 'Oracle': return <Oracle />;
      case 'Journey': return <Journey />;

      // Profile & Vault Routes
      case 'Passport': return <DigitalPassport />;
      case 'Vault': return <InstitutionalVault />;
      case 'Onboarding': return (
        <RecognitionRite onComplete={() => setCurrentView('Sanctuary')} />
      );

      // Professional Routes
      case 'ProfessionalDashboard': return (
        <ProfessionalDashboard
          careTeamId="team-1"
          practitionerName={profile?.parent?.title || 'Caregiver'}
          childName={profile?.childName || 'Child'}
        />
      );

      // About / Story Route
      case 'About': return <AboutEli />;

      default: return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  // Hide bottom nav for certain views
  const hideNav = ['Passport', 'Vault', 'Onboarding', 'ProfessionalDashboard', 'About'].includes(currentView);

  if (hideNav) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: 'rgb(var(--glass-base))' }}>
        {/* Back Button */}
        <button
          onClick={() => setCurrentView('Sanctuary')}
          className="fixed top-6 left-6 z-50 px-4 py-2 rounded-full bg-white/40 backdrop-blur-md font-semibold text-sm flex items-center gap-2"
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
