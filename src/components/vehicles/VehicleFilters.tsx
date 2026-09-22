import React from 'react';
import { FilterState } from '../../types';
import { Search, RotateCcw, SlidersHorizontal, Check } from 'lucide-react';

interface VehicleFiltersProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  availableMakes: string[];
  totalResultsCount: number;
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
}

export const defaultFilters: FilterState = {
  search: '',
  make: 'all',
  bodyType: 'all',
  fuelType: 'all',
  transmission: 'all',
  minPrice: 0,
  maxPrice: 350000,
  minYear: 2020,
  maxYear: 2025,
  maxMileage: 20000,
  status: 'all',
  sortBy: 'featured'
};

export const VehicleFilters: React.FC<VehicleFiltersProps> = ({
  filters,
  onChange,
  availableMakes,
  totalResultsCount,
  isMobileModal = false,
  onCloseMobileModal
}) => {
  const bodyTypes = ['all', 'Coupe', 'Sedan', 'SUV', 'Convertible', 'Truck', 'Wagon'];
  const fuelTypes = ['all', 'Gasoline', 'Electric', 'Hybrid'];
  const transmissions = ['all', 'Automatic', 'Dual-Clutch', 'Manual'];
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'AVAILABLE', label: 'Available Only' },
    { value: 'PENDING', label: 'Pending Sale' },
    { value: 'SOLD', label: 'Sold Archive' }
  ];

  const updateField = <K extends keyof FilterState>(field: K, value: FilterState[K]) => {
    onChange({
      ...filters,
      [field]: value
    });
  };

  const handleReset = () => {
    onChange({ ...defaultFilters });
  };

  const isFiltered =
    filters.search !== '' ||
    filters.make !== 'all' ||
    filters.bodyType !== 'all' ||
    filters.fuelType !== 'all' ||
    filters.transmission !== 'all' ||
    filters.status !== 'all' ||
    filters.maxPrice < 350000 ||
    filters.maxMileage < 20000;

  return (
    <div className={`space-y-6 ${isMobileModal ? 'p-2' : ''}`}>
      {/* Search Input Box */}
      <div>
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
          Search Inventory
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="filter-search-input"
            type="text"
            value={filters.search}
            onChange={(e) => updateField('search', e.target.value)}
            placeholder="Search make, model, VIN, engine..."
            className="w-full bg-[#12151D] border border-white/10 rounded-sm pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-colors"
          />
        </div>
      </div>

      {/* Header with Results Count & Reset Button */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-red-500" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-200">
            Filters ({totalResultsCount} found)
          </span>
        </div>
        {isFiltered && (
          <button
            id="filter-reset-btn"
            onClick={handleReset}
            className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Make Select */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Make / Manufacturer
        </label>
        <select
          id="filter-make-select"
          value={filters.make}
          onChange={(e) => updateField('make', e.target.value)}
          aria-label="Make / Manufacturer"
          className="w-full bg-[#12151D] border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
        >
          <option value="all">All Makes ({availableMakes.length})</option>
          {availableMakes.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {/* Body Type Pills */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Body Style
        </label>
        <div className="flex flex-wrap gap-1.5">
          {bodyTypes.map((type) => {
            const isSelected = filters.bodyType.toLowerCase() === type.toLowerCase();
            return (
              <button
                key={type}
                type="button"
                onClick={() => updateField('bodyType', type)}
                className={`text-xs px-2.5 py-1.5 rounded-sm transition-colors border ${
                  isSelected
                    ? 'bg-red-600 border-red-500 text-white font-semibold'
                    : 'bg-[#12151D] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {type === 'all' ? 'All' : type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Slider */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <label htmlFor="filter-price-slider" className="font-medium">Max Price</label>
          <span className="font-mono text-red-400 font-semibold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(filters.maxPrice)}
          </span>
        </div>
        <input
          id="filter-price-slider"
          type="range"
          min="50000"
          max="350000"
          step="5000"
          value={filters.maxPrice}
          onChange={(e) => updateField('maxPrice', Number(e.target.value))}
          aria-label="Max Price"
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>$50k</span>
          <span>$200k</span>
          <span>$350k+</span>
        </div>
      </div>

      {/* Maximum Mileage Slider */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-300 mb-2">
          <label htmlFor="filter-mileage-slider" className="font-medium">Max Mileage</label>
          <span className="font-mono text-slate-200">
            {new Intl.NumberFormat('en-US').format(filters.maxMileage)} miles
          </span>
        </div>
        <input
          id="filter-mileage-slider"
          type="range"
          min="1000"
          max="20000"
          step="500"
          value={filters.maxMileage}
          onChange={(e) => updateField('maxMileage', Number(e.target.value))}
          aria-label="Max Mileage"
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-600"
        />
        <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
          <span>1,000 mi</span>
          <span>10,000 mi</span>
          <span>20,000 mi</span>
        </div>
      </div>

      {/* Fuel Type */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Powertrain
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {fuelTypes.map((fuel) => {
            const isSelected = filters.fuelType.toLowerCase() === fuel.toLowerCase();
            return (
              <button
                key={fuel}
                type="button"
                onClick={() => updateField('fuelType', fuel)}
                className={`text-xs px-2 py-1.5 rounded-sm transition-colors border text-left flex items-center justify-between ${
                  isSelected
                    ? 'bg-red-600/20 border-red-600 text-white font-semibold'
                    : 'bg-[#12151D] border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <span>{fuel === 'all' ? 'All Powertrains' : fuel}</span>
                {isSelected && <Check className="w-3 h-3 text-red-500" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Transmission */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Transmission
        </label>
        <select
          id="filter-transmission-select"
          value={filters.transmission}
          onChange={(e) => updateField('transmission', e.target.value)}
          aria-label="Transmission"
          className="w-full bg-[#12151D] border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
        >
          {transmissions.map((t) => (
            <option key={t} value={t}>
              {t === 'all' ? 'All Transmissions' : t}
            </option>
          ))}
        </select>
      </div>

      {/* Availability Status */}
      <div>
        <label className="text-xs font-medium text-slate-300 block mb-2">
          Availability Status
        </label>
        <select
          id="filter-status-select"
          value={filters.status}
          onChange={(e) => updateField('status', e.target.value)}
          aria-label="Availability Status"
          className="w-full bg-[#12151D] border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
        >
          {statuses.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Mobile Drawer Close Button */}
      {isMobileModal && (
        <div className="pt-4 border-t border-white/10">
          <button
            onClick={onCloseMobileModal}
            className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-sm text-center"
          >
            Show {totalResultsCount} Results
          </button>
        </div>
      )}
    </div>
  );
};
