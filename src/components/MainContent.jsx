import React from 'react';
import About from './About';
import Skills from './Skills';
import Activities from './Activities';
import Projects from './Projects';
import Awards from './Awards';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';

export default function MainContent() {
  return (
    <>
      <div className="pt-20"> {/* Add padding for fixed header */}
        <About />
        <Skills />
        <Activities />
        <Projects />
        <Awards />
        <Footer />
        <ScrollToTop />
      </div>
    </>
  );
}
