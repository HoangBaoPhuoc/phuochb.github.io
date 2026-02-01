import React from 'react';
import ScrollReveal from './ScrollReveal';

export default function Section({ children, id, className = '' }) {
  return (
    <section id={id} className={`py-20 px-6 md:px-12 lg:px-20 max-w-screen-2xl mx-auto overflow-hidden ${className}`}>
        {/* We wrap the whole section content in a "reveal up" by default, 
            but for the specific effect of "sides and up", we should probably 
            let individual components use ScrollReveal, or wrap children here.
            
            Let's animate the main container UP, but specific parts can override this
            if we refactor them. For now, we apply a global slow rise.
        */}
      <ScrollReveal direction="up">
        {children}
      </ScrollReveal>
    </section>
  );
}
