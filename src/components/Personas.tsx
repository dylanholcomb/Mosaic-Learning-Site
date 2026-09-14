import React from 'react';
import { UserCheck, Briefcase, Cpu, Check, AlertCircle } from 'lucide-react';

interface PersonasProps {
  onJoinClick?: () => void;
}

export const Personas: React.FC<PersonasProps> = ({ onJoinClick }) => {
  const personas = [
    {
      id: 'persona-1',
      badge: 'Persona 01',
      tagline: 'The "Accidental" AI Lead',
      headline: 'Informally charged with "making AI happen"',
      description:
        'You demoed an AI tool to your department, and suddenly became the unofficial point-person for team workflows.',
      friction: 'Unsure how to channel team enthusiasm into safe, repeatable processes.',
      focus: 'Moving from ad-hoc prompt tinkering to structured organizational capability.',
      icon: UserCheck,
    },
    {
      id: 'persona-2',
      badge: 'Persona 02',
      tagline: 'The Manager & Team Lead',
      headline: 'Getting an AI project approved & off the ground',
      description:
        'You identified an operational bottleneck AI can solve, but need executive sponsorship and budget.',
      friction: 'Balancing leadership expectations with realistic implementation boundaries.',
      focus: 'Scoping practical pilots, proving measurable ROI, and securing green lights.',
      icon: Briefcase,
    },
    {
      id: 'persona-3',
      badge: 'Persona 03',
      tagline: 'The Bridge to IT',
      headline: 'Working productively with a cautious IT team',
      description:
        'Your IT and infosec teams are understandably protective of data security, compliance, and vendor risk.',
      friction: 'Pilots stalling in review committees because teams speak different languages.',
      focus: 'Security checklists, compliance vocabulary, and turning IT into an active ally.',
      icon: Cpu,
    },
  ];

  return (
    <section id="who-its-for" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
            Target Audience
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            Who This Workshop Is Built For
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            No coding or technical degree needed: just the organizational acumen, framing, and communication toolkit to drive real adoption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.id}
                id={persona.id}
                className="flex flex-col bg-white rounded-xl p-6 sm:p-7 border border-slate-200 shadow-sm hover:border-[#00AECC] transition-all"
              >
                <div className="flex items-center justify-between mb-5">
                  <span className="text-xs font-bold tracking-wider uppercase text-slate-400 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
                    {persona.badge}
                  </span>
                  <div className="w-9 h-9 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00AECC]">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <p className="text-xs font-bold text-[#00AECC] uppercase tracking-wider mb-1">
                  {persona.tagline}
                </p>
                <h3
                  className="text-xl font-bold text-slate-900 mb-3 leading-snug"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {persona.headline}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  {persona.description}
                </p>

                <div className="mt-auto pt-4 border-t border-slate-100 space-y-3 text-xs">
                  <div>
                    <span className="font-semibold text-slate-800 block mb-0.5">The Friction:</span>
                    <span className="text-slate-500 leading-normal">{persona.friction}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-[#00AECC] block mb-0.5">What You Master:</span>
                    <span className="text-slate-700 font-medium leading-normal">{persona.focus}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
