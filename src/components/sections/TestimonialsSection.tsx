import React from 'react';
import { Star, ShieldCheck, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Jonathan Vance',
      role: 'Private Equity Principal, Newport Beach',
      car: 'Acquired 2024 Porsche 911 GT3 Touring',
      review: 'Flawless acquisition from start to finish. The vehicle condition exceeded even high-resolution photographs. Enclosed delivery arrived at my home within 48 hours with full PPF and factory documentation neatly bound.',
      rating: 5,
      avatar: 'JV'
    },
    {
      name: 'Dr. Alistair Sterling',
      role: 'Cardiologist & Collector, Scottsdale',
      car: 'Acquired 2023 Audi RS6 Avant Dynamic Plus',
      review: 'I had been hunting for an unblemished Nardo Gray RS6 Avant for six months. Prestige Motors had the exact spec. Pricing was completely transparent with zero dealer add-ons or surprises. Truly white-glove.',
      rating: 5,
      avatar: 'AS'
    },
    {
      name: 'Elena Rostova',
      role: 'Design Director, Beverly Hills',
      car: 'Acquired 2023 Mercedes-AMG G 63',
      review: 'Handled my out-of-state trade-in flawlessly. The concierge accommodated my hectic schedule with an evening private showing and delivered the car freshly detailed with a full tank. Remarkable professionalism.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-[#07090D] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-2">
            Client Voices
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            Trusted by Connoisseurs & Drivers
          </h2>
          <p className="text-sm text-slate-400 mt-3">
            Read verified feedback from owners who acquired their high-performance and luxury vehicles through our showroom.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-[#12151D] border border-white/10 p-6 sm:p-7 rounded-sm flex flex-col justify-between relative hover:border-white/20 transition-all duration-300 hover:shadow-xl"
            >
              <div>
                {/* Rating stars & Quote Icon */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-white/10" />
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic mb-6">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center font-bold text-xs shrink-0">
                  {t.avatar}
                </div>
                <div>
                  <h4 className="font-heading font-bold text-white text-sm">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{t.role}</p>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-400 mt-0.5">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{t.car}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
