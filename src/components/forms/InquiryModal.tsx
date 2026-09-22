import React, { useState } from 'react';
import { X, Send, CheckCircle2, AlertCircle, Car, Shield } from 'lucide-react';
import { Vehicle } from '../../types';
import { api } from '../../lib/api';
import { inquirySchema } from '../../lib/validations';

interface InquiryModalProps {
  vehicle?: Vehicle | null;
  isOpen: boolean;
  onClose: () => void;
  defaultSubject?: string;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  vehicle,
  isOpen,
  onClose,
  defaultSubject
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState(
    defaultSubject || (vehicle ? `Inquiry regarding ${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'General Dealership Inquiry')
  );
  const [message, setMessage] = useState(
    vehicle
      ? `Hello, I am interested in the ${vehicle.year} ${vehicle.make} ${vehicle.model} (VIN: ${vehicle.vin}) priced at $${vehicle.price.toLocaleString()}. Please provide more details on vehicle history and availability.`
      : ''
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const formData = {
      vehicleId: vehicle?.id,
      vehicleTitle: vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : undefined,
      name,
      email,
      phone,
      subject,
      message
    };

    // Client-side validation with Zod
    const validation = inquirySchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      await api.submitInquiry(formData);
      setSubmitted(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit inquiry. Please try again or call our showroom.' });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={resetForm}
    >
      <div
        className="bg-[#12151E] border border-white/10 w-full max-w-lg rounded-sm shadow-2xl overflow-hidden relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0B0D12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Car className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                {vehicle ? 'Vehicle Inquiry & Concierge' : 'Contact Prestige Motors'}
              </h3>
              <p className="text-xs text-slate-400">
                Direct consultation with our senior automotive curators
              </p>
            </div>
          </div>
          <button
            onClick={resetForm}
            className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-xl text-white">
                Inquiry Successfully Transmitted
              </h4>
              <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-white">{name}</span>. A Prestige Motors client advisor has received your request regarding{' '}
                <span className="text-red-400 font-medium">
                  {vehicle ? `${vehicle.year} ${vehicle.make} ${vehicle.model}` : 'our collection'}
                </span>{' '}
                and will respond within 2 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={resetForm}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-lg transition-colors"
                >
                  Return to Showroom
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicle Context Tag (if attached) */}
              {vehicle && (
                <div className="p-3 bg-[#0B0D12] border border-white/5 rounded flex items-center gap-3">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.model}
                    className="w-16 h-11 object-cover rounded shrink-0 border border-white/10"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </p>
                    <p className="text-xs text-red-400 font-mono font-bold">
                      ${vehicle.price.toLocaleString()} &bull; VIN: {vehicle.vin.substring(0, 10)}...
                    </p>
                  </div>
                </div>
              )}

              {errors.form && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Name & Phone in 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Alexander Sterling"
                    className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${
                      errors.name ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 000-0000"
                    className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${
                      errors.phone ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.phone && <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alexander@example.com"
                  className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Message / Specific Questions *
                </label>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Inquire about history reports, trade-ins, financing options, or out-of-state enclosed delivery..."
                  className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none ${
                    errors.message ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.message && <p className="text-[11px] text-red-400 mt-1">{errors.message}</p>}
              </div>

              {/* Privacy Assurance */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>We respect your privacy. No spam. Direct communication only.</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Transmitting Inquiry...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Submit Inquiry to Showroom</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
