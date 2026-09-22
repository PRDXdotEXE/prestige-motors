import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/sections/HeroSection';
import { CategoriesSection } from './components/sections/CategoriesSection';
import { WhyChooseUsSection } from './components/sections/WhyChooseUsSection';
import { AboutSection } from './components/sections/AboutSection';
import { TestimonialsSection } from './components/sections/TestimonialsSection';
import { CtaBanner } from './components/sections/CtaBanner';
import { VehicleCard } from './components/vehicles/VehicleCard';
import { InventoryPage } from './components/pages/InventoryPage';
import { VehicleDetailPage } from './components/pages/VehicleDetailPage';
import { AboutPage } from './components/pages/AboutPage';
import { ContactPage } from './components/pages/ContactPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { InquiryModal } from './components/forms/InquiryModal';
import { TestDriveModal } from './components/forms/TestDriveModal';
import { defaultFilters } from './components/vehicles/VehicleFilters';
import { Vehicle, FilterState } from './types';
import { api } from './lib/api';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'inventory' | 'vehicle-detail' | 'about' | 'contact' | 'admin'>('home');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Vehicles and Filter State
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);

  // Modals
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquiryVehicle, setInquiryVehicle] = useState<Vehicle | null>(null);
  const [testDriveModalOpen, setTestDriveModalOpen] = useState(false);
  const [testDriveVehicle, setTestDriveVehicle] = useState<Vehicle | null>(null);

  // Admin Auth Token
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('prestige_admin_token') || null;
  });

  // Fetch Vehicles
  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await api.getVehicles();
      setVehicles(data);
    } catch (err) {
      console.error('Failed to fetch vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Sync with window.location.hash for routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (!hash || hash === 'home') {
        setCurrentPage('home');
        setSelectedVehicleId(null);
      } else if (hash === 'inventory') {
        setCurrentPage('inventory');
        setSelectedVehicleId(null);
      } else if (hash.startsWith('inventory/')) {
        const id = hash.replace('inventory/', '');
        setSelectedVehicleId(id);
        setCurrentPage('vehicle-detail');
      } else if (hash === 'about') {
        setCurrentPage('about');
        setSelectedVehicleId(null);
      } else if (hash === 'contact') {
        setCurrentPage('contact');
        setSelectedVehicleId(null);
      } else if (hash === 'admin') {
        setCurrentPage('admin');
        setSelectedVehicleId(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation Helper
  const navigateTo = (page: 'home' | 'inventory' | 'vehicle-detail' | 'about' | 'contact' | 'admin', vehicleId?: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'vehicle-detail' && vehicleId) {
      setSelectedVehicleId(vehicleId);
      window.location.hash = `inventory/${vehicleId}`;
    } else {
      setSelectedVehicleId(null);
      window.location.hash = page;
    }
    setCurrentPage(page);
  };

  // Distinct vehicle makes for filter dropdowns
  const availableMakes = useMemo(() => {
    const set = new Set(vehicles.map((v) => v.make));
    return Array.from(set).sort();
  }, [vehicles]);

  // Filtered vehicles for inventory page
  const filteredVehicles = useMemo(() => {
    let result = [...vehicles];

    // Search query
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (v) =>
          v.make.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.engine.toLowerCase().includes(q) ||
          v.exteriorColor.toLowerCase().includes(q) ||
          v.vin.toLowerCase().includes(q)
      );
    }

    // Make
    if (filters.make !== 'all') {
      result = result.filter((v) => v.make.toLowerCase() === filters.make.toLowerCase());
    }

    // Body Type
    if (filters.bodyType !== 'all') {
      result = result.filter((v) => v.bodyType === filters.bodyType);
    }

    // Fuel Type
    if (filters.fuelType !== 'all') {
      result = result.filter((v) => v.fuelType === filters.fuelType);
    }

    // Transmission
    if (filters.transmission !== 'all') {
      result = result.filter((v) => v.transmission === filters.transmission);
    }

    // Status
    if (filters.status !== 'all') {
      result = result.filter((v) => v.status === filters.status);
    }

    // Max Price
    if (filters.maxPrice < 350000) {
      result = result.filter((v) => v.price <= filters.maxPrice);
    }

    // Max Mileage
    if (filters.maxMileage < 20000) {
      result = result.filter((v) => v.mileage <= filters.maxMileage);
    }

    // Sort order
    switch (filters.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'year-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'mileage-asc':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'featured':
      default:
        result.sort((a, b) => {
          if (a.featured === b.featured) return b.year - a.year;
          return a.featured ? -1 : 1;
        });
        break;
    }

    return result;
  }, [vehicles, filters]);

  // Featured vehicles for homepage showcase
  const featuredVehicles = useMemo(() => {
    return vehicles.filter((v) => v.featured).slice(0, 4);
  }, [vehicles]);

  // Selected vehicle for details view
  const currentDetailVehicle = useMemo(() => {
    if (!selectedVehicleId) return null;
    return vehicles.find((v) => v.id === selectedVehicleId) || null;
  }, [vehicles, selectedVehicleId]);

  // Handle Quick Filter from Hero
  const handleQuickFilter = (heroFilters: Partial<FilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...heroFilters
    }));
  };

  // Handle Category Click from Homepage
  const handleCategoryClick = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      bodyType: category as any
    }));
    navigateTo('inventory');
  };

  // Handle Test Drive action
  const handleOpenTestDrive = (veh?: Vehicle | null) => {
    setTestDriveVehicle(veh || null);
    setTestDriveModalOpen(true);
  };

  // Handle Inquiry action
  const handleOpenInquiry = (veh?: Vehicle | null) => {
    setInquiryVehicle(veh || null);
    setInquiryModalOpen(true);
  };

  // Admin login success
  const handleAdminLoginSuccess = (token: string) => {
    setAdminToken(token);
    localStorage.setItem('prestige_admin_token', token);
  };

  // Admin logout
  const handleAdminLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('prestige_admin_token');
  };

  return (
    <div className="min-h-screen bg-[#0B0D12] text-slate-100 font-sans selection:bg-red-600 selection:text-white flex flex-col">
      {/* Top Main Navigation (Hidden on Admin screen for full workspace focus) */}
      {currentPage !== 'admin' && (
        <Navbar
          currentView={currentPage}
          onNavigate={(route) => navigateTo(route as any)}
          isAdminLoggedIn={Boolean(adminToken)}
          onOpenAdmin={() => navigateTo('admin')}
          onOpenTestDrive={() => handleOpenTestDrive(null)}
          onOpenInquiry={() => handleOpenInquiry(null)}
        />
      )}

      {/* Main Routed Content Views */}
      <main className="flex-1">
        {/* VIEW 1: HOMEPAGE */}
        {currentPage === 'home' && (
          <div className="animate-in fade-in duration-300">
            {/* Hero Section with Search bar */}
            <HeroSection
              onExploreVehicles={() => navigateTo('inventory')}
              onContactUs={() => navigateTo('contact')}
              onQuickFilter={handleQuickFilter}
              availableMakes={availableMakes}
            />

            {/* Featured Inventory Section */}
            <section id="featured-inventory" className="py-20 bg-[#0B0D12] border-t border-white/5">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
                  <div>
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Curated Selection</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                      Featured Vault Inventory
                    </h2>
                  </div>

                  <button
                    onClick={() => navigateTo('inventory')}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 mt-4 md:mt-0 group"
                  >
                    <span>View All {vehicles.length} Vehicles</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredVehicles.map((v) => (
                    <VehicleCard
                      key={v.id}
                      vehicle={v}
                      onSelect={(id) => navigateTo('vehicle-detail', id)}
                      onScheduleTestDrive={handleOpenTestDrive}
                    />
                  ))}
                </div>
              </div>
            </section>

            {/* Vehicle Categories Grid */}
            <CategoriesSection onSelectCategory={handleCategoryClick} />

            {/* Why Choose Us Pillars */}
            <WhyChooseUsSection />

            {/* About Dealership Philosophy */}
            <AboutSection
              onLearnMore={() => navigateTo('about')}
              onExploreStock={() => navigateTo('inventory')}
            />

            {/* Client Testimonials */}
            <TestimonialsSection />

            {/* Call to Action Banner */}
            <CtaBanner
              onBrowseInventory={() => navigateTo('inventory')}
              onTalkToUs={() => navigateTo('contact')}
            />
          </div>
        )}

        {/* VIEW 2: COMPLETE INVENTORY PAGE */}
        {currentPage === 'inventory' && (
          <InventoryPage
            vehicles={filteredVehicles}
            loading={loading}
            filters={filters}
            onFilterChange={setFilters}
            onSelectVehicle={(id) => navigateTo('vehicle-detail', id)}
            onScheduleTestDrive={handleOpenTestDrive}
            availableMakes={availableMakes}
          />
        )}

        {/* VIEW 3: VEHICLE DETAIL PAGE */}
        {currentPage === 'vehicle-detail' && currentDetailVehicle && (
          <VehicleDetailPage
            vehicle={currentDetailVehicle}
            onBackToInventory={() => navigateTo('inventory')}
            onScheduleTestDrive={handleOpenTestDrive}
          />
        )}

        {/* Fallback if vehicle id was invalid or deleted */}
        {currentPage === 'vehicle-detail' && !currentDetailVehicle && !loading && (
          <div className="min-h-screen pt-32 pb-20 text-center px-4">
            <h2 className="text-2xl font-bold font-heading text-white">Vehicle Not Found</h2>
            <p className="text-sm text-slate-400 mt-2">This automobile may have been sold or removed from inventory.</p>
            <button
              onClick={() => navigateTo('inventory')}
              className="mt-6 px-6 py-2.5 bg-red-600 text-white rounded text-xs uppercase font-semibold"
            >
              Back to Inventory
            </button>
          </div>
        )}

        {/* VIEW 4: ABOUT PAGE */}
        {currentPage === 'about' && (
          <AboutPage
            onNavigateInventory={() => navigateTo('inventory')}
            onNavigateContact={() => navigateTo('contact')}
          />
        )}

        {/* VIEW 5: CONTACT PAGE */}
        {currentPage === 'contact' && <ContactPage />}

        {/* VIEW 6: ADMIN DASHBOARD */}
        {currentPage === 'admin' && (
          <AdminDashboard
            onBackToWebsite={() => navigateTo('home')}
            onRefreshGlobalData={fetchVehicles}
            adminToken={adminToken}
            onLoginSuccess={handleAdminLoginSuccess}
            onLogout={handleAdminLogout}
          />
        )}
      </main>

      {/* Global Modals */}
      <InquiryModal
        vehicle={inquiryVehicle}
        isOpen={inquiryModalOpen}
        onClose={() => setInquiryModalOpen(false)}
      />

      <TestDriveModal
        vehicle={testDriveVehicle}
        allVehicles={vehicles}
        isOpen={testDriveModalOpen}
        onClose={() => setTestDriveModalOpen(false)}
      />

      {/* Site Footer (Hidden on Admin screen) */}
      {currentPage !== 'admin' && (
        <Footer
          onNavigate={(route) => navigateTo(route as any)}
          onFilterCategory={handleCategoryClick}
          onOpenAdmin={() => navigateTo('admin')}
          onOpenTestDrive={() => handleOpenTestDrive(null)}
          onOpenInquiry={() => handleOpenInquiry(null)}
        />
      )}
    </div>
  );
}
