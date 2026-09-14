import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { Personas } from './components/Personas.tsx';
import { MidpageCTA } from './components/MidpageCTA.tsx';
import { WhyUs } from './components/WhyUs.tsx';
import { Takeaways } from './components/Takeaways.tsx';
import { LogisticsStrip } from './components/LogisticsStrip.tsx';
import { LaunchProgress } from './components/LaunchProgress.tsx';
import { WaitlistForm } from './components/WaitlistForm.tsx';
import { ConfirmationView } from './components/ConfirmationView.tsx';
import { AdminView } from './components/AdminView.tsx';
import { AdminLoginModal } from './components/AdminLoginModal.tsx';
import { Footer } from './components/Footer.tsx';
import { WaitlistSignup, WaitlistStats } from './types.ts';
import {
  fetchWaitlistSignups,
  calculateStats,
  adminVerify,
} from './services/waitlistService.ts';
import { INITIAL_SIGNUPS } from './data/initialSignups.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'confirmation' | 'admin'>('landing');
  const [signups, setSignups] = useState<WaitlistSignup[]>(INITIAL_SIGNUPS);
  const [stats, setStats] = useState<WaitlistStats>(calculateStats(INITIAL_SIGNUPS));
  const [recentSignup, setRecentSignup] = useState<WaitlistSignup | null>(null);
  const [recentPosition, setRecentPosition] = useState<number>(INITIAL_SIGNUPS.length);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const { signups: fetchedSignups, stats: fetchedStats } = await fetchWaitlistSignups();
      setSignups(fetchedSignups);
      setStats(fetchedStats);
    } catch (e) {
      console.error('Error fetching waitlist:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const isAuth = await adminVerify();
      setIsAdminAuthenticated(isAuth);
      await loadData();

      if (window.location.hash === '#admin') {
        if (isAuth) {
          setCurrentView('admin');
        } else {
          setShowLoginModal(true);
        }
      }
    };

    init();

    const handleHashChange = async () => {
      if (window.location.hash === '#admin') {
        const isAuth = await adminVerify();
        setIsAdminAuthenticated(isAuth);
        if (isAuth) {
          setCurrentView('admin');
        } else {
          setShowLoginModal(true);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = async (view: 'landing' | 'admin') => {
    if (view === 'admin') {
      const isAuth = await adminVerify();
      setIsAdminAuthenticated(isAuth);
      if (isAuth) {
        setCurrentView('admin');
        window.location.hash = '#admin';
        window.scrollTo({ top: 0, behavior: 'smooth' });
        loadData();
      } else {
        setShowLoginModal(true);
      }
    } else {
      setCurrentView('landing');
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLoginSuccess = async () => {
    setIsAdminAuthenticated(true);
    setShowLoginModal(false);
    setCurrentView('admin');
    window.location.hash = '#admin';
    await loadData();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginCancel = () => {
    setShowLoginModal(false);
    if (currentView === 'admin') {
      setCurrentView('landing');
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  const scrollToWaitlist = () => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      if (window.location.hash === '#admin') {
        window.history.replaceState(null, '', window.location.pathname);
      }
      setTimeout(() => {
        const formEl = document.getElementById('waitlist');
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const formEl = document.getElementById('waitlist');
      if (formEl) {
        formEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSignupSuccess = (signup: WaitlistSignup, position: number) => {
    setRecentSignup(signup);
    setRecentPosition(position);
    setCurrentView('confirmation');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-[#00AECC]/20 selection:text-[#00AECC]">
      {/* Sticky Top Navigation */}
      <Navbar
        stats={stats}
        currentView={currentView}
        onNavigate={handleNavigate}
        onJoinClick={scrollToWaitlist}
      />

      {/* Main Views */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <>
            <Hero stats={stats} onJoinClick={scrollToWaitlist} />
            <LogisticsStrip />
            <Personas onJoinClick={scrollToWaitlist} />
            <MidpageCTA onJoinClick={scrollToWaitlist} />
            <WhyUs onJoinClick={scrollToWaitlist} />
            <Takeaways />
            <LaunchProgress stats={stats} onJoinClick={scrollToWaitlist} />
            <WaitlistForm
              onSuccess={handleSignupSuccess}
              onRefreshStats={loadData}
            />
          </>
        )}

        {currentView === 'confirmation' && recentSignup && (
          <ConfirmationView
            signup={recentSignup}
            position={recentPosition}
            stats={stats}
            onBackToLanding={() => {
              setCurrentView('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentView === 'admin' && isAdminAuthenticated && (
          <AdminView
            signups={signups}
            stats={stats}
            onRefresh={loadData}
            onBackToLanding={() => {
              setCurrentView('landing');
              window.history.replaceState(null, '', window.location.pathname);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onAdminClick={() => {
          handleNavigate('admin');
        }}
      />

      {/* Admin Authentication Modal */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onSuccess={handleLoginSuccess}
        onCancel={handleLoginCancel}
      />
    </div>
  );
}
