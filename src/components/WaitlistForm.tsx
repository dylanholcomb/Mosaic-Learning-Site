import React, { useState } from 'react';
import { Sparkles, CheckCircle, AlertCircle, ArrowRight, ShieldCheck, Mail, Building, Briefcase, MapPin, User, CreditCard, FileText, Users } from 'lucide-react';
import { County, WaitlistFormData, WaitlistSignup, PaymentPreference } from '../types.ts';
import { submitWaitlistSignup } from '../services/waitlistService.ts';
import { JustificationPacketModal } from './JustificationPacketModal.tsx';

interface WaitlistFormProps {
  onSuccess: (signup: WaitlistSignup, position: number) => void;
  onRefreshStats: () => void;
}

export const WaitlistForm: React.FC<WaitlistFormProps> = ({ onSuccess, onRefreshStats }) => {
  const [formData, setFormData] = useState<WaitlistFormData>({
    full_name: '',
    email: '',
    company: '',
    role_title: '',
    county: '',
    hopes: '',
    payment_preference: 'credit_card_calcard',
    seat_count: 1,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPacketOpen, setIsPacketOpen] = useState(false);
  const [duplicateNotice, setDuplicateNotice] = useState<{
    show: boolean;
    message: string;
    position?: number;
    signup?: WaitlistSignup;
  } | null>(null);

  const counties: County[] = [
    'Sacramento',
    'Yolo',
    'Placer',
    'Nevada County',
    'Other',
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Work email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid work email address (e.g. name@company.com)';
      }
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company or organization is required';
    }

    if (!formData.role_title.trim()) {
      newErrors.role_title = 'Role or title is required';
    }

    if (!formData.county) {
      newErrors.county = 'Please select your county';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateNotice(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await submitWaitlistSignup(formData);
      setIsSubmitting(false);

      if (result.duplicate) {
        setDuplicateNotice({
          show: true,
          message: result.message || "Your seat is already reserved for October 15: we'll be in touch with your 48-hour priority booking link once the session locks.",
          position: result.position,
          signup: result.signup,
        });
        onRefreshStats();
      } else if (result.success && result.signup) {
        onRefreshStats();
        onSuccess(result.signup, result.position);
      } else {
        setErrors({ general: 'Something went wrong. Please try again.' });
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setErrors({ general: err.message || 'Unable to save your spot right now. Please check your network and try again.' });
    }
  };

  return (
    <section id="waitlist" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Card Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
            Priority Reservation
          </span>
          <h2
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Reserve Your Seat for October 15
          </h2>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 mb-3">
            <span>Thursday, October 15</span>
            <span className="text-slate-400">•</span>
            <span>9:00 AM - Noon</span>
            <span className="text-slate-400">•</span>
            <span>Rancho Cordova, CA</span>
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            No upfront payment. Reserving now guarantees your priority place in line at $250/seat, with 48-hour priority booking once the session locks.
          </p>
        </div>

        {/* Duplicate Notice Banner */}
        {duplicateNotice?.show && (
          <div
            id="duplicate-email-alert"
            className="mb-8 p-5 rounded-2xl bg-cyan-50 border-2 border-[#00AECC] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-2 duration-300"
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#00AECC] text-white flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  You're already on the list!
                </h4>
                <p className="text-sm text-slate-700 mt-0.5">
                  {duplicateNotice.message}
                </p>
                {duplicateNotice.position && (
                  <p className="text-xs font-semibold text-[#00AECC] mt-1">
                    Your current priority position: #{duplicateNotice.position}
                  </p>
                )}
              </div>
            </div>
            {duplicateNotice.signup && (
              <button
                type="button"
                onClick={() => onSuccess(duplicateNotice.signup!, duplicateNotice.position || 1)}
                className="text-xs font-bold px-4 py-2 rounded-lg bg-white border border-cyan-300 text-[#00AECC] hover:bg-cyan-100/50 shadow-xs transition-colors shrink-0"
              >
                View Confirmation
              </button>
            )}
          </div>
        )}

        {/* General Error Banner */}
        {errors.general && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errors.general}</span>
          </div>
        )}

        {/* Form Card Container */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-10 relative">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* Full Name & Work Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="full_name"
                  className="block text-xs font-bold text-slate-500 uppercase mb-1"
                >
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    placeholder="Alex Rivera"
                    value={formData.full_name}
                    onChange={(e) => {
                      setFormData({ ...formData, full_name: e.target.value });
                      if (errors.full_name) setErrors({ ...errors, full_name: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AECC] text-sm text-slate-900 placeholder:text-slate-400 transition-all ${
                      errors.full_name
                        ? 'border-red-300 bg-red-50/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.full_name && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.full_name}</p>
                )}
              </div>

              {/* Work Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-500 uppercase mb-1"
                >
                  Work Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="arivera@company.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AECC] text-sm text-slate-900 placeholder:text-slate-400 transition-all ${
                      errors.email
                        ? 'border-red-300 bg-red-50/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Company & County */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company */}
              <div>
                <label
                  htmlFor="company"
                  className="block text-xs font-bold text-slate-500 uppercase mb-1"
                >
                  Company / Organization <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="company"
                    name="company"
                    placeholder="Mosaic Data"
                    value={formData.company}
                    onChange={(e) => {
                      setFormData({ ...formData, company: e.target.value });
                      if (errors.company) setErrors({ ...errors, company: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AECC] text-sm text-slate-900 placeholder:text-slate-400 transition-all ${
                      errors.company
                        ? 'border-red-300 bg-red-50/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white'
                    }`}
                  />
                </div>
                {errors.company && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.company}</p>
                )}
              </div>

              {/* County Selection */}
              <div>
                <label
                  htmlFor="county"
                  className="block text-xs font-bold text-slate-500 uppercase mb-1"
                >
                  County <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    id="county"
                    name="county"
                    value={formData.county}
                    onChange={(e) => {
                      setFormData({ ...formData, county: e.target.value as County });
                      if (errors.county) setErrors({ ...errors, county: '' });
                    }}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AECC] text-sm text-slate-900 appearance-none cursor-pointer transition-all ${
                      errors.county
                        ? 'border-red-300 bg-red-50/20'
                        : 'border-slate-200 bg-slate-50 focus:bg-white'
                    }`}
                  >
                    <option value="" disabled>
                      Select county...
                    </option>
                    {counties.map((c) => (
                      <option key={c} value={c}>
                        {c === 'Nevada County'
                          ? 'Nevada County'
                          : c === 'Other'
                          ? 'Other (Greater Sacramento)'
                          : `${c} County`}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {errors.county && (
                  <p className="mt-1 text-xs text-red-600 font-medium">{errors.county}</p>
                )}
              </div>
            </div>

            {/* Role Title */}
            <div>
              <label
                htmlFor="role_title"
                className="block text-xs font-bold text-slate-500 uppercase mb-1"
              >
                Role / Title <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="role_title"
                  name="role_title"
                  placeholder="Operations Lead, Program Manager, Analyst..."
                  value={formData.role_title}
                  onChange={(e) => {
                    setFormData({ ...formData, role_title: e.target.value });
                    if (errors.role_title) setErrors({ ...errors, role_title: '' });
                  }}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AECC] text-sm text-slate-900 placeholder:text-slate-400 transition-all ${
                    errors.role_title
                      ? 'border-red-300 bg-red-50/20'
                      : 'border-slate-200 bg-slate-50 focus:bg-white'
                  }`}
                />
              </div>
              {errors.role_title && (
                <p className="mt-1 text-xs text-red-600 font-medium">{errors.role_title}</p>
              )}
            </div>

            {/* Optional Field: Hopes */}
            <div>
              <label
                htmlFor="hopes"
                className="block text-xs font-bold text-slate-500 uppercase mb-1"
              >
                Hopes for the class?{' '}
                <span className="text-slate-400 font-normal lowercase">(optional)</span>
              </label>
              <input
                type="text"
                id="hopes"
                name="hopes"
                placeholder="I want to learn how to pitch and scope our first AI pilot..."
                value={formData.hopes || ''}
                onChange={(e) => setFormData({ ...formData, hopes: e.target.value })}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00AECC] bg-slate-50 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 transition-all"
              />
            </div>

            {/* Preferred Payment Method & Paperwork Guidance */}
            <div className="pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-1 mb-2">
                <label
                  htmlFor="payment_preference"
                  className="block text-xs font-bold text-slate-700 uppercase"
                >
                  Preferred Payment Method
                </label>
                <button
                  type="button"
                  onClick={() => setIsPacketOpen(true)}
                  className="text-xs font-semibold text-[#00AECC] hover:underline inline-flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>State STD 697 &amp; W-9 Packet</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payment_preference: 'credit_card_calcard' })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    (formData.payment_preference || 'credit_card_calcard') === 'credit_card_calcard'
                      ? 'border-[#00AECC] bg-cyan-50/60 ring-1 ring-[#00AECC]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <CreditCard className="w-4 h-4 text-[#00AECC]" />
                    <span className="text-xs font-bold text-slate-900">Credit Card / Cal-Card</span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">Instant checkout link when session locks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payment_preference: 'invoice_po' })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    formData.payment_preference === 'invoice_po'
                      ? 'border-[#00AECC] bg-cyan-50/60 ring-1 ring-[#00AECC]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900">State Agency / PO</span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">Net 30 invoice with Form W-9 for accounting</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, payment_preference: 'team_billing', seat_count: formData.seat_count || 3 })}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                    formData.payment_preference === 'team_billing'
                      ? 'border-[#00AECC] bg-cyan-50/60 ring-1 ring-[#00AECC]'
                      : 'border-slate-200 bg-slate-50 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-slate-900">Team Billing (3+)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 leading-tight">Discounted $225/seat on one combined invoice</span>
                </button>
              </div>

              {formData.payment_preference === 'team_billing' && (
                <div className="mt-2.5 p-3 rounded-xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
                  <span className="text-emerald-900 font-medium">Estimated team seats:</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, seat_count: Math.max(3, (formData.seat_count || 3) - 1) })}
                      className="w-6 h-6 rounded-md bg-white border border-emerald-300 font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="font-bold text-emerald-900 text-sm px-1.5">{formData.seat_count || 3}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, seat_count: (formData.seat_count || 3) + 1 })}
                      className="w-6 h-6 rounded-md bg-white border border-emerald-300 font-bold text-emerald-800 hover:bg-emerald-100 flex items-center justify-center"
                    >
                      +
                    </button>
                    <span className="text-[11px] text-emerald-700 ml-1 font-semibold">($225/seat)</span>
                  </div>
                </div>
              )}

              <p className="mt-1.5 text-[11px] text-slate-500">
                No payment is collected today. This helps Mosaic prepare the right paperwork (invoice, W-9, or card receipt) for your organization.
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                id="waitlist-submit-btn"
                disabled={isSubmitting}
                className="w-full bg-[#00AECC] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-cyan-200/50 hover:bg-[#0099b3] transition-colors mt-2 uppercase tracking-wide disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Reserving your seat...</span>
                  </>
                ) : (
                  <>
                    <span>Reserve My Seat</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </div>

            {/* Reassurance Footer */}
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500 pt-2 text-center">
              <ShieldCheck className="w-4 h-4 text-[#00AECC] shrink-0" />
              <span>
                Zero spam. You'll only receive session scheduling notices and priority reservation links.
              </span>
            </div>
          </form>

          {/* Geometric Balance Investment Strip */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between text-center">
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Investment</p>
              <p className="text-lg font-bold text-slate-700">$250</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Duration</p>
              <p className="text-lg font-bold text-slate-700">3 Hours</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase font-bold mb-1">Includes</p>
              <p className="text-lg font-bold text-slate-700">Recording</p>
            </div>
          </div>
        </div>
      </div>

      {/* State Justification & Procurement Packet Modal */}
      <JustificationPacketModal
        isOpen={isPacketOpen}
        onClose={() => setIsPacketOpen(false)}
      />
    </section>
  );
};
