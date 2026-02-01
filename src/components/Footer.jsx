import React from 'react';
import Section from './Section';


export default function Footer() {
  return (
    <footer className="py-8 text-center text-gray-500 bg-transparent border-t border-white/10">
      <p>© {new Date().getFullYear()} Hoang Bao Phuoc. All rights reserved.</p>
    </footer>
  );
}
