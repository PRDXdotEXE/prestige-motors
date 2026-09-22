import React, { useState, useEffect } from 'react';
import { Car, Menu, X, Shield, Phone, ChevronRight } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, vehicleId?: string) => void;
  isAdminLoggedIn: boolean;
  onOpenAdmin: () => void;
  onOpenTestDrive?: () => void;
  onOpenInquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminLoggedIn,
  onOpenAdmin,
  onOpenTestDrive,
  onOpenInquiry
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'inventory', label: 'Inventory' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const handleNavClick = (viewId: string) => {
    onNavigate(viewId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0D12]/95 backdrop-blur-md border-b border-white/10 shadow-2xl py-3.5'
          : 'bg-gradient-to-b from-[#0B0D12]/90 to-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Dealership Brand Logo */}
          <button
            id="nav-brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-sm bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform">
              <Car className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                  PRESTIGE
                </span>
                <span className="font-heading font-light text-xl tracking-wider text-red-500">
                  MOTORS
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-medium -mt-1">
                Luxury & Exotic Showcase
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = currentView === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-sm font-medium tracking-wide transition-colors relative py-1 ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {/* Showroom Phone */}
            <a
              id="nav-call-link"
              href="tel:18005550198"
              className="flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors px-3 py-1.5 rounded bg-white/5 border border-white/10"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>(800) 555-0198</span>
            </a>

            {/* Admin Access Button */}
            <button
              id="nav-admin-toggle-btn"
              onClick={onOpenAdmin}
              title={isAdminLoggedIn ? 'Admin Portal Active' : 'Staff Login'}
              className={`p-2 rounded text-xs transition-colors border ${
                isAdminLoggedIn
                  ? 'bg-red-950/60 border-red-700 text-red-300 hover:bg-red-900/80'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* View Inventory Primary CTA */}
            <button
              id="nav-cta-inventory-btn"
              onClick={() => handleNavClick('inventory')}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white text-sm font-semibold tracking-wide rounded-sm shadow-lg shadow-red-600/25 transition-all duration-200 hover:-translate-y-0.5"
            >
              <span>View Inventory</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              id="mobile-admin-btn"
              onClick={onOpenAdmin}
              className="p-2 text-slate-400 hover:text-white"
            >
              <Shield className="w-5 h-5" />
            </button>
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden bg-[#0F1219] border-b border-white/10 px-4 pt-4 pb-6 mt-3 animate-in slide-in-from-top-4 duration-200"
        >
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <button
                key={link.id}
                id={`mobile-nav-${link.id}`}
                onClick={() => handleNavClick(link.id)}
                className={`text-left px-3 py-3 rounded text-base font-medium transition-colors ${
                  currentView === link.id
                    ? 'bg-red-600/10 text-red-500 font-semibold border-l-2 border-red-600'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-white/10 mt-2 flex flex-col gap-3">
              <a
                href="tel:18005550198"
                className="flex items-center gap-2 text-sm text-slate-300 px-3 py-2 rounded bg-white/5"
              >
                <Phone className="w-4 h-4 text-red-500" />
                <span>Call Concierge: (800) 555-0198</span>
              </a>

              <button
                onClick={() => handleNavClick('inventory')}
                className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-center rounded-sm shadow-lg shadow-red-600/30"
              >
                Browse Available Vehicles
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
