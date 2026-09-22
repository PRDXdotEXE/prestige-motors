import React, { useState } from 'react';
import { Search, ChevronRight, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import { FilterState } from '../../types';

interface HeroSectionProps {
  onExploreVehicles: () => void;
  onContactUs: () => void;
  onQuickFilter: (filters: Partial<FilterState>) => void;
  availableMakes: string[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreVehicles,
  onContactUs,
  onQuickFilter,
  availableMakes
}) => {
  const [make, setMake] = useState('all');
  const [bodyType, setBodyType] = useState('all');
  const [maxPrice, setMaxPrice] = useState('350000');
  const [keyword, setKeyword] = useState('');

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickFilter({
      make: make,
      bodyType: bodyType,
      maxPrice: Number(maxPrice),
      search: keyword
    });
    onExploreVehicles();
  };

  return (
    <section id="hero-section" className="relative min-h-[92vh] flex items-center justify-center pt-24 pb-16 overflow-hidden">
      {/* Background Automotive Image & Cinematic Gradient Overlays */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=2400&q=85"
          alt="Exotic Supercar in Showroom"
          className="w-full h-full object-cover object-center scale-105 animate-pulse duration-[10000ms]"
        />
        {/* Layered cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0D12] via-[#0B0D12]/80 to-[#0B0D12]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D12] via-transparent to-[#0B0D12]/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl space-y-6">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/60 border border-red-800/60 backdrop-blur-md text-red-300 text-xs font-semibold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-red-400" />
            <span>Exotic, Luxury & High-Performance Vault</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-extrabold text-white tracking-tight leading-[1.08]">
            Find the Car That <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-red-500">
              Fits Your Drive.
            </span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
            Explore our collection of carefully selected vehicles and find your next car with confidence. Every automobile undergoes a rigorous 180-point mechanical inspection.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="hero-explore-cta"
              onClick={onExploreVehicles}
              className="px-8 py-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-sm tracking-wider uppercase rounded-sm shadow-xl shadow-red-600/30 transition-all duration-200 hover:-translate-y-0.5 flex items-center gap-3"
            >
              <span>Explore Vehicles</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              id="hero-contact-cta"
              onClick={onContactUs}
              className="px-7 py-4 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white font-semibold text-sm tracking-wider uppercase rounded-sm border border-white/20 backdrop-blur-md transition-all flex items-center gap-2"
            >
              <span>Contact Us</span>
              <ArrowRight className="w-4 h-4 opacity-70" />
            </button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>180-Point Certified Inspection</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Enclosed Nationwide Transport</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Transparent No-Haggle Pricing</span>
            </div>
          </div>
        </div>

        {/* Quick Search & Filter Component Docked Beneath Hero */}
        <div className="mt-12 max-w-5xl bg-[#12151E]/95 backdrop-blur-xl border border-white/15 rounded-sm p-4 sm:p-5 shadow-2xl shadow-black/80">
          <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 items-end">
            {/* Make */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Manufacturer
              </label>
              <select
                value={make}
                onChange={(e) => setMake(e.target.value)}
                aria-label="Quick Filter Manufacturer"
                className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="all">All Makes</option>
                {availableMakes.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Body Style */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Body Style
              </label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
                aria-label="Quick Filter Body Style"
                className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="all">All Styles</option>
                <option value="Coupe">Coupe</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Convertible">Convertible</option>
                <option value="Truck">Truck</option>
                <option value="Wagon">Wagon</option>
              </select>
            </div>

            {/* Max Budget */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Max Budget
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                aria-label="Quick Filter Max Budget"
                className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-xs text-white focus:outline-none focus:border-red-500 cursor-pointer"
              >
                <option value="350000">Any Price</option>
                <option value="120000">Under $120,000</option>
                <option value="160000">Under $160,000</option>
                <option value="200000">Under $200,000</option>
                <option value="250000">Under $250,000</option>
              </select>
            </div>

            {/* Keyword / Model */}
            <div>
              <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block mb-1.5">
                Model or Keyword
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="e.g. GT3, V8, Turbo..."
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-sm pl-3 pr-3 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            {/* Search Button */}
            <div>
              <button
                type="submit"
                id="hero-quick-search-btn"
                className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-md shadow-red-900/40 transition-colors flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search Stock</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
