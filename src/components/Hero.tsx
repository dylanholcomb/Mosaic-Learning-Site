import React from 'react';
import { ArrowRight, MapPin, Clock, Coffee, Award, UserCheck, Briefcase, Cpu, ExternalLink, Calendar } from 'lucide-react';
import { WaitlistStats } from '../types.ts';

interface HeroProps {
  stats: WaitlistStats;
  onJoinClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ stats, onJoinClick }) => {
  const percentage = Math.min(100, Math.round((stats.totalCount / 40) * 100));
  const remaining = Math.max(0, 40 - stats.totalCount);

  return (
    <section className="relative pt-10 pb-16 md:pt-16 md:pb-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="space-y-8">
          {/* Top Tag & Main Display */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
                <span className="w-2 h-2 rounded-full bg-[#46B959]"></span>
                The Accidental AI Champion
              </span>
              <a
                href="https://www.mosaic-data.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#00AECC] transition-colors"
              >
                <span>Presented by Mosaic Data Solutions</span>
                <ExternalLink className="w-3 h-3 text-[#00AECC]" />
              </a>
            </div>

            <div className="space-y-3">
              <h1
                className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold leading-tight tracking-tight text-slate-900"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                You got handed &apos;make AI happen&apos;
              </h1>

              <p
                className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Become the <span className="text-[#00AECC]">AI Champion</span> Your Organization Needs.
              </p>

              {/* Confirmed Date Line Styled to Stand Out */}
              <div className="pt-1">
                <div className="inline-flex flex-wrap items-center gap-2 px-4 py-2 rounded-xl bg-cyan-50 border border-cyan-200/80 text-[#00AECC] font-bold text-sm sm:text-base shadow-2xs">
                  <Calendar className="w-4 h-4 text-[#00AECC] shrink-0" />
                  <span>Thursday, October 15</span>
                  <span className="text-cyan-300 font-normal">|</span>
                  <Clock className="w-4 h-4 text-[#00AECC] shrink-0" />
                  <span>9:00 AM - Noon</span>
                  <span className="text-cyan-300 font-normal">|</span>
                  <a
                    href="https://www.frequencycoworking.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 underline underline-offset-2 hover:text-[#0099b3] transition-colors"
                  >
                    <span>Frequency Coworking</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                  <span className="text-cyan-800 font-normal text-xs sm:text-sm">(3249 Quality Drive, Rancho Cordova, CA 95670)</span>
                </div>
              </div>
            </div>

            <p className="text-lg text-slate-600 max-w-2xl leading-relaxed font-normal pt-1">
              A practical 3-hour in-person workshop equipping you to champion AI initiatives, align executive leadership, and partner productively with internal IT.
            </p>
          </div>

          {/* Action Row */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-4">
              <button
                id="hero-join-waitlist-btn"
                onClick={onJoinClick}
                className="inline-flex items-center justify-center gap-2 bg-[#00AECC] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-cyan-200/50 hover:bg-[#0099b3] transition-colors uppercase tracking-wide text-sm cursor-pointer"
              >
                <span>Reserve Your Seat</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#who-its-for"
                className="inline-flex items-center justify-center gap-2 bg-white text-slate-700 font-semibold px-6 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm shadow-xs"
              >
                <span>Who This Is For</span>
              </a>
            </div>

            {/* Reassurance line directly near CTA */}
            <p className="text-xs text-slate-500 font-medium pt-1">
              Free reservation. Confirm and pay once the 40-seat session locks.
            </p>
          </div>

          {/* 3 Geometric Balance Persona Preview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[#00AECC] mb-2">
                <UserCheck className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm mb-1 text-slate-900">The Lead</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Charged with making AI happen at the office.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[#00AECC] mb-2">
                <Briefcase className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm mb-1 text-slate-900">The Manager</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Getting projects approved and off the ground.
              </p>
            </div>

            <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
              <div className="text-[#00AECC] mb-2">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="font-bold text-sm mb-1 text-slate-900">The Bridge</h4>
              <p className="text-xs text-slate-500 leading-tight">
                Communicating with cautious IT teams.
              </p>
            </div>
          </div>

          {/* High-Contrast Launch Progress Box */}
          <div className="bg-slate-900 text-white p-6 sm:p-7 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-slate-800 shadow-md">
            <div className="space-y-1">
              <div className="text-xs uppercase tracking-widest text-slate-400 font-semibold">
                Seats Reserving Now
              </div>
              <div className="text-2xl font-bold">
                {stats.totalCount}{' '}
                <span className="text-slate-400 font-normal text-lg">
                  of 40 seats reserved
                </span>
              </div>
              <p className="text-xs text-slate-400">
                When we hit 40, the October 15 session locks and reservations get 48-hour priority booking.
              </p>
            </div>

            <div className="w-full md:w-1/2 space-y-2">
              <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div
                  className="h-full bg-[#00AECC] transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                <span>{percentage}% to session lock</span>
                <span>Room Capacity: 150 Seats</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
