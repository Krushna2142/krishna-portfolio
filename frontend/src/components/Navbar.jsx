import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Skills', path: '/skills' },
    { name: 'Services', path: '/services' },
    { name: 'Projects', path: '/projects' },
    { name: 'Contact', path: '/contact' },
  ];

  const Logo = () => (
    <svg width="40" height="40" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#667eea', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#764ba2', stopOpacity:1}} />
        </linearGradient>
        
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor:'#ffffff', stopOpacity:1}} />
          <stop offset="100%" style={{stopColor:'#e0e7ff', stopOpacity:1}} />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge> 
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      <circle cx="60" cy="60" r="55" fill="url(#bgGradient)" stroke="rgba(255,255,255,0.1)" strokeWidth="2"/>
      
      <polygon points="25,35 35,25 45,35 35,45" fill="rgba(255,255,255,0.1)" opacity="0.6"/>
      <polygon points="75,35 85,25 95,35 85,45" fill="rgba(255,255,255,0.1)" opacity="0.6"/>
      <polygon points="25,85 35,75 45,85 35,95" fill="rgba(255,255,255,0.1)" opacity="0.6"/>
      <polygon points="75,85 85,75 95,85 85,95" fill="rgba(255,255,255,0.1)" opacity="0.6"/>
      
      <path d="M20 60 L35 60 L35 45 M85 45 L85 60 L100 60 M35 75 L35 60 M85 60 L85 75" 
            stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" fill="none"/>
      
      <g filter="url(#glow)">
        <path d="M35 40 L35 80 M35 55 L50 40 M35 60 L52 80" 
              stroke="url(#textGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      
      <g filter="url(#glow)">
        <path d="M68 40 L68 80 M68 40 L78 40 C82 40 85 43 85 47 L85 53 C85 57 82 60 78 60 L68 60" 
              stroke="url(#textGradient)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </g>
      
      <circle cx="30" cy="30" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="90" cy="30" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="30" cy="90" r="1.5" fill="rgba(255,255,255,0.4)"/>
      <circle cx="90" cy="90" r="1.5" fill="rgba(255,255,255,0.4)"/>
    </svg>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        <div className="flex items-center space-x-3">
          <Logo />
          <div className="text-2xl font-bold text-indigo-600">Krushna Pokharkar</div>
        </div>

        <div className="hidden md:flex space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`hover:text-indigo-500 transition-colors duration-300 ${
                location.pathname === item.path ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className="h-6 w-6 text-gray-800 dark:text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav Links */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`block text-base ${
                location.pathname === item.path ? 'text-indigo-600 font-semibold' : ''
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
};

export default Navbar;