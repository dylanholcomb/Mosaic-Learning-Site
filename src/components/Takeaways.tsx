import React from 'react';
import { Compass, GitMerge, ShieldAlert, Network, CheckCircle2, FileText, Share2, Layers } from 'lucide-react';

export const Takeaways: React.FC = () => {
  const outcomes = [
    {
      id: 'takeaway-1',
      title: 'The "Managing Up & Down" Playbook',
      subtitle: 'Align executive expectations and empower frontline contributors',
      bullets: [
        'Executive one-pager demystifying AI capabilities vs. hype',
        'Staff rollout guide emphasizing human-in-the-loop workflows',
        'Proven responses to "Why can\'t AI just do this tomorrow?"',
      ],
      icon: Compass,
      tag: 'Leadership Alignment',
    },
    {
      id: 'takeaway-2',
      title: 'Scoping Your First AI Project',
      subtitle: 'Identify high-value, low-risk pilot opportunities that actually ship',
      bullets: [
        '4-quadrant feasibility vs. business-impact prioritization grid',
        '30-day pilot project charter template with measurable deliverables',
        'Criteria to prevent endless proof-of-concept churn',
      ],
      icon: Layers,
      tag: 'Project Execution',
    },
    {
      id: 'takeaway-3',
      title: 'Language & Tactics for IT Conversations',
      subtitle: 'Turn internal security, legal, and IT into active allies',
      bullets: [
        'Pre-vetted data privacy and security questionnaire for AI tools',
        'How to address SOC2, data sovereignty, and model training opt-outs',
        'Collaborative framing that treats IT as co-designers',
      ],
      icon: ShieldAlert,
      tag: 'IT & Security Governance',
    },
    {
      id: 'takeaway-4',
      title: 'Sacramento-Area AI Champions Network',
      subtitle: 'Long-term peer relationships with regional practitioners',
      bullets: [
        'Direct cohort directory for peer consults across Sacramento, Placer, and Yolo',
        'Invitations to follow-up roundtables and case-study reviews',
        'Shared library of local public and private sector learnings',
      ],
      icon: Network,
      tag: 'Local Ecosystem',
    },
  ];

  return (
    <section id="outcomes" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
            Concrete Deliverables
          </span>
          <h2
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2 mb-2"
            style={{ fontFamily: "'Montserrat', sans-serif" }}
          >
            What You’ll Walk Away With
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Leave Rancho Cordova with working templates, tested playbooks, and the exact language needed to move projects forward.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {outcomes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm hover:border-[#00AECC] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-cyan-50 text-[#00AECC] border border-cyan-100">
                      {item.tag}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#00AECC]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3
                    className="text-lg font-bold text-slate-900 mb-1"
                    style={{ fontFamily: "'Montserrat', sans-serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#00AECC] mb-4">
                    {item.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-2">
                  {item.bullets.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-[#00AECC] shrink-0 mt-0.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
