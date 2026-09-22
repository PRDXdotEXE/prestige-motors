import React from 'react';
import { ShieldCheck, CircleDollarSign, Wrench, CreditCard, Sparkles } from 'lucide-react';

export const WhyChooseUsSection: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: 'Carefully Selected Vehicles',
      desc: 'Only the top 3% of candidates meet our standard. Every vehicle undergoes a forensic 180-point mechanical and structural certification before entering our showroom.'
    },
    {
      icon: CircleDollarSign,
      title: 'Transparent Pricing',
      desc: 'No hidden administrative markups, forced accessory packages, or games. Real-time market analytics ensure verified fair market acquisition values.'
    },
    {
      icon: CreditCard,
      title: 'Bespoke Luxury Financing',
      desc: 'Tailored leasing portfolios, private banking partnerships, and balloon options crafted specifically for high-line and exotic asset management.'
    },
    {
      icon: Wrench,
      title: 'Dedicated Client Support',
      desc: 'White-glove nationwide enclosed transport, door-to-door registration assistance, and lifetime vehicle provenance tracking for your collection.'
    }
  ];

  return (
    <section id="why-choose-us" className="py-20 bg-[#0B0D12] border-t border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Prestige Difference</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Why Discerning Drivers Choose Us
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md mt-3 md:mt-0 leading-relaxed">
            We operate on uncompromising standards of integrity, vehicle provenance, and bespoke automotive concierge service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="bg-[#12151D] border border-white/10 hover:border-white/20 p-6 rounded-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/50 group"
              >
                <div className="w-12 h-12 rounded-sm bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-500 mb-5 group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-white text-lg mb-2">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
