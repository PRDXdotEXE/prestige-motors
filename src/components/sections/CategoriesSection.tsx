import React from 'react';
import { ArrowUpRight } from 'lucide-react';

interface CategoriesSectionProps {
  onSelectCategory: (category: string) => void;
}

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({ onSelectCategory }) => {
  const categories = [
    {
      id: 'Coupe',
      name: 'Sports Cars & Coupes',
      count: '4 in stock',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1000&q=80',
      description: 'Track-bred dynamics, flat-six & V8 power plants'
    },
    {
      id: 'SUV',
      name: 'Luxury & Performance SUVs',
      count: '3 in stock',
      image: 'https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1000&q=80',
      description: 'Uncompromising prestige, AWD capability, and handcrafted cabins'
    },
    {
      id: 'Sedan',
      name: 'Executive & Grand Touring Sedans',
      count: '2 in stock',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
      description: 'Long-wheelbase poise with high-output twin-turbo power'
    },
    {
      id: 'Electric',
      name: 'Electric & Hyper-Hybrids',
      count: '2 in stock',
      image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1000&q=80',
      description: 'Instantaneous torque and 800V next-generation architecture'
    },
    {
      id: 'Convertible',
      name: 'Open-Air Roadsters & Spiders',
      count: '2 in stock',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
      description: 'Pure acoustic symphonies and wind-in-hair freedom'
    },
    {
      id: 'Truck',
      name: 'All-Terrain & Desert Runners',
      count: '1 in stock',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
      description: 'FOX Live-Valve suspension, 37" rubber, heavy armor'
    }
  ];

  return (
    <section id="categories-section" className="py-20 bg-[#07090E] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-2">
              Curated Profiles
            </span>
            <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
              Explore by Vehicle Category
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-sm mt-3 md:mt-0">
            Tailor your search by powertrain, chassis profile, or driving philosophy.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="group relative h-64 rounded-sm overflow-hidden border border-white/10 hover:border-red-600/50 cursor-pointer transition-all duration-300 shadow-xl"
            >
              {/* Background Image */}
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />

              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-85 group-hover:opacity-75 transition-opacity" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-red-400 border border-white/10">
                    {cat.count}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-red-600 text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-heading font-bold text-white group-hover:text-red-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                    {cat.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
