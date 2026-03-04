import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ref, get, set } from 'firebase/database';
import { onAuthStateChanged } from 'firebase/auth';
import { database, auth } from './firebase';

import Navigation from './components/Navigation';
import Home from './pages/Home';
import Analytics from './pages/Analytics';
import Rehabilitation from './pages/Rehabilitation';
import History from './pages/History';
import Profile from './pages/Profile';
import Splash from './pages/Splash';
import Onboarding from './pages/Onboarding';

const PageWrapper = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
    className="pb-24 min-h-screen"
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = ({ hasProfile, onProfileUpdate }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {!hasProfile ? (
          <>
            <Route path="/onboarding" element={<Onboarding onComplete={onProfileUpdate} />} />
            <Route path="*" element={<Navigate to="/onboarding" replace />} />
          </>
        ) : (
          <>
            <Route path="/home" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/analytics" element={<PageWrapper><Analytics /></PageWrapper>} />
            <Route path="/rehab" element={<PageWrapper><Rehabilitation /></PageWrapper>} />
            <Route path="/history" element={<PageWrapper><History /></PageWrapper>} />
            <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
            <Route path="*" element={<Navigate to="/home" replace />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  const [appState, setAppState] = useState('splash');
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    if (appState !== 'checking') return;

    let cancelled = false;

    // 4-second safety timeout
    const timer = setTimeout(() => {
      if (!cancelled) {
        cancelled = true;
        setAppState('ready');
      }
    }, 4000);

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !cancelled) {
        get(ref(database, 'neurostep/profile'))
          .then((snapshot) => {
            if (!cancelled) {
              cancelled = true;
              clearTimeout(timer);
              setHasProfile(!!(snapshot.exists() && snapshot.val()?.name));
              setAppState('ready');
            }
          })
          .catch(() => {
            if (!cancelled) {
              cancelled = true;
              clearTimeout(timer);
              setAppState('ready');
            }
          });
      }
    });

    return () => { cancelled = true; clearTimeout(timer); unsubscribe(); };
  }, [appState]);

  const handleSplashComplete = () => setAppState('checking');

  const handleOnboardingComplete = (data) => {
    // IMMEDIATELY let user in
    setHasProfile(true);

    // Save to Firebase in background
    set(ref(database, 'neurostep/profile'), {
      ...data,
      device_id: 'NS-2026-' + Math.floor(Math.random() * 999),
      battery: '100',
      firmware: 'v2.1.4',
      doctor: 'Unassigned'
    }).catch(() => { });
  };

  if (appState === 'splash' || appState === 'checking') {
    return <Splash onComplete={handleSplashComplete} />;
  }

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-[#121212] text-slate-100 font-sans">
        <main className="flex-1 overflow-x-hidden">
          <AnimatedRoutes hasProfile={hasProfile} onProfileUpdate={handleOnboardingComplete} />
        </main>
        {hasProfile && <Navigation />}
      </div>
    </BrowserRouter>
  );
}

export default App;
