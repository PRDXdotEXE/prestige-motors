import React from 'react';
import { Car, Phone, Mail, MapPin, Clock, ArrowUpRight, Shield } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
  onFilterCategory?: (category: string) => void;
  onOpenAdmin: () => void;
  onOpenTestDrive?: () => void;
  onOpenInquiry?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onFilterCategory,
  onOpenAdmin,
  onOpenTestDrive,
  onOpenInquiry
}) => {
  return (
    <footer id="main-footer" className="bg-[#07090D] border-t border-white/10 text-slate-400">
      {/* Top CTA Banner in Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center text-white shadow-md shadow-red-900/40">
                <Car className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-heading font-extrabold text-xl tracking-wider text-white">
                  PRESTIGE
                </span>
                <span className="font-heading font-light text-xl tracking-wider text-red-500">
                  MOTORS
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Southern California and Scottsdale&apos;s premier boutique automotive dealership. Curating rare, low-mileage sports cars, exotic supercars, luxury SUVs, and high-performance electric vehicles.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2.5 py-1 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Licensed Exotic Dealer #489201
              </span>
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-white transition-colors underline decoration-dotted"
              >
                <Shield className="w-3 h-3" />
                Staff Portal
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('inventory')}
                  className="hover:text-white transition-colors flex items-center gap-1"
                >
                  <span>Complete Inventory</span>
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Our Heritage & Vault
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Directions
                </button>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Collections
            </h4>
            <ul className="space-y-2.5 text-sm">
              {['Coupe', 'Sedan', 'SUV', 'Convertible', 'Truck', 'Wagon'].map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => {
                      if (onFilterCategory) onFilterCategory(cat);
                      onNavigate('inventory');
                    }}
                    className="hover:text-white transition-colors text-slate-400"
                  >
                    {cat}s
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Showroom & Hours */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">
              Flagship Gallery
            </h4>

            <div className="flex items-start gap-2.5 text-sm">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>9600 Wilshire Boulevard<br />Beverly Hills, CA 90212</span>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <a href="tel:18005550198" className="hover:text-white transition-colors">
                (800) 555-0198
              </a>
            </div>

            <div className="flex items-center gap-2.5 text-sm">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <a href="mailto:concierge@prestigemotors.com" className="hover:text-white transition-colors">
                concierge@prestigemotors.com
              </a>
            </div>

            <div className="pt-2 text-xs text-slate-400 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-slate-300 mb-1">
                <Clock className="w-3.5 h-3.5 text-red-500" />
                <span className="font-medium">Hours of Operation</span>
              </div>
              <p>Mon - Sat: 9:00 AM – 7:00 PM</p>
              <p>Sunday: 11:00 AM – 5:00 PM (By Appointment)</p>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Prestige Motors Gallery Inc. All rights reserved. Every vehicle inspected and certified.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-200">
              Privacy Policy
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-200">
              Terms of Sale
            </button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-200">
              Financing Disclosures
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
