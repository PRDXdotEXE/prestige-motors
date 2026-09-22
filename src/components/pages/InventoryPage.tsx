import React, { useState } from 'react';
import { Vehicle, FilterState } from '../../types';
import { VehicleCard } from '../vehicles/VehicleCard';
import { VehicleFilters, defaultFilters } from '../vehicles/VehicleFilters';
import { SlidersHorizontal, ArrowUpDown, X, Car, RotateCcw } from 'lucide-react';

interface InventoryPageProps {
  vehicles: Vehicle[];
  loading: boolean;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onSelectVehicle: (vehicleId: string) => void;
  onScheduleTestDrive: (vehicle: Vehicle) => void;
  availableMakes: string[];
}

export const InventoryPage: React.FC<InventoryPageProps> = ({
  vehicles,
  loading,
  filters,
  onFilterChange,
  onSelectVehicle,
  onScheduleTestDrive,
  availableMakes
}) => {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeFiltersCount = [
    filters.search !== '',
    filters.make !== 'all',
    filters.bodyType !== 'all',
    filters.fuelType !== 'all',
    filters.transmission !== 'all',
    filters.status !== 'all',
    filters.maxPrice < 350000,
    filters.maxMileage < 20000
  ].filter(Boolean).length;

  return (
    <div id="inventory-page" className="min-h-screen pt-28 pb-20 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-white/10 gap-4">
          <div>
            <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-1">
              Current Showroom Collection
            </span>
            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
              Vehicle Inventory
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              Showing {vehicles.length} meticulously curated high-performance, exotic & luxury automobiles.
            </p>
          </div>

          {/* Sort Controls & Mobile Filter Trigger */}
          <div className="flex items-center gap-3">
            {/* Mobile Filter Button */}
            <button
              id="mobile-filter-open-btn"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-[#12151E] border border-white/10 rounded-sm text-xs font-semibold text-white"
            >
              <SlidersHorizontal className="w-4 h-4 text-red-500" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-red-600 text-[10px] text-white flex items-center justify-center font-bold">
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 bg-[#12151E] border border-white/10 rounded-sm px-3 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <label htmlFor="inventory-sort-select" className="text-xs text-slate-400">Sort:</label>
              <select
                id="inventory-sort-select"
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                aria-label="Sort inventory"
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer pr-2 font-medium"
              >
                <option value="featured" className="bg-[#12151E]">Featured First</option>
                <option value="price-asc" className="bg-[#12151E]">Price: Low to High</option>
                <option value="price-desc" className="bg-[#12151E]">Price: High to Low</option>
                <option value="year-desc" className="bg-[#12151E]">Newest Model Year</option>
                <option value="year-asc" className="bg-[#12151E]">Oldest Model Year</option>
                <option value="mileage-asc" className="bg-[#12151E]">Lowest Mileage</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-4">
            <span className="text-xs text-slate-400">Active Filters:</span>
            {filters.make !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-200">
                <span>Make: {filters.make}</span>
                <button onClick={() => onFilterChange({ ...filters, make: 'all' })}><X className="w-3 h-3 hover:text-red-400" /></button>
              </span>
            )}
            {filters.bodyType !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-200">
                <span>Style: {filters.bodyType}</span>
                <button onClick={() => onFilterChange({ ...filters, bodyType: 'all' })}><X className="w-3 h-3 hover:text-red-400" /></button>
              </span>
            )}
            {filters.fuelType !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-200">
                <span>Fuel: {filters.fuelType}</span>
                <button onClick={() => onFilterChange({ ...filters, fuelType: 'all' })}><X className="w-3 h-3 hover:text-red-400" /></button>
              </span>
            )}
            {filters.status !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-200">
                <span>Status: {filters.status}</span>
                <button onClick={() => onFilterChange({ ...filters, status: 'all' })}><X className="w-3 h-3 hover:text-red-400" /></button>
              </span>
            )}
            {filters.maxPrice < 350000 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-white/5 border border-white/10 text-xs text-slate-200">
                <span>Under ${Math.round(filters.maxPrice / 1000)}k</span>
                <button onClick={() => onFilterChange({ ...filters, maxPrice: 350000 })}><X className="w-3 h-3 hover:text-red-400" /></button>
              </span>
            )}
            <button
              onClick={() => onFilterChange({ ...defaultFilters })}
              className="text-xs text-red-400 hover:text-red-300 underline underline-offset-2 ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-28 bg-[#0F121A] border border-white/10 rounded-sm p-5 shadow-xl">
            <VehicleFilters
              filters={filters}
              onChange={onFilterChange}
              availableMakes={availableMakes}
              totalResultsCount={vehicles.length}
            />
          </aside>

          {/* Vehicle Grid Area */}
          <main className="lg:col-span-9">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-[#12151D] border border-white/5 rounded-sm p-4 animate-pulse space-y-4">
                    <div className="aspect-[16/10] bg-slate-800 rounded" />
                    <div className="h-4 bg-slate-800 rounded w-2/3" />
                    <div className="h-3 bg-slate-800 rounded w-1/2" />
                    <div className="h-8 bg-slate-800 rounded" />
                  </div>
                ))}
              </div>
            ) : vehicles.length === 0 ? (
              /* Empty State */
              <div className="bg-[#12151D] border border-white/10 rounded-sm p-12 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-red-600/10 text-red-500 border border-red-500/20 flex items-center justify-center mx-auto">
                  <Car className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white">
                  No Vehicles Match Your Current Filters
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
                  We could not find any vehicle matching the selected make, budget, or body style. Try broadening your criteria or reset all filters.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onFilterChange({ ...defaultFilters })}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm transition-colors inline-flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset All Filters</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Vehicles Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {vehicles.map((v) => (
                  <VehicleCard
                    key={v.id}
                    vehicle={v}
                    onSelect={onSelectVehicle}
                    onScheduleTestDrive={onScheduleTestDrive}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm lg:hidden flex justify-end"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-[#0F121A] h-full p-5 overflow-y-auto border-l border-white/10 animate-in slide-in-from-right duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <h3 className="font-heading font-bold text-white text-base">Filter Vehicles</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <VehicleFilters
              filters={filters}
              onChange={onFilterChange}
              availableMakes={availableMakes}
              totalResultsCount={vehicles.length}
              isMobileModal={true}
              onCloseMobileModal={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};
