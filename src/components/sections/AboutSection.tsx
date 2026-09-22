import React from 'react';
import { Award, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

interface AboutSectionProps {
  onLearnMore?: () => void;
  onExploreStock?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onLearnMore, onExploreStock }) => {
  return (
    <section id="about-dealership" className="py-24 bg-[#0B0D12] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Image Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85"
                alt="Prestige Motors Private Showroom Vault"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            </div>

            {/* Overlapping Badge */}
            <div className="absolute -bottom-6 -right-4 sm:right-6 bg-[#161922] border border-white/15 p-5 rounded-sm shadow-2xl max-w-xs backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-sm bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">Over 15 Years of Excellence</h4>
                  <p className="text-[11px] text-slate-400">Serving collectors & enthusiasts globally</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest">
              <span>Dealership Philosophy</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Driven by Quality. <br />
              <span className="text-slate-400 font-normal">Defined by Provenance.</span>
            </h2>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              At Prestige Motors, we believe purchasing an automobile should feel as thrilling and elevated as driving it. Founded on a deep reverence for engineering purity, our showrooms in Beverly Hills, Newport Beach, and Scottsdale curate only vehicle specimens with unimpeachable histories, low mileage, and factory pedigree.
            </p>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-sm">Forensic Selection Process</h4>
                  <p className="text-xs text-slate-400">Every car passes paint-meter depth readings, computer diagnostic ECU health logs, and road tests by certified master technicians.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-600/20 text-red-400 flex items-center justify-center shrink-0 mt-0.5">
                  <HeartHandshake className="w-3.5 h-3.5" />
                </div>
                <div>
                  <h4 className="font-heading font-semibold text-white text-sm">Relationship-Centered Ownership</h4>
                  <p className="text-xs text-slate-400">From trade-in evaluations to title transfer and private transport, your dedicated client advisor handles every detail seamlessly.</p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center gap-4">
              {onExploreStock && (
                <button
                  onClick={onExploreStock}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-md transition-colors flex items-center gap-2"
                >
                  <span>View Our Vehicles</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {onLearnMore && (
                <button
                  onClick={onLearnMore}
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-semibold text-xs tracking-wider uppercase rounded-sm border border-white/10 transition-colors"
                >
                  Learn More About Us
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
