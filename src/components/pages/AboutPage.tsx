import React from 'react';
import { ShieldCheck, Award, MapPin, ArrowRight } from 'lucide-react';

interface AboutPageProps {
  onNavigateInventory: () => void;
  onNavigateContact: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigateInventory, onNavigateContact }) => {
  const locations = [
    {
      city: 'Beverly Hills Flagship',
      address: '9600 Wilshire Boulevard, Beverly Hills, CA 90212',
      phone: '(310) 555-0192',
      hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'Newport Beach Gallery',
      address: '3300 Coast Highway, Newport Beach, CA 92663',
      phone: '(949) 555-0184',
      hours: 'Mon-Sat: 9:00 AM - 6:30 PM',
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=800&q=80'
    },
    {
      city: 'Scottsdale Luxury Vault',
      address: '7100 E Greenway Parkway, Scottsdale, AZ 85254',
      phone: '(480) 555-0177',
      hours: 'Mon-Sat: 9:00 AM - 6:00 PM',
      image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div id="about-page" className="min-h-screen pt-28 pb-20 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Hero Banner */}
        <div className="relative rounded-sm overflow-hidden border border-white/10 p-8 sm:p-14 bg-gradient-to-r from-[#12151E] to-[#0A0C10]">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block">
              The Prestige Heritage
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Curating Automotive Masterpieces Since 2011.
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Founded by passionate drivers and collectors, Prestige Motors was created to redefine the exotic and luxury vehicle buying journey into an elevated, transparent, and exhilarating experience.
            </p>
            <div className="pt-2 flex items-center gap-4">
              <button
                onClick={onNavigateInventory}
                className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-lg transition-colors flex items-center gap-2"
              >
                <span>Explore The Vault</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onNavigateContact}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-semibold text-xs tracking-wider uppercase rounded-sm border border-white/10 transition-colors"
              >
                Schedule Private Viewing
              </button>
            </div>
          </div>
        </div>

        {/* Philosophy & Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#12151E] border border-white/10 p-7 rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-sm bg-red-600/20 text-red-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Forensic Inspection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every car on our showroom floor has survived a multi-point mechanical, electrical, and cosmetic audit including ultrasonic paint thickness checks and certified maintenance logs.
            </p>
          </div>

          <div className="bg-[#12151E] border border-white/10 p-7 rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-sm bg-red-600/20 text-red-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Provenance First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We specialize in low-mileage, clean Carfax, single-owner or collector-maintained examples with complete window stickers, manuals, and original factory keys.
            </p>
          </div>

          <div className="bg-[#12151E] border border-white/10 p-7 rounded-sm space-y-3">
            <div className="w-10 h-10 rounded-sm bg-red-600/20 text-red-500 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-white text-lg">Nationwide Enclosed Transport</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Whether your vehicle is headed to a garage in Manhattan or a collection in Miami, we arrange fully insured white-glove transport directly to your driveway.
            </p>
          </div>
        </div>

        {/* Showroom Galleries */}
        <div>
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-1">
              Physical Showrooms
            </span>
            <h2 className="text-3xl font-heading font-extrabold text-white">
              Visit Our Flagship Galleries
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map((loc, idx) => (
              <div key={idx} className="bg-[#12151E] border border-white/10 rounded-sm overflow-hidden flex flex-col">
                <div className="aspect-[16/10] overflow-hidden">
                  <img src={loc.image} alt={loc.city} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h3 className="font-heading font-bold text-white text-base">{loc.city}</h3>
                    <p className="text-xs text-slate-400 mt-1">{loc.address}</p>
                  </div>
                  <div className="pt-3 border-t border-white/5 text-xs text-slate-300 flex justify-between items-center">
                    <span>{loc.phone}</span>
                    <span className="text-[11px] text-red-400 font-medium">{loc.hours}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
