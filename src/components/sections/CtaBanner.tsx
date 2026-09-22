import React from 'react';
import { ArrowRight, PhoneCall, ChevronRight } from 'lucide-react';

interface CtaBannerProps {
  onBrowseInventory: () => void;
  onTalkToUs: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onBrowseInventory, onTalkToUs }) => {
  return (
    <section id="cta-banner" className="py-20 bg-gradient-to-b from-[#0B0D12] to-[#07090D] relative overflow-hidden border-t border-white/5">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
        <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block">
          Your Next Chapter on the Road
        </span>

        <h2 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
          Ready for Your Next Drive?
        </h2>

        <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed">
          Whether you are looking to acquire a rare supercar, trade in your current vehicle, or schedule a private canyon test loop, our team is ready to assist.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onBrowseInventory}
            className="px-8 py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-xl shadow-red-600/30 transition-all flex items-center gap-2"
          >
            <span>Browse Inventory</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          <button
            onClick={onTalkToUs}
            className="px-8 py-3.5 bg-white/5 hover:bg-white/10 active:bg-white/15 text-white font-semibold text-xs tracking-wider uppercase rounded-sm border border-white/15 transition-all flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-red-500" />
            <span>Talk to Us</span>
          </button>
        </div>
      </div>
    </section>
  );
};
