import React from 'react';
import { ShieldCheck, Compass, Award, Building2, Landmark, HeartHandshake } from 'lucide-react';

interface WhyUsProps {
  onJoinClick?: () => void;
}

export const WhyUs: React.FC<WhyUsProps> = ({ onJoinClick }) => {
  return (
    <section id="why-us" className="py-14 sm:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
            Instructors &amp; Credibility
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Why listen to us?
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We have sat in both chairs: the one you are in, and the one you are trying to move.
          </p>
        </div>

        {/* Two-Card Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          {/* Card 1: Mike Pisarsky */}
          <div className="flex flex-col bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm hover:border-[#00AECC] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                18+ Years IT Architecture
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00AECC]">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs font-bold text-[#00AECC] uppercase tracking-wider mb-1">
              Mike Pisarsky
            </p>
            <h3
              className="text-lg font-bold text-slate-900 mb-2 leading-snug"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              This Guy Says No For A Living
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              Mike spent ten years as Lead Architect for the California Department of Public Health (CDPH), deciding which technology initiatives were approved, modified, or stopped. Having delivered solutions across 76 California state agencies, he teaches you how to present AI initiatives so internal IT and infosec teams actively back them.
            </p>

            <div className="mt-auto pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold text-slate-900">Background:</span>
                <span>Former Lead Architect, CA Dept. of Public Health (CDPH)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold text-[#00AECC]">Focus:</span>
                <span>Security guardrails, compliance, and winning IT alignment</span>
              </div>
            </div>
          </div>

          {/* Card 2: Dylan Holcomb */}
          <div className="flex flex-col bg-slate-50 rounded-xl p-6 border border-slate-200 shadow-sm hover:border-[#00AECC] transition-all">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-400 bg-white px-2.5 py-1 rounded-md border border-slate-200">
                20+ Years Enablement &amp; Ops
              </span>
              <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00AECC]">
                <Compass className="w-4 h-4" />
              </div>
            </div>

            <p className="text-xs font-bold text-[#00AECC] uppercase tracking-wider mb-1">
              Dylan Holcomb
            </p>
            <h3
              className="text-lg font-bold text-slate-900 mb-2 leading-snug"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              The Champion With The Title And None Of The Authority
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed mb-5">
              With 20 years in public and private sector enablement, Dylan builds automation platforms and leads AI product development at Mosaic. Having trained staff and leadership across state agencies, he specializes in scoping realistic pilots, overcoming organizational inertia, and managing up to leadership.
            </p>

            <div className="mt-auto pt-3 border-t border-slate-200 space-y-1.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold text-slate-900">Background:</span>
                <span>Workforce enablement lead &amp; Mosaic AI product lead</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <span className="font-semibold text-[#00AECC]">Focus:</span>
                <span>Managing up and down, pilot scoping, and executive communication</span>
              </div>
            </div>
          </div>
        </div>

        {/* Proof Strip (3 Stat Tiles) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Track Record</span>
              <Award className="w-4 h-4 text-[#00AECC]" />
            </div>
            <div
              className="text-2xl sm:text-3xl font-extrabold text-[#00AECC] mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              18+ years
            </div>
            <p className="text-xs text-slate-600">
              Architecting systems for California public sector and enterprise.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Client Base</span>
              <Building2 className="w-4 h-4 text-[#00AECC]" />
            </div>
            <div
              className="text-2xl sm:text-3xl font-extrabold text-[#00AECC] mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              100+
            </div>
            <p className="text-xs text-slate-600">
              Public sector organizations served across California and beyond.
            </p>
          </div>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">State Agency Reach</span>
              <Landmark className="w-4 h-4 text-[#00AECC]" />
            </div>
            <div
              className="text-2xl sm:text-3xl font-extrabold text-[#00AECC] mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              76
            </div>
            <p className="text-xs text-slate-600">
              California state agencies supported in cloud &amp; enterprise rollouts.
            </p>
          </div>
        </div>

        {/* Closer Line Box */}
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-white p-1.5 rounded-lg border border-slate-200 shadow-xs shrink-0 flex items-center justify-center">
              <img
                src="/assets/lq-logo.svg"
                alt="LQ Listening Intelligence"
                className="h-6 w-auto object-contain"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              We also build <strong>LQ Listening Intelligence</strong>, an AI platform for coaching &amp; organizational development (Platinum Sponsor, 2026 NYU Coaching &amp; Technology Summit). We ship applied AI daily in your regional market.
            </p>
          </div>
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 text-xs text-slate-500">
            <HeartHandshake className="w-3.5 h-3.5 text-[#00AECC] shrink-0" />
            <span>
              Rancho Cordova locals: when a nearby nonprofit needed a custom scheduling app, we built it pro bono.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
