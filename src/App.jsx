import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import MainContent from './components/MainContent';
import Login from './components/Login';
import CursorSpotlight from './components/CursorSpotlight';
import PageTransition from './components/PageTransition';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
            <PageTransition>
                <Hero />
            </PageTransition>
        } />
        <Route path="/portfolio" element={
            <PageTransition>
                <MainContent />
            </PageTransition>
        } />
        <Route path="/secret" element={
            <PageTransition>
                <Login />
            </PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  );
}

import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen text-slate-100 font-raleway">
        <CursorSpotlight />
        
        {/* Fixed Background - Global */}
        <div className="fixed inset-0 z-[-1]">
          <img 
            src="/assets/Background.png" 
            alt="Background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>

        <Header />
        
        <AnimatedRoutes />
        <ScrollToTopButton />
      </div>
    </Router>
  );
}

export default App;
