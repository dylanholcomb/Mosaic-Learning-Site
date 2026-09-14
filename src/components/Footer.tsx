import React from 'react';
import { ExternalLink, Shield, MapPin, Globe } from 'lucide-react';

interface FooterProps {
  onAdminClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminClick }) => {
  return (
    <footer className="bg-slate-100 text-slate-600 pt-12 pb-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-200">
          {/* Brand & Overview */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center gap-3">
              <a
                href="https://www.mosaic-data.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block group"
              >
                <img
                  src="/assets/mosaic-logo.png"
                  alt="Mosaic Data Solutions"
                  className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </a>
              <div className="border-l border-slate-300 pl-3">
                <span
                  className="text-xs font-bold uppercase tracking-widest text-[#00AECC] block"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  Learning Division
                </span>
                <span
                  className="text-sm font-bold text-slate-800 tracking-tight"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  The Accidental AI Champion
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-600 max-w-md leading-relaxed">
              Mosaic Data Solutions delivers Microsoft ecosystem services, data integration, and applied AI enablement for California state agencies and regional enterprises.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
              <a
                href="https://www.frequencycoworking.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-slate-700 hover:text-[#00AECC] transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-[#00AECC]" />
                <span className="font-medium">Frequency Coworking:</span>
                <span>3249 Quality Drive, Rancho Cordova, CA 95670</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://www.mosaic-data.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[#00AECC] hover:underline font-medium"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>www.mosaic-data.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Offerings & Programs */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Mosaic Learning Offerings
            </h4>
            <ul className="space-y-2 text-slate-500">
              <li className="text-slate-800 font-medium">
                * The Accidental AI Champion (Adults)
                <span className="block text-[11px] text-slate-500 pl-2">
                  3-hr workshop at Frequency Coworking
                </span>
              </li>
              <li>
                * AI Safety &amp; Habits (Grades 7-12)
                <span className="block text-[11px] text-slate-500 pl-2">
                  Delivered by Amy Pisarsky at schools
                </span>
              </li>
              <li>
                * Executive Strategy &amp; Pilot Advisory
              </li>
            </ul>
          </div>

          {/* Quick Links & Admin */}
          <div className="md:col-span-3 space-y-2 text-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Navigation &amp; Portals
            </h4>
            <ul className="space-y-1.5 text-slate-500">
              <li>
                <a href="#who-its-for" className="hover:text-[#00AECC] transition-colors">
                  Who It's For
                </a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-[#00AECC] transition-colors">
                  Why Listen to Us
                </a>
              </li>
              <li>
                <a href="#outcomes" className="hover:text-[#00AECC] transition-colors">
                  What You'll Learn
                </a>
              </li>
              <li>
                <a href="#logistics" className="hover:text-[#00AECC] transition-colors">
                  Rancho Cordova Logistics
                </a>
              </li>
              <li>
                <a href="#progress" className="hover:text-[#00AECC] transition-colors">
                  How Seating Works (40 Seats)
                </a>
              </li>
              <li className="pt-1">
                <button
                  onClick={onAdminClick}
                  className="text-slate-600 hover:text-[#00AECC] transition-colors flex items-center gap-1.5 font-semibold"
                >
                  <Shield className="w-3.5 h-3.5 text-[#00AECC]" />
                  <span>Admin Portal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright and disclaimers */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 flex-wrap">
            <a
              href="https://www.frequencycoworking.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 hover:text-[#00AECC] font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>Frequency Coworking</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <span>: 3249 Quality Drive, Rancho Cordova, CA 95670 (In-Person Only)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Official program of</span>
            <a
              href="https://www.mosaic-data.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#00AECC] font-semibold hover:underline flex items-center gap-1"
            >
              <span>Mosaic Data Solutions</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
