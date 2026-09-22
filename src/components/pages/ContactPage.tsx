import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';
import { api } from '../../lib/api';
import { inquirySchema } from '../../lib/validations';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('General Showroom Inquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const payload = {
      name,
      email,
      phone,
      subject,
      message
    };

    const validation = inquirySchema.safeParse(payload);
    if (!validation.success) {
      const errMap: Record<string, string> = {};
      validation.error.issues.forEach(i => {
        if (i.path[0]) errMap[i.path[0].toString()] = i.message;
      });
      setErrors(errMap);
      return;
    }

    try {
      setLoading(true);
      await api.submitInquiry(payload);
      setSubmitted(true);
    } catch (err: any) {
      setErrors({ form: err.message || 'Failed to submit message' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contact-page" className="min-h-screen pt-28 pb-20 bg-[#0B0D12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div>
          <span className="text-xs font-semibold text-red-500 uppercase tracking-widest block mb-1">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
            Contact Prestige Motors
          </h1>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">
            Our client advisors and senior automotive curators are available to answer inquiries, coordinate private viewings, or arrange trade-in assessments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Form */}
          <div className="lg:col-span-7 bg-[#12151E] border border-white/10 rounded-sm p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <h2 className="font-heading font-bold text-white text-lg">Send Direct Message</h2>
            </div>

            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-bold text-2xl text-white">Message Transmitted</h3>
                <p className="text-sm text-slate-300 max-w-sm mx-auto leading-relaxed">
                  Thank you, <span className="text-white font-semibold">{name}</span>. Your message has been routed to our Beverly Hills concierge team. We will contact you at <span className="text-red-400">{email}</span> shortly.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-semibold text-xs tracking-wider uppercase rounded-sm"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errors.form && (
                  <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errors.form}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Full Legal Name *</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Christian Grey"
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.name && <p className="text-red-400 text-[11px] mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="(555) 000-0000"
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.phone && <p className="text-red-400 text-[11px] mt-1">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="c.grey@domain.com"
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500"
                    />
                    {errors.email && <p className="text-red-400 text-[11px] mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300 block mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 cursor-pointer"
                    >
                      <option value="General Showroom Inquiry">General Showroom Inquiry</option>
                      <option value="Vehicle Purchase / Cash Offer">Vehicle Purchase / Cash Offer</option>
                      <option value="Trade-in / Consignment Valuation">Trade-in / Consignment Valuation</option>
                      <option value="Financing & Leasing Inquiries">Financing & Leasing Inquiries</option>
                      <option value="Private Collection Procurement">Private Collection Procurement</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-300 block mb-1">Message *</label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you are looking for, specify preferred times to call, or outline your trade-in vehicle details..."
                    className="w-full bg-[#0B0D12] border border-white/10 rounded-sm px-3 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 resize-none"
                  />
                  {errors.message && <p className="text-red-400 text-[11px] mt-1">{errors.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 active:bg-red-700 text-white font-semibold text-xs tracking-wider uppercase rounded-sm shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <span>Submitting Message...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Direct Message</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Contact Details, Hours & Map Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#12151E] border border-white/10 rounded-sm p-6 space-y-5">
              <h3 className="font-heading font-bold text-white text-base border-b border-white/10 pb-3">
                Flagship Showroom Contact
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-white block">Beverly Hills Showroom</span>
                    <span className="text-slate-400">9600 Wilshire Boulevard, Beverly Hills, CA 90212</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Concierge Desk</span>
                    <a href="tel:18005550198" className="text-red-400 hover:underline">(800) 555-0198</a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-red-500 shrink-0" />
                  <div>
                    <span className="font-semibold text-white block">Client Relations Email</span>
                    <a href="mailto:concierge@prestigemotors.com" className="text-slate-300 hover:underline">
                      concierge@prestigemotors.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2 border-t border-white/5">
                  <Clock className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="font-semibold text-white block">Operating Hours</span>
                    <p className="text-slate-400">Monday &ndash; Saturday: 9:00 AM &ndash; 7:00 PM</p>
                    <p className="text-slate-400">Sunday: 11:00 AM &ndash; 5:00 PM (Private Appointment)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Map Visual Placeholder */}
            <div className="bg-[#12151E] border border-white/10 rounded-sm overflow-hidden p-1">
              <div className="relative aspect-[16/9] bg-slate-900 rounded-sm overflow-hidden flex items-center justify-center border border-white/5">
                <img
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80"
                  alt="Beverly Hills Map Overview"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                <div className="absolute text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-900/50 mb-2 animate-bounce">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-white font-heading">Wilshire & Rodeo Dr Corridor</h4>
                  <p className="text-[11px] text-slate-300">Valet parking on-site for showroom guests</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
