import React, { useState } from 'react';
import { Shield, ArrowRight, ExternalLink, Menu, X, Users, Sparkles } from 'lucide-react';
import { WaitlistStats } from '../types.ts';

interface NavbarProps {
  stats: WaitlistStats;
  currentView: 'landing' | 'confirmation' | 'admin';
  onNavigate: (view: 'landing' | 'admin') => void;
  onJoinClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  currentView,
  onNavigate,
  onJoinClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleCtaClick = () => {
    setMobileMenuOpen(false);
    onJoinClick();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between min-h-[64px] sm:min-h-[72px]">
        {/* Brand Logo & Identifier */}
        <button
          id="nav-logo-btn"
          onClick={() => {
            onNavigate('landing');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-3 text-left group focus:outline-none shrink-0"
        >
          <img
            src="/assets/mosaic-logo.png"
            alt="Mosaic Data Solutions"
            className="h-10 sm:h-11 md:h-12 w-auto object-contain transition-transform group-hover:scale-[1.02]"
          />
          <div className="hidden 2xl:flex flex-col border-l border-slate-200 pl-3.5 justify-center">
            <span
              className="text-[11px] font-bold uppercase tracking-widest text-[#00AECC] whitespace-nowrap"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              The Accidental AI Champion
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        {currentView === 'landing' && (
          <nav className="hidden lg:flex items-center gap-5 xl:gap-8 text-sm font-medium text-slate-600">
            <a
              href="#who-its-for"
              className="hover:text-[#00AECC] transition-colors py-1 whitespace-nowrap"
            >
              Who It's For
            </a>
            <a
              href="#why-us"
              className="hover:text-[#00AECC] transition-colors py-1 whitespace-nowrap"
            >
              Why Us
            </a>
            <a
              href="#outcomes"
              className="hover:text-[#00AECC] transition-colors py-1 whitespace-nowrap"
            >
              What You'll Learn
            </a>
            <a
              href="#logistics"
              className="hover:text-[#00AECC] transition-colors py-1 whitespace-nowrap"
            >
              Logistics
            </a>
          </nav>
        )}

        {/* Right Side Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Admin Switch */}
          <button
            id="nav-admin-toggle-btn"
            onClick={() => {
              onNavigate(currentView === 'admin' ? 'landing' : 'admin');
              setMobileMenuOpen(false);
            }}
            className={`px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              currentView === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#00AECC]" />
            <span className="hidden sm:inline">
              {currentView === 'admin' ? 'Back to Site' : 'Admin Portal'}
            </span>
            <span className="sm:hidden">
              {currentView === 'admin' ? 'Site' : 'Admin'}
            </span>
          </button>

          {/* Primary CTA (Landing View) */}
          {currentView === 'landing' && (
            <button
              id="nav-cta-waitlist-btn"
              onClick={handleCtaClick}
              className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-white bg-[#00AECC] hover:bg-[#0099b3] active:scale-[0.98] rounded-xl shadow-md shadow-[#00AECC]/20 transition-all whitespace-nowrap"
            >
              <span>Reserve Your Seat</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {currentView !== 'landing' && (
            <button
              id="nav-back-to-landing-btn"
              onClick={() => {
                onNavigate('landing');
                setMobileMenuOpen(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            >
              <span>Landing Page</span>
            </button>
          )}

          {/* Mobile Menu Toggle (Landing View) */}
          {currentView === 'landing' && (
            <button
              id="nav-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-800" />
              ) : (
                <Menu className="w-5 h-5 text-slate-800" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}
      {currentView === 'landing' && mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-6 py-5 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3.5 text-base font-medium text-slate-700">
            <a
              href="#who-its-for"
              onClick={handleNavClick}
              className="hover:text-[#00AECC] py-1 border-b border-slate-100 transition-colors"
            >
              Who It's For
            </a>
            <a
              href="#why-us"
              onClick={handleNavClick}
              className="hover:text-[#00AECC] py-1 border-b border-slate-100 transition-colors"
            >
              Why Listen to Us
            </a>
            <a
              href="#outcomes"
              onClick={handleNavClick}
              className="hover:text-[#00AECC] py-1 border-b border-slate-100 transition-colors"
            >
              What You'll Learn
            </a>
            <a
              href="#logistics"
              onClick={handleNavClick}
              className="hover:text-[#00AECC] py-1 border-b border-slate-100 transition-colors"
            >
              Logistics &amp; Location
            </a>
            <a
              href="#progress"
              onClick={handleNavClick}
              className="flex items-center justify-between py-2 px-3 bg-cyan-50/50 rounded-lg text-sm text-slate-800"
            >
              <span className="font-semibold text-slate-900">Seats Reserving Now</span>
              <span className="font-bold text-[#00AECC] bg-white px-2 py-0.5 rounded border border-cyan-100">
                {stats.totalCount}/40 Reserved
              </span>
            </a>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={handleCtaClick}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-[#00AECC] hover:bg-[#0099b3] shadow-md shadow-[#00AECC]/20 transition-all"
              >
                <span>Reserve Your Seat</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://www.mosaic-data.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 py-2 text-xs font-semibold text-slate-500 hover:text-[#00AECC]"
              >
                <span>Visit mosaic-data.com</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

