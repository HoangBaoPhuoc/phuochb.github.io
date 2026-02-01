import React, { useState, useEffect } from 'react';
import { Menu, X, Lock } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const NavLink = ({ href, name, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`font-gilroy text-lg font-medium transition-all duration-500 px-4 py-2 rounded-lg border border-transparent 
      ${active ? 'text-blue-400' : 'text-gray-300 hover:text-white'}
      hover:bg-white/10 hover:shadow-lg hover:border-white/10
    `}
  >
    {name}
  </button>
);

export default function Header({ simpleMode = false }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      
      if (location.pathname === '/') {
          setActiveSection('home');
          return;
      }

      // Update active section only if we are on the portfolio page
      if (location.pathname === '/portfolio') {
        const sections = ['about', 'skills', 'activities', 'projects', 'awards'];
        
        let currentSection = '';
        const viewportMiddle = window.innerHeight / 3;

        for (const section of sections) {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                // If the top of the section is above the middle of the viewport
                // AND the bottom is below the header (visible), it's a candidate.
                // We pick the LAST one that satisfies "top <= middle" (meaning we scrolled past its start)
                if (rect.top <= viewportMiddle) {
                    currentSection = section;
                }
            }
        }

        if (currentSection) {
            setActiveSection(currentSection);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Trigger once on mount/location change
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  const handleNavClick = (href) => {
    const targetId = href.substring(1);

    // Special case for Home - always go to landing page
    if (href === '#home') {
        setActiveSection('home'); // Instant feedback
        if (location.pathname !== '/') {
            navigate('/');
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setIsMenuOpen(false);
        return;
    }

    // Set active section immediately for feedback
    setActiveSection(targetId);

    // For other links, ensure we are on portfolio page
    if (location.pathname !== '/portfolio') {
        navigate('/portfolio');
        // Small delay to allow navigation before scrolling
        setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else {
        // We are already on portfolio, just scroll
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Activities', href: '#activities' },
    { name: 'Projects', href: '#projects' },
    { name: 'Awards', href: '#awards' },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
        isScrolled ? 'py-4 backdrop-blur-md bg-black/50' : 'py-5 bg-transparent'
      }`}
    >
      <div className="w-full px-6 md:px-12 flex items-center justify-between gap-12">
        
        {/* Logo */}
        <div 
            onClick={() => handleNavClick('#home')}
            className="text-2xl font-bold font-gilroy cursor-pointer bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-200 hover:opacity-80 transition-opacity"
        >
            phuochb
        </div>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink 
              key={item.name} 
              {...item} 
              active={activeSection === item.href.substring(1)}
              onClick={() => handleNavClick(item.href)}
            />
          ))}
          
          <button 
             onClick={() => navigate('/secret')}
             className="ml-6 p-2 rounded-full hover:bg-white/10 transition-all duration-500 text-gray-400 hover:text-white"
             title="Secret Feature (Locked)"
          >
             <Lock size={20} />
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-white ml-auto"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-t border-white/10 p-6 flex flex-col gap-6 md:hidden shadow-2xl">
            {navItems.map((item) => (
               <button 
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-lg font-gilroy text-gray-300 hover:text-white text-left px-4 py-2 hover:bg-white/10 rounded-lg transition-all duration-300"
              >
                {item.name}
              </button>
            ))}
             <div 
                onClick={() => { navigate('/secret'); setIsMenuOpen(false); }}
                className="px-4 py-2 text-gray-400 flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
             >
                <Lock size={16} /> Secret (Locked)
             </div>
          </div>
        )}
      </div>
    </header>
  );
}
