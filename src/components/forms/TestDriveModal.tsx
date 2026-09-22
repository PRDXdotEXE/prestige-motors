import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle, Car, Shield } from 'lucide-react';
import { Vehicle } from '../../types';
import { api } from '../../lib/api';
import { testDriveSchema } from '../../lib/validations';

interface TestDriveModalProps {
  vehicle: Vehicle | null;
  allVehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  onSelectVehicle?: (vehicle: Vehicle) => void;
}

export const TestDriveModal: React.FC<TestDriveModalProps> = ({
  vehicle,
  allVehicles,
  isOpen,
  onClose
}) => {
  const [selectedVehicleId, setSelectedVehicleId] = useState<string>(vehicle?.id || (allVehicles[0]?.id || ''));
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Default to tomorrow's date formatted YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [preferredDate, setPreferredDate] = useState(defaultDateStr);
  const [preferredTime, setPreferredTime] = useState('11:00 AM');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const currentSelectedVehicle = allVehicles.find(v => v.id === (vehicle ? vehicle.id : selectedVehicleId));

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '01:00 PM',
    '02:30 PM',
    '04:00 PM',
    '05:30 PM'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!currentSelectedVehicle) {
      setErrors({ form: 'Please select a vehicle from our collection.' });
      return;
    }

    const payload = {
      vehicleId: currentSelectedVehicle.id,
      vehicleTitle: `${currentSelectedVehicle.year} ${currentSelectedVehicle.make} ${currentSelectedVehicle.model}`,
      name,
      email,
      phone,
      preferredDate,
      preferredTime,
      message
    };

    // Validate with Zod
    const validation = testDriveSchema.safeParse(payload);
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
      await api.submitTestDrive(payload);
      setSubmitted(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit test drive request' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setErrors({});
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-[#12151E] border border-white/10 w-full max-w-xl rounded-sm shadow-2xl overflow-hidden relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0B0D12]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-white text-base">
                Private Test Drive Experience
              </h3>
              <p className="text-xs text-slate-400">
                Experience the performance, luxury, and dynamics firsthand
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 text-slate-400 hover:text-white rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-heading font-bold text-xl text-white">
                Test Drive Appointment Requested
              </h4>
              <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-white">{name}</span>. Your private appointment for the{' '}
                <span className="text-red-400 font-semibold">
                  {currentSelectedVehicle?.year} {currentSelectedVehicle?.make} {currentSelectedVehicle?.model}
                </span>{' '}
                is reserved for{' '}
                <span className="text-white font-mono font-medium">
                  {preferredDate} at {preferredTime}
                </span>
                . Our concierge will call you at <span className="text-white">{phone}</span> to confirm your slot.
              </p>

              <div className="p-3 bg-[#0B0D12] border border-white/10 rounded-sm text-xs text-slate-400 text-left max-w-sm mx-auto space-y-1">
                <p className="font-semibold text-slate-200">Showroom Check-In Instructions:</p>
                <p>&bull; Please bring a valid U.S. or International Driver&apos;s License.</p>
                <p>&bull; Active auto insurance card required at check-in.</p>
                <p>&bull; Complimentary espresso and private vehicle staging await you.</p>
              </div>

              <div className="pt-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-lg transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Vehicle Selection */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Selected Vehicle *
                </label>
                {vehicle ? (
                  <div className="p-3 bg-[#0B0D12] border border-white/10 rounded flex items-center gap-3">
                    <img
                      src={vehicle.images[0]}
                      alt={vehicle.model}
                      className="w-16 h-11 object-cover rounded shrink-0 border border-white/10"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-xs text-red-400 font-mono">
                        ${vehicle.price.toLocaleString()} &bull; {vehicle.location}
                      </p>
                    </div>
                  </div>
                ) : (
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {allVehicles
                      .filter(v => v.status !== 'SOLD')
                      .map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.year} {v.make} {v.model} (${v.price.toLocaleString()})
                        </option>
                      ))}
                  </select>
                )}
              </div>

              {errors.form && (
                <div className="p-3 bg-red-950/50 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{errors.form}</span>
                </div>
              )}

              {/* Preferred Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={preferredDate}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${
                        errors.preferredDate ? 'border-red-500' : 'border-white/10'
                      }`}
                    />
                  </div>
                  {errors.preferredDate && <p className="text-[11px] text-red-400 mt-1">{errors.preferredDate}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Preferred Time Slot *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                  >
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Full Legal Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="First and Last Name"
                    className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${
                      errors.name ? 'border-red-500' : 'border-white/10'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-red-400 mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">
                    Direct Phone Number *
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
                  placeholder="name@company.com"
                  className={`w-full bg-[#0B0D12] border rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 ${
                    errors.email ? 'border-red-500' : 'border-white/10'
                  }`}
                />
                {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
              </div>

              {/* Additional notes */}
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">
                  Special Driving Requirements or Trade-in Details (Optional)
                </label>
                <textarea
                  rows={2}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Bringing a Porsche trade-in, highway acceleration test loop preference..."
                  className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                />
              </div>

              {/* Security info */}
              <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
                <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Zero obligation. Dedicated test drive route with private specialist.</span>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-lg shadow-red-900/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Confirming Time Slot...</span>
                  ) : (
                    <>
                      <Car className="w-4 h-4" />
                      <span>Confirm Test Drive Reservation</span>
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
