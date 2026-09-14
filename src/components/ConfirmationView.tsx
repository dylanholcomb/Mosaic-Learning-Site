import React, { useState } from 'react';
import { CheckCircle2, Share2, Copy, Check, ArrowLeft, Calendar, MapPin, Coffee, Tag, Sparkles, Mail, ExternalLink, CreditCard, FileText, Users } from 'lucide-react';
import { WaitlistSignup, WaitlistStats } from '../types.ts';
import { JustificationPacketModal } from './JustificationPacketModal.tsx';

interface ConfirmationViewProps {
  signup: WaitlistSignup;
  position: number;
  stats: WaitlistStats;
  onBackToLanding: () => void;
}

export const ConfirmationView: React.FC<ConfirmationViewProps> = ({
  signup,
  position,
  stats,
  onBackToLanding,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPacketOpen, setIsPacketOpen] = useState(false);

  const shareUrl = window.location.origin;
  const shareText = `I just reserved my seat for The Accidental AI Champion on Thursday, October 15 (9:00 AM - Noon) in Rancho Cordova! It's a 3-hour practical session for professionals leading AI initiatives. Check it out: ${shareUrl}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent('The Accidental AI Champion (Thursday, Oct 15, 9am-Noon) in Rancho Cordova: Mosaic Learning');
    const body = encodeURIComponent(
      `Hi,\n\nI thought of you for this upcoming workshop by Mosaic Data Solutions in Rancho Cordova: "The Accidental AI Champion" on Thursday, October 15 from 9:00 AM to Noon.\n\nIt is a 3-hour in-person workshop focused on managing up/down, getting AI pilots off the ground, and communicating productively with internal IT teams ($250/seat, $225/seat for teams of 3+, breakfast, recording & shared folder included).\n\nReserving a seat is free. Once 40 seats are claimed, the session locks and everyone who reserved gets a 48-hour priority booking window before general release.\n\nHere is the link to check it out: ${shareUrl}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const remaining = Math.max(0, 40 - stats.totalCount);

  return (
    <div className="min-h-[calc(100vh-140px)] py-12 md:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-6 sm:px-8">
        {/* Back Link */}
        <button
          id="confirmation-back-btn"
          onClick={onBackToLanding}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#00AECC] mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Workshop Overview</span>
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden text-center">
          {/* Brand Logo */}
          <div className="flex justify-center mb-6">
            <a href="https://www.mosaic-data.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/assets/mosaic-logo.png"
                alt="Mosaic Data Solutions"
                className="h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Decorative icon */}
          <div className="w-16 h-16 bg-cyan-50 rounded-2xl flex items-center justify-center mx-auto mb-5 text-[#00AECC] border border-cyan-100">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
            Priority Seat Reserved
          </span>

          <h1
            className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Thank you, {signup.full_name}!
          </h1>

          <p className="text-base text-slate-600 max-w-lg mx-auto mb-8">
            Your seat is reserved for the <strong className="text-slate-900">Thursday, October 15 (9:00 AM - Noon)</strong> session representing{' '}
            <span className="font-semibold text-slate-900">{signup.company}</span> at{' '}
            <a
              href="https://www.frequencycoworking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AECC] font-semibold underline hover:text-[#0099b3] inline-flex items-center gap-1"
            >
              <span>Frequency Coworking</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>{' '}
            (3249 Quality Drive, Rancho Cordova, CA 95670).
          </p>

          {/* Position Showcase Callout */}
          <div className="max-w-md mx-auto bg-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-md border border-slate-800 mb-8">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Your Priority Flight Deck Position
            </div>
            <div className="text-4xl sm:text-5xl font-black font-heading text-white mb-2">
              #{position} <span className="text-lg font-normal text-slate-400">on the reservation list</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Based on our current count of <strong className="text-white">{stats.totalCount}</strong> regional reservations across Sacramento, Yolo, Placer, and Nevada counties.
            </p>
          </div>

          {/* Core Explanation Callout */}
          <div className="mb-8 p-4 rounded-2xl bg-cyan-50/80 border border-cyan-200 text-slate-800 text-sm font-medium leading-relaxed max-w-lg mx-auto">
            Once 40 seats are claimed, the session locks and you'll get your 48-hour priority booking link before anyone else can grab a seat.
          </div>

          {/* What Happens Next Explanation */}
          <div className="text-left bg-slate-50 rounded-2xl p-6 sm:p-7 border border-slate-200 mb-8 space-y-4">
            <h3
              className="text-sm font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              <Sparkles className="w-4 h-4 text-[#00AECC]" />
              What Happens Next
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 text-[#00AECC] font-bold inline-flex items-center justify-center mb-2 border border-cyan-100">
                  1
                </span>
                <p className="font-bold text-slate-900 mb-1">40 Seats Claimed</p>
                <p className="text-slate-500">
                  {remaining === 0
                    ? 'Session locked! Priority booking links being distributed.'
                    : `${remaining} more reservations needed to lock the October 15 session.`}
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 text-[#00AECC] font-bold inline-flex items-center justify-center mb-2 border border-cyan-100">
                  2
                </span>
                <p className="font-bold text-slate-900 mb-1">Priority Booking Link</p>
                <p className="text-slate-500">
                  Mosaic will email <span className="font-medium text-slate-900">{signup.email}</span> with your private 48-hour priority booking link before general public release.
                </p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
                <span className="w-6 h-6 rounded-lg bg-cyan-50 text-[#00AECC] font-bold inline-flex items-center justify-center mb-2 border border-cyan-100">
                  3
                </span>
                <p className="font-bold text-slate-900 mb-1">Confirm and Pay</p>
                <p className="text-slate-500">
                  Confirm your ticket at $250 ($225/seat for teams of 3+) with breakfast, recording, and shared folder included. No payment is collected until the session locks.
                </p>
              </div>
            </div>
          </div>

          {/* Selected Billing Method & Procurement Details */}
          <div className="text-left bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-8 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Payment Method Preference
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  {signup.payment_preference === 'invoice_po' ? (
                    <>
                      <FileText className="w-4 h-4 text-purple-600" />
                      <span className="font-bold text-slate-900 text-sm">State Agency / Purchase Order (Net 30)</span>
                    </>
                  ) : signup.payment_preference === 'team_billing' ? (
                    <>
                      <Users className="w-4 h-4 text-emerald-600" />
                      <span className="font-bold text-slate-900 text-sm">
                        Team Combined Billing ({signup.seat_count || 3} Seats at $225/seat)
                      </span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4 text-[#00AECC]" />
                      <span className="font-bold text-slate-900 text-sm">Credit Card / Cal-Card ($250/seat)</span>
                    </>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPacketOpen(true)}
                className="px-3 py-1.5 rounded-lg border border-[#00AECC] text-[#00AECC] hover:bg-cyan-50 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>State STD 697 &amp; W-9 Packet</span>
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {signup.payment_preference === 'invoice_po'
                ? 'Your organization will be invoiced on Net 30 terms once the session locks. If your agency requires Form STD 697 or a vendor W-9 packet to issue a Purchase Order, click the button above to copy the pre-formatted text or download the documentation.'
                : signup.payment_preference === 'team_billing'
                ? `Mosaic will prepare a single combined invoice for your team of ${signup.seat_count || 3} participants with the bulk rate ($225/seat) once the session locks.`
                : 'You will receive a direct online credit card / Cal-Card payment link during your 48-hour priority window. No payment has been charged today.'}
            </p>
          </div>

          {/* Share Prompt */}
          <div className="border-t border-slate-100 pt-8">
            <h3
              className="text-base font-bold text-slate-900 mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Know someone else in your org who should be here?
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mb-6 max-w-lg mx-auto">
              Help us lock the October 15 session faster. Send them this link or share with your team leads and colleagues.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto mb-6">
              <div className="w-full flex items-center bg-slate-50 rounded-xl px-3 py-2 border border-slate-200 text-xs text-slate-600 truncate">
                <span className="truncate">{shareUrl}</span>
              </div>

              <button
                id="copy-share-link-btn"
                onClick={handleCopyLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#00AECC] hover:bg-[#0099b3] text-white font-bold text-xs uppercase tracking-wide shadow-md shadow-cyan-200/50 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-semibold text-slate-500">
              <button
                onClick={handleShareEmail}
                className="inline-flex items-center gap-1.5 hover:text-[#00AECC] transition-colors"
              >
                <Mail className="w-4 h-4" />
                <span>Share via Email</span>
              </button>
              <span className="text-slate-300">•</span>
              <button
                onClick={handleShareLinkedIn}
                className="inline-flex items-center gap-1.5 hover:text-[#00AECC] transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share on LinkedIn</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer info strip */}
        <div className="mt-8 text-center text-xs text-slate-500">
          Have questions or want to inquire about bringing this workshop directly to your team? Contact Mosaic at{' '}
          <a href="https://mosaic-data.com" target="_blank" rel="noopener noreferrer" className="text-[#00AECC] underline">
            mosaic-data.com
          </a>.
        </div>
      </div>

      {/* State Justification & Procurement Packet Modal */}
      <JustificationPacketModal
        isOpen={isPacketOpen}
        onClose={() => setIsPacketOpen(false)}
      />
    </div>
  );
};
