import React, { useState, useEffect } from 'react';
import { Vehicle, Inquiry, TestDriveRequest, AdminStats } from '../../types';
import { api } from '../../lib/api';
import { vehicleSchema } from '../../lib/validations';
import {
  Shield,
  Car,
  Mail,
  Calendar,
  DollarSign,
  Plus,
  Trash2,
  Edit2,
  Lock,
  LogOut,
  Sparkles,
  ArrowLeft,
  X,
  RefreshCw,
  Search
} from 'lucide-react';

interface AdminDashboardProps {
  onBackToWebsite: () => void;
  onRefreshGlobalData: () => void;
  adminToken: string | null;
  onLoginSuccess: (token: string) => void;
  onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onBackToWebsite,
  onRefreshGlobalData,
  adminToken,
  onLoginSuccess,
  onLogout
}) => {
  // Login Form State
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'vehicles' | 'inquiries' | 'testDrives'>('overview');

  // Admin Data State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [testDrives, setTestDrives] = useState<TestDriveRequest[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Add / Edit Vehicle Modal State
  const [vehicleModalOpen, setVehicleModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [vehicleFormData, setVehicleFormData] = useState({
    make: '',
    model: '',
    year: 2024,
    price: 150000,
    mileage: 2500,
    fuelType: 'Gasoline' as Vehicle['fuelType'],
    transmission: 'Automatic' as Vehicle['transmission'],
    engine: '4.0L Twin-Turbo V8 (600 hp)',
    drivetrain: 'AWD' as Vehicle['drivetrain'],
    bodyType: 'Coupe' as Vehicle['bodyType'],
    exteriorColor: 'Nardo Gray',
    interiorColor: 'Black Leather',
    vin: 'WP0AB2A99RS123456',
    description: 'Immaculate condition with certified clean title and extensive factory options.',
    features: 'Front Axle Lift System, Sport Exhaust, Carbon Fiber Package, Burmester Audio',
    images: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85',
    featured: true,
    status: 'AVAILABLE' as Vehicle['status'],
    location: 'Beverly Hills Showroom'
  });
  const [vehicleFormErrors, setVehicleFormErrors] = useState<Record<string, string>>({});
  const [savingVehicle, setSavingVehicle] = useState(false);

  // Load Admin Data when authenticated
  const loadAdminData = async () => {
    if (!adminToken) return;
    try {
      setLoadingData(true);
      const [statsRes, vehiclesRes, inqRes, tdRes] = await Promise.all([
        api.getAdminStats(adminToken),
        api.getVehicles(),
        api.getInquiries(adminToken),
        api.getTestDrives(adminToken)
      ]);
      setStats(statsRes);
      setVehicles(vehiclesRes);
      setInquiries(inqRes);
      setTestDrives(tdRes);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (adminToken) {
      loadAdminData();
    }
  }, [adminToken]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      setIsLoggingIn(true);
      const res = await api.adminLogin(password);
      if (res.success && res.token) {
        onLoginSuccess(res.token);
      } else {
        setLoginError(res.message || 'Incorrect administration password');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const openAddVehicleModal = () => {
    setEditingVehicle(null);
    setVehicleFormData({
      make: 'Porsche',
      model: '911 Carrera GTS',
      year: 2024,
      price: 175000,
      mileage: 1200,
      fuelType: 'Gasoline',
      transmission: 'Dual-Clutch',
      engine: '3.0L Twin-Turbo Flat 6 (473 hp)',
      drivetrain: 'RWD',
      bodyType: 'Coupe',
      exteriorColor: 'Chalk White',
      interiorColor: 'Black Leather / Race-Tex',
      vin: 'WP0AB2A99RS982143',
      description: 'Stunning 2024 Porsche 911 Carrera GTS in Chalk over Black leather. One owner, full front PPF, sport design package, and BOSE sound system.',
      features: 'Sport Exhaust, Front Axle Lift, BOSE Surround, Porsche Active Suspension Management (PASM)',
      images: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1600&q=85',
      featured: true,
      status: 'AVAILABLE',
      location: 'Beverly Hills Showroom'
    });
    setVehicleFormErrors({});
    setVehicleModalOpen(true);
  };

  const openEditVehicleModal = (veh: Vehicle) => {
    setEditingVehicle(veh);
    setVehicleFormData({
      make: veh.make,
      model: veh.model,
      year: veh.year,
      price: veh.price,
      mileage: veh.mileage,
      fuelType: veh.fuelType,
      transmission: veh.transmission,
      engine: veh.engine,
      drivetrain: veh.drivetrain,
      bodyType: veh.bodyType,
      exteriorColor: veh.exteriorColor,
      interiorColor: veh.interiorColor,
      vin: veh.vin,
      description: veh.description,
      features: veh.features.join(', '),
      images: veh.images.join('\n'),
      featured: veh.featured,
      status: veh.status,
      location: veh.location
    });
    setVehicleFormErrors({});
    setVehicleModalOpen(true);
  };

  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;
    setVehicleFormErrors({});

    const featuresArray = vehicleFormData.features
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const imagesArray = vehicleFormData.images
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const payload = {
      make: vehicleFormData.make,
      model: vehicleFormData.model,
      year: Number(vehicleFormData.year),
      price: Number(vehicleFormData.price),
      mileage: Number(vehicleFormData.mileage),
      fuelType: vehicleFormData.fuelType,
      transmission: vehicleFormData.transmission,
      engine: vehicleFormData.engine,
      drivetrain: vehicleFormData.drivetrain,
      bodyType: vehicleFormData.bodyType,
      exteriorColor: vehicleFormData.exteriorColor,
      interiorColor: vehicleFormData.interiorColor,
      vin: vehicleFormData.vin.trim().toUpperCase(),
      description: vehicleFormData.description,
      features: featuresArray.length > 0 ? featuresArray : ['Standard Luxury Package'],
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1600&q=85'],
      featured: vehicleFormData.featured,
      status: vehicleFormData.status,
      location: vehicleFormData.location
    };

    const validation = vehicleSchema.safeParse(payload);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setVehicleFormErrors(errMap);
      return;
    }

    try {
      setSavingVehicle(true);
      if (editingVehicle) {
        await api.updateVehicle(editingVehicle.id, payload, adminToken);
      } else {
        await api.createVehicle(payload, adminToken);
      }
      setVehicleModalOpen(false);
      await loadAdminData();
      onRefreshGlobalData();
    } catch (err: any) {
      setVehicleFormErrors({ form: err.message || 'Operation failed' });
    } finally {
      setSavingVehicle(false);
    }
  };

  const handleDeleteVehicle = async (id: string, name: string) => {
    if (!adminToken) return;
    if (!window.confirm(`Are you sure you want to permanently remove ${name} from inventory?`)) return;

    try {
      await api.deleteVehicle(id, adminToken);
      await loadAdminData();
      onRefreshGlobalData();
    } catch (err) {
      alert('Failed to delete vehicle');
    }
  };

  const handleToggleFeatured = async (veh: Vehicle) => {
    if (!adminToken) return;
    try {
      await api.updateVehicle(veh.id, { featured: !veh.featured }, adminToken);
      await loadAdminData();
      onRefreshGlobalData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangeStatus = async (veh: Vehicle, newStatus: Vehicle['status']) => {
    if (!adminToken) return;
    try {
      await api.updateVehicle(veh.id, { status: newStatus }, adminToken);
      await loadAdminData();
      onRefreshGlobalData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: Inquiry['status']) => {
    if (!adminToken) return;
    try {
      await api.updateInquiryStatus(id, newStatus, adminToken);
      await loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!adminToken) return;
    if (!window.confirm('Delete this inquiry record?')) return;
    try {
      await api.deleteInquiry(id, adminToken);
      await loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateTestDriveStatus = async (id: string, newStatus: TestDriveRequest['status']) => {
    if (!adminToken) return;
    try {
      await api.updateTestDriveStatus(id, newStatus, adminToken);
      await loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTestDrive = async (id: string) => {
    if (!adminToken) return;
    if (!window.confirm('Delete this test drive record?')) return;
    try {
      await api.deleteTestDrive(id, adminToken);
      await loadAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  // If Not Authenticated -> Show Login Wall
  if (!adminToken) {
    return (
      <div id="admin-login-screen" className="min-h-screen pt-28 pb-20 flex items-center justify-center bg-[#07090D] px-4">
        <div className="w-full max-w-md bg-[#12151E] border border-white/10 rounded-sm p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-sm bg-red-600/20 text-red-500 border border-red-500/40 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="font-heading font-extrabold text-2xl text-white">Prestige Staff Portal</h2>
            <p className="text-xs text-slate-400">Restricted administrative access for dealership managers</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 bg-red-950/60 border border-red-800 text-red-300 text-xs rounded">
                {loginError}
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-300 block mb-1">Administrative Passcode</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: admin)"
                className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default demo passcode: <span className="font-mono text-white">admin</span></p>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-md transition-all disabled:opacity-50"
            >
              {isLoggingIn ? 'Verifying...' : 'Authenticate & Enter'}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={onBackToWebsite}
                className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filtered vehicles for admin search
  const filteredVehicles = vehicles.filter(v =>
    searchQuery === '' ||
    v.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.vin.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="admin-dashboard-container" className="min-h-screen pt-24 pb-20 bg-[#07090E]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToWebsite}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Return to Showroom"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-white">DEALERSHIP MANAGEMENT</span>
                <span className="text-[10px] bg-red-600 text-white font-bold px-2 py-0.5 rounded">ADMIN</span>
              </div>
              <p className="text-xs text-slate-400">Inventory control, lead response, and test drive scheduler</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAdminData}
              className="p-2 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingData ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={openAddVehicleModal}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-md transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Vehicle</span>
            </button>

            <button
              onClick={onLogout}
              className="p-2 rounded bg-white/5 hover:bg-red-950/60 hover:text-red-400 text-slate-400 border border-white/10 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 gap-2 sm:gap-6 overflow-x-auto text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setActiveTab('vehicles')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'vehicles'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>Inventory ({vehicles.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>Customer Inquiries ({inquiries.filter(i => i.status === 'NEW').length} New)</span>
          </button>

          <button
            onClick={() => setActiveTab('testDrives')}
            className={`pb-3 px-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'testDrives'
                ? 'border-red-600 text-white'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Test Drives ({testDrives.filter(t => t.status === 'PENDING').length} Pending)</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW & KPIS */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              <div className="bg-[#12151E] border border-white/10 p-5 rounded-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Total Vehicles</span>
                <span className="text-2xl font-heading font-extrabold text-white mt-1 block">
                  {stats?.totalVehicles ?? vehicles.length}
                </span>
              </div>

              <div className="bg-[#12151E] border border-white/10 p-5 rounded-sm">
                <span className="text-[10px] text-emerald-400 uppercase tracking-widest block">Available Stock</span>
                <span className="text-2xl font-heading font-extrabold text-emerald-400 mt-1 block">
                  {stats?.availableVehicles ?? vehicles.filter(v => v.status === 'AVAILABLE').length}
                </span>
              </div>

              <div className="bg-[#12151E] border border-white/10 p-5 rounded-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Sold Vehicles</span>
                <span className="text-2xl font-heading font-extrabold text-slate-400 mt-1 block">
                  {stats?.soldVehicles ?? vehicles.filter(v => v.status === 'SOLD').length}
                </span>
              </div>

              <div className="bg-[#12151E] border border-white/10 p-5 rounded-sm">
                <span className="text-[10px] text-red-400 uppercase tracking-widest block">New Inquiries</span>
                <span className="text-2xl font-heading font-extrabold text-red-400 mt-1 block">
                  {inquiries.filter(i => i.status === 'NEW').length}
                </span>
              </div>

              <div className="bg-[#12151E] border border-white/10 p-5 rounded-sm">
                <span className="text-[10px] text-amber-400 uppercase tracking-widest block">Pending Test Drives</span>
                <span className="text-2xl font-heading font-extrabold text-amber-400 mt-1 block">
                  {testDrives.filter(t => t.status === 'PENDING').length}
                </span>
              </div>

              <div className="bg-[#12151E] border border-white/10 p-5 rounded-sm">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest block">Inventory Value</span>
                <span className="text-xl font-heading font-extrabold text-white mt-1 block truncate">
                  ${((stats?.totalInventoryValue ?? 0) / 1000000).toFixed(2)}M
                </span>
              </div>
            </div>

            {/* Quick Action Tables Split */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Inquiries Panel */}
              <div className="bg-[#12151E] border border-white/10 rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-heading font-bold text-white text-sm">Recent Customer Inquiries</h3>
                  <button onClick={() => setActiveTab('inquiries')} className="text-xs text-red-400 hover:underline">
                    View All ({inquiries.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="p-3 bg-[#0B0D12] rounded border border-white/5 space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-white">{inq.name}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          inq.status === 'NEW' ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {inq.status}
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] truncate">{inq.vehicleTitle || 'General Inquiry'}</p>
                      <p className="text-slate-300 italic line-clamp-1">&ldquo;{inq.message}&rdquo;</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Upcoming Test Drives Panel */}
              <div className="bg-[#12151E] border border-white/10 rounded-sm p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="font-heading font-bold text-white text-sm">Scheduled Test Drives</h3>
                  <button onClick={() => setActiveTab('testDrives')} className="text-xs text-red-400 hover:underline">
                    View All ({testDrives.length})
                  </button>
                </div>

                <div className="space-y-3">
                  {testDrives.slice(0, 3).map((td) => (
                    <div key={td.id} className="p-3 bg-[#0B0D12] rounded border border-white/5 space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-semibold text-white">{td.name} &bull; {td.phone}</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          td.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {td.status}
                        </span>
                      </div>
                      <p className="text-red-400 font-medium">{td.vehicleTitle}</p>
                      <p className="text-slate-400 text-[11px]">{td.preferredDate} at {td.preferredTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: INVENTORY VEHICLES MANAGEMENT */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Search and Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative max-w-sm w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search vehicles by make, model, VIN..."
                  className="w-full bg-[#12151E] border border-white/10 rounded-sm pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
                />
              </div>

              <button
                onClick={openAddVehicleModal}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Vehicle</span>
              </button>
            </div>

            {/* Vehicles Table */}
            <div className="bg-[#12151E] border border-white/10 rounded-sm overflow-x-auto shadow-xl">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-[#0B0D12] text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/10">
                  <tr>
                    <th className="py-3 px-4">Vehicle</th>
                    <th className="py-3 px-4">Year/Make</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Mileage</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Featured</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredVehicles.map((veh) => (
                    <tr key={veh.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={veh.images[0]}
                          alt={veh.model}
                          className="w-12 h-9 object-cover rounded shrink-0 border border-white/10"
                        />
                        <div className="min-w-0">
                          <p className="font-semibold text-white truncate max-w-[200px]">{veh.model}</p>
                          <p className="text-[10px] font-mono text-slate-400">{veh.vin}</p>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-white">{veh.year}</span> {veh.make}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-white">
                        ${veh.price.toLocaleString()}
                      </td>

                      <td className="py-3 px-4 font-mono">
                        {veh.mileage.toLocaleString()} mi
                      </td>

                      <td className="py-3 px-4">
                        <select
                          value={veh.status}
                          onChange={(e) => handleChangeStatus(veh, e.target.value as any)}
                          aria-label={`Status for ${veh.make} ${veh.model}`}
                          className={`text-xs px-2 py-1 rounded bg-[#0B0D12] border focus:outline-none cursor-pointer ${
                            veh.status === 'AVAILABLE' ? 'text-emerald-400 border-emerald-500/30' :
                            veh.status === 'PENDING' ? 'text-amber-400 border-amber-500/30' :
                            'text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="AVAILABLE">AVAILABLE</option>
                          <option value="PENDING">PENDING</option>
                          <option value="SOLD">SOLD</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleFeatured(veh)}
                          title="Toggle Featured"
                          className={`p-1.5 rounded transition-colors ${
                            veh.featured
                              ? 'text-amber-400 bg-amber-400/10'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditVehicleModal(veh)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white"
                            title="Edit Vehicle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteVehicle(veh.id, `${veh.year} ${veh.make} ${veh.model}`)}
                            className="p-1.5 rounded bg-red-950/40 hover:bg-red-900/60 text-red-400"
                            title="Delete Vehicle"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INQUIRIES INBOX */}
        {activeTab === 'inquiries' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-heading font-bold text-white text-base">Client Inquiries Inbox</h3>

            {inquiries.length === 0 ? (
              <div className="p-8 text-center bg-[#12151E] rounded text-slate-400 text-xs">
                No customer inquiries in the system yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="bg-[#12151E] border border-white/10 p-5 rounded-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2 text-xs">
                      <div>
                        <span className="font-heading font-bold text-white text-sm">{inq.name}</span>
                        <span className="text-slate-400 ml-2">&bull; {inq.email} &bull; {inq.phone}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={inq.status}
                          onChange={(e) => handleUpdateInquiryStatus(inq.id, e.target.value as any)}
                          aria-label={`Inquiry status for ${inq.name}`}
                          className={`text-xs px-2.5 py-1 rounded bg-[#0B0D12] border focus:outline-none cursor-pointer ${
                            inq.status === 'NEW' ? 'text-red-400 border-red-500/40' :
                            inq.status === 'CONTACTED' ? 'text-amber-400 border-amber-500/40' :
                            'text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="CLOSED">CLOSED</option>
                        </select>

                        <button
                          onClick={() => handleDeleteInquiry(inq.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs">
                      {inq.vehicleTitle && (
                        <p className="text-red-400 font-semibold mb-1">
                          Vehicle: {inq.vehicleTitle}
                        </p>
                      )}
                      <p className="text-slate-300 leading-relaxed bg-[#0B0D12] p-3 rounded border border-white/5">
                        {inq.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        Received: {new Date(inq.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: TEST DRIVES SCHEDULER */}
        {activeTab === 'testDrives' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <h3 className="font-heading font-bold text-white text-base">Test Drive Appointments</h3>

            {testDrives.length === 0 ? (
              <div className="p-8 text-center bg-[#12151E] rounded text-slate-400 text-xs">
                No test drive reservations recorded yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {testDrives.map((td) => (
                  <div
                    key={td.id}
                    className="bg-[#12151E] border border-white/10 p-5 rounded-sm space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2 text-xs">
                      <div>
                        <span className="font-heading font-bold text-white text-sm">{td.name}</span>
                        <span className="text-slate-400 ml-2">&bull; {td.phone} &bull; {td.email}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={td.status}
                          onChange={(e) => handleUpdateTestDriveStatus(td.id, e.target.value as any)}
                          aria-label={`Test drive status for ${td.name}`}
                          className={`text-xs px-2.5 py-1 rounded bg-[#0B0D12] border focus:outline-none cursor-pointer ${
                            td.status === 'PENDING' ? 'text-amber-400 border-amber-500/40' :
                            td.status === 'CONFIRMED' ? 'text-emerald-400 border-emerald-500/40' :
                            td.status === 'COMPLETED' ? 'text-blue-400 border-blue-500/40' :
                            'text-slate-400 border-slate-700'
                          }`}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>

                        <button
                          onClick={() => handleDeleteTestDrive(td.id)}
                          className="p-1 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs space-y-1">
                      <p className="font-semibold text-white">
                        Vehicle: <span className="text-red-400">{td.vehicleTitle}</span>
                      </p>
                      <p className="text-slate-300">
                        Requested Appointment: <span className="font-mono text-white">{td.preferredDate} at {td.preferredTime}</span>
                      </p>
                      {td.message && (
                        <p className="text-slate-400 italic bg-[#0B0D12] p-2.5 rounded border border-white/5">
                          Note: {td.message}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ADD / EDIT VEHICLE MODAL */}
      {vehicleModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setVehicleModalOpen(false)}
        >
          <div
            className="bg-[#12151E] border border-white/10 w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0B0D12]">
              <h3 className="font-heading font-bold text-white text-base">
                {editingVehicle ? 'Edit Vehicle Details' : 'Add New Inventory Vehicle'}
              </h3>
              <button
                onClick={() => setVehicleModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle} className="p-6 space-y-4 text-xs">
              {vehicleFormErrors.form && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 rounded">
                  {vehicleFormErrors.form}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Make *</label>
                  <input
                    type="text"
                    value={vehicleFormData.make}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, make: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                  {vehicleFormErrors.make && <p className="text-red-400 mt-0.5">{vehicleFormErrors.make}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-slate-300 block mb-1">Model *</label>
                  <input
                    type="text"
                    value={vehicleFormData.model}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, model: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                  {vehicleFormErrors.model && <p className="text-red-400 mt-0.5">{vehicleFormErrors.model}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Model Year *</label>
                  <input
                    type="number"
                    value={vehicleFormData.year}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, year: Number(e.target.value) })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    value={vehicleFormData.price}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, price: Number(e.target.value) })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Mileage (Miles) *</label>
                  <input
                    type="number"
                    value={vehicleFormData.mileage}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, mileage: Number(e.target.value) })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Powertrain *</label>
                  <select
                    value={vehicleFormData.fuelType}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, fuelType: e.target.value as any })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  >
                    <option value="Gasoline">Gasoline</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Plug-in Hybrid">Plug-in Hybrid</option>
                    <option value="Diesel">Diesel</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Transmission *</label>
                  <select
                    value={vehicleFormData.transmission}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, transmission: e.target.value as any })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  >
                    <option value="Automatic">Automatic</option>
                    <option value="Dual-Clutch">Dual-Clutch</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Body Style *</label>
                  <select
                    value={vehicleFormData.bodyType}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, bodyType: e.target.value as any })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  >
                    <option value="Coupe">Coupe</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Convertible">Convertible</option>
                    <option value="Truck">Truck</option>
                    <option value="Wagon">Wagon</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Engine Specification *</label>
                  <input
                    type="text"
                    value={vehicleFormData.engine}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, engine: e.target.value })}
                    placeholder="e.g. 4.0L Twin-Turbo V8 (600 hp)"
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">VIN (17 Characters) *</label>
                  <input
                    type="text"
                    maxLength={17}
                    value={vehicleFormData.vin}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, vin: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white font-mono"
                  />
                  {vehicleFormErrors.vin && <p className="text-red-400 mt-0.5">{vehicleFormErrors.vin}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1">Exterior Color *</label>
                  <input
                    type="text"
                    value={vehicleFormData.exteriorColor}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, exteriorColor: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Interior Color *</label>
                  <input
                    type="text"
                    value={vehicleFormData.interiorColor}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, interiorColor: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Location *</label>
                  <input
                    type="text"
                    value={vehicleFormData.location}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, location: e.target.value })}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Vehicle Description *</label>
                <textarea
                  rows={3}
                  value={vehicleFormData.description}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, description: e.target.value })}
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white resize-none"
                />
                {vehicleFormErrors.description && <p className="text-red-400 mt-0.5">{vehicleFormErrors.description}</p>}
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Features (Comma separated)</label>
                <input
                  type="text"
                  value={vehicleFormData.features}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, features: e.target.value })}
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Image URLs (One URL per line)</label>
                <textarea
                  rows={2}
                  value={vehicleFormData.images}
                  onChange={(e) => setVehicleFormData({ ...vehicleFormData, images: e.target.value })}
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-sm p-2 text-white resize-none font-mono text-[11px]"
                />
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vehicleFormData.featured}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, featured: e.target.checked })}
                    className="rounded bg-[#0B0D12] border-white/20 text-red-600 focus:ring-red-500"
                  />
                  <span className="text-slate-200">Mark as Featured Vehicle</span>
                </label>

                <div className="flex items-center gap-2">
                  <span className="text-slate-300">Status:</span>
                  <select
                    value={vehicleFormData.status}
                    onChange={(e) => setVehicleFormData({ ...vehicleFormData, status: e.target.value as any })}
                    className="bg-[#0B0D12] border border-white/10 rounded px-2 py-1 text-white"
                  >
                    <option value="AVAILABLE">AVAILABLE</option>
                    <option value="PENDING">PENDING</option>
                    <option value="SOLD">SOLD</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setVehicleModalOpen(false)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingVehicle}
                  className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded shadow-md disabled:opacity-50"
                >
                  {savingVehicle ? 'Saving...' : editingVehicle ? 'Update Vehicle' : 'Add to Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
