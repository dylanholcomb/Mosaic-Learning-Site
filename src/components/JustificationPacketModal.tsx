import React, { useState } from 'react';
import { X, Copy, Check, FileText, Download, Building2, CreditCard, Award, CheckCircle2, Mail, ExternalLink, Printer } from 'lucide-react';

interface JustificationPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JustificationPacketModal: React.FC<JustificationPacketModalProps> = ({
  isOpen,
  onClose,
}: JustificationPacketModalProps) => {
  const [activeTab, setActiveTab] = useState<'std697' | 'vendor' | 'syllabus'>('std697');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const std697SampleText = `COURSE TITLE: The Accidental AI Champion: Applied AI Enablement & Leadership
SESSION DATE & TIME: Thursday, October 15 | 9:00 AM - 12:00 PM (Noon) (3.0 Hours In-Person)
VENUE: Frequency Coworking, 3249 Quality Drive, Rancho Cordova, CA 95670
VENDOR: Mosaic Data Solutions Inc. (Rancho Cordova, CA)
TUITION: $250.00 per participant ($225.00/seat for teams of 3+)
INCLUDES: Continental breakfast, session workbook, prompt governance templates, post-session HD video recording, and collaborative peer cohort access.

TRAINING OBJECTIVE & JUSTIFICATION FOR STATE / PUBLIC ENTITY:
This 3-hour applied workshop equips department leaders, analysts, and project managers charged with implementing or evaluating generative AI tools. Participants gain structured frameworks to:
1. Translate executive AI mandates into actionable, compliant departmental workflows.
2. Evaluate privacy, security, and data governance considerations relevant to California state and public sector policies.
3. Establish defensible prompt standards and audit trails across Microsoft ecosystem and commercial AI tooling.
4. Lead cross-functional AI adoption across technical and non-technical staff without requiring extensive software engineering backgrounds.

PROCUREMENT & PAYMENT:
- Cal-Card / P-Card accepted via secure online checkout.
- State agency Purchase Orders / Net 30 invoicing accepted with completed Form W-9 on file.
- Vendor contact: Mosaic Data Solutions | dylan@mosaic-data.com`;

  const handleCopy = () => {
    navigator.clipboard.writeText(std697SampleText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#00AECC]/20 border border-[#00AECC]/40 flex items-center justify-center text-[#00AECC]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                Training Justification &amp; Vendor Packet
              </h3>
              <p className="text-xs text-slate-400">
                California State Agency (STD 697), County, and Corporate Procurement Guide
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('std697')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'std697'
                ? 'border-[#00AECC] text-[#00AECC] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>STD 697 Justification</span>
          </button>
          <button
            onClick={() => setActiveTab('vendor')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'vendor'
                ? 'border-[#00AECC] text-[#00AECC] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Vendor &amp; W-9 Info</span>
          </button>
          <button
            onClick={() => setActiveTab('syllabus')}
            className={`px-4 py-2.5 rounded-t-lg transition-colors border-b-2 flex items-center gap-1.5 ${
              activeTab === 'syllabus'
                ? 'border-[#00AECC] text-[#00AECC] bg-white font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Agenda &amp; Deliverables</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-slate-700 text-sm">
          {activeTab === 'std697' && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-cyan-50 border border-cyan-200 text-xs text-slate-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#00AECC] shrink-0 mt-0.5" />
                <p>
                  <strong>For California State Employees:</strong> Copy the pre-formatted text below directly into your internal training request form (such as Form STD 697) or departmental training approval portal.
                </p>
              </div>

              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap overflow-x-auto border border-slate-800">
                  {std697SampleText}
                </pre>
                <button
                  onClick={handleCopy}
                  className="absolute top-3 right-3 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium flex items-center gap-1.5 transition-colors border border-slate-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Text</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {activeTab === 'vendor' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Vendor Entity</span>
                  <p className="font-bold text-slate-900">Mosaic Data Solutions Inc.</p>
                  <p className="text-xs text-slate-600">Rancho Cordova, CA</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Form W-9</span>
                  <p className="font-bold text-slate-900">Signed 2026 W-9 on File</p>
                  <p className="text-xs text-slate-600">Dispatched upon reservation lock or invoice request</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cal-Card &amp; Credit Cards</span>
                  <p className="font-bold text-slate-900">Instant Online Checkout</p>
                  <p className="text-xs text-slate-600">Visa, MasterCard, Amex, and government P-Cards accepted</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Agency Purchase Orders</span>
                  <p className="font-bold text-slate-900">Net 30 Invoicing</p>
                  <p className="text-xs text-slate-600">Itemized invoices issued with matching PO numbers</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200 text-xs space-y-2">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-[#00AECC]" />
                  <span>How Payment Is Executed</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  No payment is due today. When the 40-seat session locks, Mosaic dispatches a personalized 48-hour priority link. State employees who selected <strong>Agency Invoice / PO</strong> will receive an invoice and W-9 ready for their accounting department. Attendees who selected <strong>Cal-Card</strong> receive a 1-click payment receipt link.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'syllabus' && (
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Hour 1: The Landscape &amp; Policy Demystified</h4>
                    <span className="text-xs font-semibold text-[#00AECC] bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">Part 1</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Separating generative AI hype from functional reality. Understanding where AI models excel, where they fail, and navigating state/public sector guidelines on data custody, privacy, and responsible use.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Hour 2: Prompt Craft &amp; Departmental Workflow Sprints</h4>
                    <span className="text-xs font-semibold text-[#00AECC] bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">Part 2</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Practical, hands-on roleplay with real administrative datasets. Drafting defensible prompts for policy summaries, technical requirements, public memos, and executive briefs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900">Hour 3: Change Leadership &amp; Pilot Scoping</h4>
                    <span className="text-xs font-semibold text-[#00AECC] bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">Part 3</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    How to champion AI without formal authority: managing up to executive leadership, reassuring skeptical peers, partnering smoothly with IT security, and measuring prototype impact.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-100 text-slate-700 text-xs flex items-center justify-between gap-4">
                <span>Tuition: $250 / seat ($225 / seat for 3+ attendees)</span>
                <span className="font-medium text-slate-900">Thursday, Oct 15 (9:00 AM - Noon) | Rancho Cordova</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-4 py-2 rounded-xl bg-[#00AECC] text-white text-xs font-bold hover:bg-[#0099b3] transition-colors flex items-center gap-1.5 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Copied to Clipboard</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy STD 697 Text</span>
                </>
              )}
            </button>
            <a
              href="mailto:dylan@mosaic-data.com?subject=W-9%20and%20Invoice%20Request%20-%20The%20Accidental%20AI%20Champion"
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5 text-[#00AECC]" />
              <span>Email Dylan for W-9 / Quote</span>
            </a>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-300 transition-colors"
          >
            Close Packet
          </button>
        </div>
      </div>
    </div>
  );
};
