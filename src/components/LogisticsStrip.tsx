import React from 'react';
import { Clock, MapPin, Coffee, Tag, Video, Sparkles, CheckCircle, Users, ExternalLink } from 'lucide-react';

export const LogisticsStrip: React.FC = () => {
  const details = [
    {
      icon: Clock,
      title: '9:00 AM - Noon',
      desc: '3-hour interactive morning workshop. Breakfast & coffee service starts at 8:30 AM.',
    },
    {
      icon: MapPin,
      title: 'Rancho Cordova, CA',
      desc: 'Frequency Coworking: 3249 Quality Drive. Free parking and direct Highway 50 access.',
      link: 'https://www.frequencycoworking.com/',
      linkText: 'frequencycoworking.com',
    },
    {
      icon: Coffee,
      title: 'Breakfast Included',
      desc: 'Fresh coffee, teas, pastries, fruit, and peer networking before kickoff.',
    },
    {
      icon: Tag,
      title: '$250 Per Seat',
      desc: '$225/seat for teams of 3+. Free reservation; pay only after session locks.',
    },
    {
      icon: Video,
      title: 'Recording & Folder',
      desc: 'Full HD session video, slide deck, and downloadable execution templates.',
    },
  ];

  return (
    <section id="logistics" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
              Session Logistics
            </span>
            <h2
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              Key Details
            </h2>
          </div>
          <div className="text-xs sm:text-sm text-slate-500">
            Thursday, October 15 | 9:00 AM - Noon | Frequency Coworking, Rancho Cordova
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {details.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col hover:border-[#00AECC] transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00AECC] mb-3">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed flex-1">{item.desc}</p>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#00AECC] hover:underline"
                  >
                    <span>{item.linkText}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
