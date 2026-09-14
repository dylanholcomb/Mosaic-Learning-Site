import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface MidpageCTAProps {
  onJoinClick: () => void;
}

export const MidpageCTA: React.FC<MidpageCTAProps> = ({ onJoinClick }) => {
  return (
    <section className="py-10 bg-slate-900 text-white border-y border-slate-800">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00AECC]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Priority Seating</span>
            </div>
            <h3
              className="text-xl sm:text-2xl font-extrabold text-white"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Ready to claim your seat for October 15?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Free reservation. No upfront payment required until the 40-seat session locks.
            </p>
          </div>

          <button
            id="midpage-reserve-seat-btn"
            onClick={onJoinClick}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-[#00AECC] hover:bg-[#0099b3] text-white font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-cyan-950/40 transition-colors uppercase tracking-wide text-xs cursor-pointer"
          >
            <span>Reserve Your Seat</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
