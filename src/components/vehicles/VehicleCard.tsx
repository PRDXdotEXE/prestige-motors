import React from 'react';
import { Vehicle } from '../../types';
import { Gauge, Fuel, Cog, MapPin, Sparkles, ChevronRight, Calendar } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onSelect: (vehicleId: string) => void;
  onScheduleTestDrive?: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  onSelect,
  onScheduleTestDrive
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatMileage = (miles: number) => {
    return new Intl.NumberFormat('en-US').format(miles) + ' mi';
  };

  const getStatusBadge = (status: Vehicle['status']) => {
    switch (status) {
      case 'AVAILABLE':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Available
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 backdrop-blur-md">
            Pending Sale
          </span>
        );
      case 'SOLD':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold uppercase tracking-wider bg-slate-800 text-slate-400 border border-slate-700">
            Sold
          </span>
        );
    }
  };

  return (
    <article
      id={`vehicle-card-${vehicle.id}`}
      className="group bg-[#12151D] border border-white/10 hover:border-white/20 rounded-sm overflow-hidden flex flex-col transition-all duration-300 hover:shadow-2xl hover:shadow-black/60 hover:-translate-y-1"
    >
      {/* Vehicle Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 cursor-pointer" onClick={() => onSelect(vehicle.id)}>
        <img
          src={vehicle.images[0] || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80'}
          alt={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Gradient shadow for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12151D] via-transparent to-black/30 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-2">
            {getStatusBadge(vehicle.status)}
            {vehicle.featured && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-semibold bg-red-600 text-white shadow-md shadow-red-900/40">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>
          <span className="text-xs font-medium px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
            {vehicle.bodyType}
          </span>
        </div>

        {/* Location badge on bottom right of image */}
        <div className="absolute bottom-2.5 right-3 flex items-center gap-1 text-[11px] text-slate-300 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          <MapPin className="w-3 h-3 text-red-500" />
          <span>{vehicle.location.split(' ')[0]}</span>
        </div>
      </div>

      {/* Vehicle Info */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Year & Make & Model */}
          <div className="text-xs font-semibold text-red-500 uppercase tracking-wider mb-1">
            {vehicle.year} &bull; {vehicle.make}
          </div>
          <h3
            onClick={() => onSelect(vehicle.id)}
            className="text-lg font-heading font-bold text-white group-hover:text-red-400 transition-colors cursor-pointer line-clamp-1"
            title={`${vehicle.year} ${vehicle.make} ${vehicle.model}`}
          >
            {vehicle.model}
          </h3>

          {/* Engine Spec Note */}
          <p className="text-xs text-slate-400 mt-1 line-clamp-1">
            {vehicle.engine}
          </p>

          {/* Specs Grid */}
          <div className="grid grid-cols-3 gap-2 py-3.5 my-3.5 border-y border-white/5 text-xs text-slate-300">
            <div className="flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{formatMileage(vehicle.mileage)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cog className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{vehicle.transmission}</span>
            </div>
          </div>
        </div>

        {/* Price & Action Row */}
        <div>
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <span className="text-[11px] text-slate-400 block uppercase tracking-wider">
                Price
              </span>
              <span className="text-2xl font-heading font-extrabold text-white tracking-tight">
                {formatPrice(vehicle.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Est. Payment</span>
              <span className="text-xs font-medium text-slate-300">
                ${Math.round(vehicle.price / 60)}/mo*
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              id={`vehicle-details-btn-${vehicle.id}`}
              onClick={() => onSelect(vehicle.id)}
              className="w-full py-2.5 px-3 bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-200 hover:text-white text-xs font-semibold rounded-sm border border-white/10 transition-colors flex items-center justify-center gap-1"
            >
              <span>View Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            <button
              id={`vehicle-testdrive-btn-${vehicle.id}`}
              onClick={() => onScheduleTestDrive && onScheduleTestDrive(vehicle)}
              disabled={vehicle.status === 'SOLD'}
              className={`w-full py-2.5 px-3 text-xs font-semibold rounded-sm transition-colors flex items-center justify-center gap-1 ${
                vehicle.status === 'SOLD'
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-700'
                  : 'bg-red-600/90 hover:bg-red-600 active:bg-red-700 text-white shadow-md shadow-red-900/30'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{vehicle.status === 'SOLD' ? 'Vehicle Sold' : 'Test Drive'}</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
