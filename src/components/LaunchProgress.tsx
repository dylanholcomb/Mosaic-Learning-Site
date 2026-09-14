import React from 'react';
import { Target, Users, CalendarCheck, CheckCircle2, Info, ArrowUpRight, ExternalLink } from 'lucide-react';
import { WaitlistStats } from '../types.ts';

interface LaunchProgressProps {
  stats: WaitlistStats;
  onJoinClick: () => void;
}

export const LaunchProgress: React.FC<LaunchProgressProps> = ({ stats, onJoinClick }) => {
  const percentage = Math.min(100, Math.round((stats.totalCount / 40) * 100));
  const remaining = Math.max(0, 40 - stats.totalCount);

  return (
    <section id="progress" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
            {/* Header tag */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest bg-slate-800 text-[#00AECC] border border-slate-700">
                <Target className="w-3.5 h-3.5 text-[#00AECC]" />
                How Seating Works
              </span>
              <a
                href="https://www.frequencycoworking.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-[#00AECC] font-medium inline-flex items-center gap-1 transition-colors"
              >
                <span>Thursday, October 15 (9:00 AM - Noon) | Frequency Coworking (Rancho Cordova)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Core requirement heading and explainer */}
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Seats Reserving Now
            </h2>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed mb-6">
              Reserving is free. Once 40 seats are claimed, the session locks and everyone with a reservation gets a 48-hour priority window to confirm at $250 ($225/seat for teams of 3+). No payment until session locks.
            </p>

            {/* Live progress gauge */}
            <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-extrabold font-heading text-white">
                      {stats.totalCount}
                    </span>
                    <span className="text-xl sm:text-2xl font-bold text-slate-400">
                      of 40 seats reserved
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-[#00AECC] ml-2">
                      ({percentage}% to lock)
                    </span>
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <span className="text-xs text-slate-400 block font-medium">Room Capacity</span>
                  <span className="text-sm font-bold text-slate-200">150 Seats Max</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700 mt-3">
                <div
                  className="h-full bg-[#00AECC] transition-all duration-700"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              {/* Milestone Indicators */}
              <div className="flex items-center justify-between text-xs text-slate-400 mt-2.5 font-medium">
                <span>0 Reserved</span>
                <span className="text-[#00AECC] font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00AECC] animate-pulse" />
                  40: Session Locks
                </span>
                <span>150: Room Cap</span>
              </div>
            </div>

            {/* Status Callout and Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-3 text-sm text-slate-300">
                <div className="w-9 h-9 rounded-xl bg-cyan-950/60 border border-cyan-800/60 flex items-center justify-center text-[#00AECC] shrink-0">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">
                    {stats.hasMetThreshold
                      ? 'Session locked! 48-hour priority confirmation links are active.'
                      : 'Free reservation: locks in your spot before public release.'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Pay nothing today. Confirmations sent when threshold is reached.
                  </p>
                </div>
              </div>

              <button
                id="progress-cta-btn"
                onClick={onJoinClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#00AECC] hover:bg-[#0099b3] text-white font-bold text-xs uppercase tracking-wide transition-all shadow-md shrink-0 cursor-pointer"
              >
                <span>Reserve Your Seat</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
