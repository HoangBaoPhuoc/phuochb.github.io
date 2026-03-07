import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./auth/AuthContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import MainContent from "./components/MainContent";
import Login from "./components/Login";
import RestrictedPage from "./components/RestrictedPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CursorSpotlight from "./components/CursorSpotlight";
import PageTransition from "./components/PageTransition";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <Hero />
            </PageTransition>
          }
        />

        <Route
          path="/portfolio"
          element={
            <PageTransition>
              <MainContent />
            </PageTransition>
          }
        />
        <Route
          path="/secret"
          element={
            <PageTransition>
              <Login />
            </PageTransition>
          }
        />
        <Route
          path="/restricted"
          element={
            <PageTransition>
              <ProtectedRoute>
                <RestrictedPage />
              </ProtectedRoute>
            </PageTransition>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

import ScrollToTop from "./components/ScrollToTop";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { useState, useEffect } from "react";

function AppContent() {
  const location = useLocation();
  const isRestrictedPage = location.pathname === "/restricted";
  const backgroundImage = isRestrictedPage
    ? "/images/Background-2.jpg"
    : "/images/Background.png";

  const [loadedImages, setLoadedImages] = useState(new Set());

  // Preload restricted background on mount
  useEffect(() => {
    const restrictedBg = new Image();
    restrictedBg.src = "/images/Background-2.jpg";
    restrictedBg.onload = () => {
      setLoadedImages((prev) => new Set(prev).add("/images/Background-2.jpg"));
    };
  }, []);

  // Track current background loading
  useEffect(() => {
    const img = new Image();
    img.src = backgroundImage;
    img.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(backgroundImage));
    };
    img.onerror = () => {
      setLoadedImages((prev) => new Set(prev).add(backgroundImage));
    };
  }, [backgroundImage]);

  const bgLoaded = loadedImages.has(backgroundImage);

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen text-slate-100 font-raleway">
        {!isRestrictedPage && <CursorSpotlight />}

        {/* Fixed Background - Global */}
        <div className="fixed inset-0 z-[-1] bg-black">
          <img
            src={backgroundImage}
            alt="Background"
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              bgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        {!isRestrictedPage && <Header />}

        <AnimatedRoutes />
        <ScrollToTopButton />
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
