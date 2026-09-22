import React, { useState } from 'react';
import { Vehicle } from '../../types';
import { VehicleGallery } from '../vehicles/VehicleGallery';
import { FinancingCalculator } from '../vehicles/FinancingCalculator';
import { api } from '../../lib/api';
import { inquirySchema } from '../../lib/validations';
import {
  ArrowLeft,
  Calendar,
  Send,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Sparkles,
  Calculator,
  Check
} from 'lucide-react';

interface VehicleDetailPageProps {
  vehicle: Vehicle;
  onBackToInventory: () => void;
  onScheduleTestDrive: (vehicle: Vehicle) => void;
}

export const VehicleDetailPage: React.FC<VehicleDetailPageProps> = ({
  vehicle,
  onBackToInventory,
  onScheduleTestDrive
}) => {
  const [showFinancingModal, setShowFinancingModal] = useState(false);

  // Embedded Inquiry form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    `I am interested in acquiring this ${vehicle.year} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin}). Please provide window sticker, service records, and available transport options.`
  );
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySuccess, setInquirySuccess] = useState(false);
  const [inquiryErrors, setInquiryErrors] = useState<Record<string, string>>({});

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInquiryErrors({});

    const payload = {
      vehicleId: vehicle.id,
      vehicleTitle: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      name,
      email,
      phone,
      message
    };

    const validation = inquirySchema.safeParse(payload);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setInquiryErrors(errMap);
      return;
    }

    try {
      setSubmittingInquiry(true);
      await api.submitInquiry(payload);
      setInquirySuccess(true);
    } catch (err: any) {
      setInquiryErrors({ form: err.message || 'Failed to submit inquiry' });
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div id="vehicle-detail-page" className="min-h-screen pt-28 pb-24 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
          <button
            id="detail-back-btn"
            onClick={onBackToInventory}
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Complete Inventory</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>VIN: <span className="font-mono text-slate-200">{vehicle.vin}</span></span>
          </div>
        </div>

        {/* Top Header Summary */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-semibold text-red-500 uppercase tracking-widest">
                {vehicle.year} &bull; {vehicle.make}
              </span>
              {vehicle.featured && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-red-600 text-white px-2 py-0.5 rounded">
                  <Sparkles className="w-3 h-3" />
                  Featured Stock
                </span>
              )}
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                vehicle.status === 'AVAILABLE'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : vehicle.status === 'PENDING'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}>
                {vehicle.status}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
              {vehicle.model}
            </h1>

            <div className="flex items-center gap-4 text-xs text-slate-400 mt-2">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                {vehicle.location}
              </span>
              <span>&bull;</span>
              <span>Stock #{vehicle.id.slice(-6).toUpperCase()}</span>
            </div>
          </div>

          {/* Pricing & Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block">
                Offered Price
              </span>
              <div className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
                {formatPrice(vehicle.price)}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="detail-schedule-testdrive-btn"
                onClick={() => onScheduleTestDrive(vehicle)}
                disabled={vehicle.status === 'SOLD'}
                className="px-6 py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-xl shadow-red-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <Calendar className="w-4 h-4" />
                <span>Schedule Test Drive</span>
              </button>

              <button
                id="detail-open-finance-btn"
                onClick={() => setShowFinancingModal(!showFinancingModal)}
                className="px-5 py-3.5 bg-white/5 hover:bg-white/10 active:bg-white/15 text-slate-200 hover:text-white font-semibold text-xs tracking-wider uppercase rounded-sm border border-white/15 transition-colors flex items-center gap-2"
              >
                <Calculator className="w-4 h-4 text-red-400" />
                <span>Financing Options</span>
              </button>
            </div>
          </div>
        </div>

        {/* Gallery & Quick Specs Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Gallery & Description & Features */}
          <div className="lg:col-span-8 space-y-10">
            {/* Gallery component */}
            <VehicleGallery images={vehicle.images} vehicleTitle={`${vehicle.year} ${vehicle.make} ${vehicle.model}`} />

            {/* Financing Calculator Toggle Drawer */}
            {showFinancingModal && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <FinancingCalculator
                  vehiclePrice={vehicle.price}
                  onApplyNow={() => {
                    const el = document.getElementById('inquiry-form-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                />
              </div>
            )}

            {/* Specifications Matrix */}
            <div className="bg-[#12151E] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="font-heading font-bold text-white text-lg border-b border-white/10 pb-3">
                Vehicle Specifications & Provenance
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4 text-xs">
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Engine / Powertrain</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.engine}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Transmission</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.transmission}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Drivetrain</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.drivetrain}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Mileage</span>
                  <span className="text-white font-mono font-medium text-sm mt-0.5 block">{vehicle.mileage.toLocaleString()} mi</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Fuel Type</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.fuelType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Body Profile</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.bodyType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Exterior Finish</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.exteriorColor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">Interior Upholstery</span>
                  <span className="text-white font-medium text-sm mt-0.5 block">{vehicle.interiorColor}</span>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[10px] tracking-wider">VIN</span>
                  <span className="text-white font-mono text-sm mt-0.5 block">{vehicle.vin}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-[#12151E] border border-white/10 rounded-sm p-6 space-y-3">
              <h3 className="font-heading font-bold text-white text-lg">Curator&apos;s Description</h3>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                {vehicle.description}
              </p>
            </div>

            {/* Features and Options Checklist */}
            <div className="bg-[#12151E] border border-white/10 rounded-sm p-6 space-y-4">
              <h3 className="font-heading font-bold text-white text-lg border-b border-white/10 pb-3">
                Factory Options & Key Highlights
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {vehicle.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-red-600/15 text-red-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </div>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Embedded Inquiry Card */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div
              id="inquiry-form-section"
              className="bg-[#12151E] border border-white/10 rounded-sm p-6 shadow-2xl space-y-5"
            >
              <div className="border-b border-white/10 pb-4">
                <span className="text-[11px] font-semibold text-red-500 uppercase tracking-widest block">
                  Private Consultation
                </span>
                <h3 className="font-heading font-bold text-white text-lg mt-1">
                  Inquire on this Vehicle
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Submit your contact details to connect directly with our assigned vehicle specialist.
                </p>
              </div>

              {inquirySuccess ? (
                <div className="text-center py-6 space-y-3">
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-heading font-bold text-white text-base">Inquiry Submitted</h4>
                  <p className="text-xs text-slate-300">
                    Thank you. We have recorded your interest in this {vehicle.make} {vehicle.model} and will respond shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
                  {inquiryErrors.form && (
                    <div className="p-2.5 bg-red-950/60 border border-red-800 text-red-200 rounded flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                      <span>{inquiryErrors.form}</span>
                    </div>
                  )}

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Your Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    {inquiryErrors.name && <p className="text-red-400 text-[10px] mt-1">{inquiryErrors.name}</p>}
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@email.com"
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    {inquiryErrors.email && <p className="text-red-400 text-[10px] mt-1">{inquiryErrors.email}</p>}
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-red-500"
                    />
                    {inquiryErrors.phone && <p className="text-red-400 text-[10px] mt-1">{inquiryErrors.phone}</p>}
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-medium">Message *</label>
                    <textarea
                      rows={3}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-white focus:outline-none focus:border-red-500 resize-none"
                    />
                    {inquiryErrors.message && <p className="text-red-400 text-[10px] mt-1">{inquiryErrors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {submittingInquiry ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Quick Contact Box */}
            <div className="p-4 bg-[#0B0D12] border border-white/5 rounded text-xs space-y-2 text-slate-400">
              <p className="font-semibold text-white">Prefer Immediate Assistance?</p>
              <p>Call our Senior Curators at <a href="tel:18005550198" className="text-red-400 font-bold hover:underline">(800) 555-0198</a>.</p>
              <p>Showroom visits available 7 days a week by appointment.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
