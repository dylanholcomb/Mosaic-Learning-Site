import React, { useState, useMemo } from 'react';
import {
  Download,
  Users,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Building,
  MapPin,
  RefreshCw,
  Clock,
  Briefcase,
  Mail,
  ChevronRight,
  ExternalLink,
  Target,
  LogOut,
  UserCheck,
  UserPlus,
  CreditCard,
  FileText,
  FileSpreadsheet,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { WaitlistSignup, WaitlistStats, County, BillingStatus, PaymentPreference } from '../types.ts';
import {
  exportSignupsToCsv,
  exportSignupsToExcel,
  adminLogout,
  updateSignupBillingStatus,
} from '../services/waitlistService.ts';
import { JustificationPacketModal } from './JustificationPacketModal.tsx';

interface AdminViewProps {
  signups: WaitlistSignup[];
  stats: WaitlistStats;
  onRefresh: () => void;
  onBackToLanding: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  signups,
  stats,
  onRefresh,
  onBackToLanding,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'confirmed' | 'prospect'>('all');
  const [selectedPayment, setSelectedPayment] = useState<'all' | PaymentPreference>('all');
  const [selectedBillingStatus, setSelectedBillingStatus] = useState<'all' | BillingStatus>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPacketOpen, setIsPacketOpen] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 400);
  };

  const handleSignOut = async () => {
    await adminLogout();
    onBackToLanding();
  };

  const handleStatusChange = async (id: string, newStatus: BillingStatus) => {
    setStatusUpdatingId(id);
    try {
      // 1. Update client-side state
      updateSignupBillingStatus(id, newStatus);

      // 2. Try server update
      const token = sessionStorage.getItem('mosaic_admin_session_token') || 'local_admin_bypass_token';
      await fetch(`/api/admin/signups/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ billing_status: newStatus }),
      }).catch(() => null);

      await onRefresh();
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const confirmedCount = useMemo(
    () => signups.filter((s) => s.is_confirmed).length,
    [signups]
  );
  const prospectCount = useMemo(
    () => signups.length - confirmedCount,
    [signups, confirmedCount]
  );

  // Payment Breakdown
  const paymentStats = useMemo(() => {
    let cardCount = 0;
    let invoiceCount = 0;
    let teamCount = 0;
    let totalSeats = 0;

    signups.forEach((s) => {
      const seats = s.seat_count || (s.payment_preference === 'team_billing' ? 3 : 1);
      totalSeats += seats;
      if (s.payment_preference === 'invoice_po') {
        invoiceCount++;
      } else if (s.payment_preference === 'team_billing') {
        teamCount++;
      } else {
        cardCount++;
      }
    });

    return { cardCount, invoiceCount, teamCount, totalSeats };
  }, [signups]);

  const filteredSignups = useMemo(() => {
    return signups.filter((s) => {
      const matchesSearch =
        s.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (s.hopes && s.hopes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCounty =
        selectedCounty === 'all' || s.county === selectedCounty;

      const matchesStatus =
        selectedStatus === 'all' ||
        (selectedStatus === 'confirmed' && s.is_confirmed) ||
        (selectedStatus === 'prospect' && !s.is_confirmed);

      const pref = s.payment_preference || 'credit_card_calcard';
      const matchesPayment =
        selectedPayment === 'all' || pref === selectedPayment;

      const billStatus = s.billing_status || 'pending';
      const matchesBilling =
        selectedBillingStatus === 'all' || billStatus === selectedBillingStatus;

      return matchesSearch && matchesCounty && matchesStatus && matchesPayment && matchesBilling;
    });
  }, [signups, searchTerm, selectedCounty, selectedStatus, selectedPayment, selectedBillingStatus]);

  // County breakdown
  const countyBreakdown = useMemo(() => {
    const counts: Record<string, number> = {
      Sacramento: 0,
      Yolo: 0,
      Placer: 0,
      'Nevada County': 0,
      Other: 0,
    };
    signups.forEach((s) => {
      if (counts[s.county] !== undefined) {
        counts[s.county]++;
      } else {
        counts['Other'] = (counts['Other'] || 0) + 1;
      }
    });
    return counts;
  }, [signups]);

  // Format date in Pacific Time
  const formatPacificTime = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return (
        new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).format(date) + ' PT'
      );
    } catch {
      return dateStr;
    }
  };

  const percentageToFloor = Math.min(100, Math.round((stats.totalCount / 40) * 100));
  const remainingToFloor = Math.max(0, 40 - stats.totalCount);

  return (
    <div className="py-10 md:py-16 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        {/* Top Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div className="flex items-center gap-4">
            <a href="https://www.mosaic-data.com" target="_blank" rel="noopener noreferrer">
              <img
                src="/assets/mosaic-logo.png"
                alt="Mosaic Data Solutions"
                className="h-10 w-auto object-contain"
              />
            </a>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-cyan-50 text-[#00AECC] text-xs font-bold uppercase tracking-widest border border-cyan-100">
                  Admin Console
                </span>
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs font-semibold text-slate-600">
                  Mosaic Data Solutions
                </span>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                Seat Reservations &amp; Launch Threshold
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsPacketOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-[#00AECC] bg-cyan-50 border border-cyan-200 rounded-xl hover:bg-cyan-100 shadow-xs transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>State Justification Packet</span>
            </button>

            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              id="admin-export-excel-btn"
              onClick={() => exportSignupsToExcel(signups)}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-200/50 transition-colors cursor-pointer"
              title="Download full dataset formatted for Microsoft Excel (.xlsx)"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel (.xlsx)</span>
            </button>

            <button
              id="admin-export-csv-btn"
              onClick={() => exportSignupsToCsv(signups)}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold uppercase tracking-wide text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl shadow-xs transition-colors cursor-pointer"
              title="Download standard CSV format (.csv)"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              id="admin-signout-btn"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors shadow-xs"
              title="Lock and sign out of admin session"
            >
              <LogOut className="w-3.5 h-3.5 text-rose-600" />
              <span>Lock / Sign Out</span>
            </button>

            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-xs"
            >
              <span>Back to Site</span>
            </button>
          </div>
        </div>

        {/* Top Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Stat 1: Total Prospects & Signups */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Total Pipeline</span>
              <Users className="w-4 h-4 text-[#00AECC]" />
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {stats.totalCount}
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600 mt-1">
              <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                <UserCheck className="w-3.5 h-3.5" />
                {confirmedCount} Confirmed
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {prospectCount} Prospects
              </span>
            </div>
          </div>

          {/* Stat 2: Progress to 40 Threshold */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Scheduling Floor</span>
              <Target className="w-4 h-4 text-[#00AECC]" />
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              {stats.totalCount} <span className="text-lg font-bold text-slate-400">/ 40</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#00AECC] rounded-full"
                  style={{ width: `${percentageToFloor}%` }}
                />
              </div>
              <span className="text-xs font-bold text-[#00AECC]">
                {percentageToFloor}%
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {remainingToFloor === 0
                ? 'October 15 session locked!'
                : `${remainingToFloor} more reservations to lock session`}
            </p>
          </div>

          {/* Stat 3: Seat Cap */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Class Ceiling</span>
              <Building className="w-4 h-4 text-[#00AECC]" />
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              150 <span className="text-lg font-bold text-slate-400">Seats</span>
            </div>
            <p className="text-xs text-slate-500">
              Max room capacity at{' '}
              <a
                href="https://www.frequencycoworking.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#00AECC] hover:underline"
              >
                Frequency Coworking
              </a>{' '}
              (3249 Quality Dr, Rancho Cordova)
            </p>
          </div>

          {/* Stat 4: Revenue Potential */}
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <span>Conversion Value</span>
              <span className="text-xs font-bold text-[#00AECC]">$250/seat</span>
            </div>
            <div
              className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-1"
              style={{ fontFamily: "'Montserrat', sans-serif" }}
            >
              ${(stats.totalCount * 250).toLocaleString()}
            </div>
            <p className="text-xs text-slate-500">
              Projected pipeline ({stats.totalCount} seats @ $250)
            </p>
          </div>
        </div>

        {/* Payment & Procurement Operations Ribbon */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 mb-8 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#00AECC]" />
              <span>Payment Preferences &amp; Procurement Workflows</span>
            </div>
            <span className="text-xs text-slate-400">
              Total estimated demand: <strong className="text-slate-800">{paymentStats.totalSeats} seats</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => setSelectedPayment(selectedPayment === 'credit_card_calcard' ? 'all' : 'credit_card_calcard')}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                selectedPayment === 'credit_card_calcard'
                  ? 'border-[#00AECC] bg-cyan-50 ring-1 ring-[#00AECC]'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Credit Card / Cal-Card</span>
                <CreditCard className="w-4 h-4 text-[#00AECC]" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {paymentStats.cardCount}{' '}
                <span className="text-xs font-normal text-slate-500">signups ($250/seat)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Direct online link during 48-hour window</p>
            </div>

            <div
              onClick={() => setSelectedPayment(selectedPayment === 'invoice_po' ? 'all' : 'invoice_po')}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                selectedPayment === 'invoice_po'
                  ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">State Agency / PO (Net 30)</span>
                <FileText className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {paymentStats.invoiceCount}{' '}
                <span className="text-xs font-normal text-slate-500">signups (Needs STD 697/W-9)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Invoice issued with vendor package</p>
            </div>

            <div
              onClick={() => setSelectedPayment(selectedPayment === 'team_billing' ? 'all' : 'team_billing')}
              className={`cursor-pointer p-3.5 rounded-xl border transition-all ${
                selectedPayment === 'team_billing'
                  ? 'border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500'
                  : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-slate-900">Team Billing (3+ Seats)</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-black text-slate-900">
                {paymentStats.teamCount}{' '}
                <span className="text-xs font-normal text-slate-500">organizations ($225/seat)</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Combined single invoice for team roster</p>
            </div>
          </div>
        </div>

        {/* Regional Distribution Ribbon */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 mb-8 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#00AECC]" />
            <span>Regional County Distribution (Sacramento Area)</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {Object.entries(countyBreakdown).map(([county, count]) => (
              <div
                key={county}
                onClick={() => setSelectedCounty(selectedCounty === county ? 'all' : county)}
                className={`cursor-pointer p-3 rounded-xl border text-center transition-all ${
                  selectedCounty === county
                    ? 'border-[#00AECC] bg-cyan-50 shadow-xs'
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div
                  className="text-xl font-bold text-slate-900"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  {count}
                </div>
                <div className="text-xs text-slate-600 font-medium truncate mt-0.5">{county}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Filter and Search Controls */}
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6 flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="relative w-full lg:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search name, email, company, role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 text-xs sm:text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#00AECC]/20 focus:border-[#00AECC]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Filter className="w-3.5 h-3.5" />
              <span>Status:</span>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AECC]/20"
            >
              <option value="all">All Statuses ({signups.length})</option>
              <option value="confirmed">Confirmed Direct ({confirmedCount})</option>
              <option value="prospect">Pre-registered Prospects ({prospectCount})</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-1">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payment:</span>
            </div>
            <select
              value={selectedPayment}
              onChange={(e) => setSelectedPayment(e.target.value as any)}
              className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AECC]/20"
            >
              <option value="all">All Payment Types</option>
              <option value="credit_card_calcard">Credit Card / Cal-Card</option>
              <option value="invoice_po">State Agency / PO (Net 30)</option>
              <option value="team_billing">Team Billing (3+ Seats)</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Billing:</span>
            </div>
            <select
              value={selectedBillingStatus}
              onChange={(e) => setSelectedBillingStatus(e.target.value as any)}
              className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AECC]/20"
            >
              <option value="all">All Billing Stages</option>
              <option value="pending">Pending Session Lock</option>
              <option value="invoice_sent">Invoice / Link Dispatched</option>
              <option value="paid">Paid / Confirmed</option>
            </select>

            <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>County:</span>
            </div>
            <select
              value={selectedCounty}
              onChange={(e) => setSelectedCounty(e.target.value)}
              className="text-xs sm:text-sm py-2 pl-3 pr-8 rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[#00AECC]/20"
            >
              <option value="all">All Counties ({signups.length})</option>
              <option value="Sacramento">Sacramento ({countyBreakdown['Sacramento'] || 0})</option>
              <option value="Yolo">Yolo ({countyBreakdown['Yolo'] || 0})</option>
              <option value="Placer">Placer ({countyBreakdown['Placer'] || 0})</option>
              <option value="Nevada County">Nevada County ({countyBreakdown['Nevada County'] || 0})</option>
              <option value="Other">Other ({countyBreakdown['Other'] || 0})</option>
            </select>

            <span className="text-xs text-slate-500 ml-auto font-medium">
              Showing {filteredSignups.length} of {signups.length}
            </span>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Full Name</th>
                  <th className="py-3.5 px-4">Work Email</th>
                  <th className="py-3.5 px-4">Company / Organization</th>
                  <th className="py-3.5 px-4">Role / Title</th>
                  <th className="py-3.5 px-4">County</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Payment Preference</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Billing Status</th>
                  <th className="py-3.5 px-4 text-center">Seats</th>
                  <th className="py-3.5 px-4">Hopes / Goals</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Initial Date (PT)</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Confirmed Date (PT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {filteredSignups.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="py-12 text-center text-slate-400">
                      No seat reservations match your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredSignups.map((s, index) => {
                    const pref = s.payment_preference || 'credit_card_calcard';
                    const billStatus: BillingStatus = s.billing_status || 'pending';
                    const seats = s.seat_count || (pref === 'team_billing' ? 3 : 1);

                    return (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-400">
                          {index + 1}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {s.is_confirmed ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Confirmed Direct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Prospect
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {s.full_name}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          <a
                            href={`mailto:${s.email}`}
                            className="hover:text-[#00AECC] flex items-center gap-1 font-mono text-xs"
                          >
                            {s.email}
                          </a>
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-800 whitespace-nowrap">
                          {s.company}
                        </td>
                        <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                          {s.role_title}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <span className="inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full bg-cyan-50 text-[#00AECC] border border-cyan-100">
                            {s.county}
                          </span>
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          {pref === 'invoice_po' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                              <FileText className="w-3 h-3 text-purple-600" />
                              State PO / Net 30
                            </span>
                          ) : pref === 'team_billing' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Users className="w-3 h-3 text-emerald-600" />
                              Team Billing (3+)
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-[#00AECC] border border-cyan-200">
                              <CreditCard className="w-3 h-3 text-[#00AECC]" />
                              Credit Card / Cal-Card
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap">
                          <select
                            value={billStatus}
                            disabled={statusUpdatingId === s.id}
                            onChange={(e) => handleStatusChange(s.id, e.target.value as BillingStatus)}
                            className={`text-xs font-bold py-1 px-2 rounded-lg border focus:outline-none transition-colors ${
                              billStatus === 'paid'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : billStatus === 'invoice_sent'
                                ? 'bg-amber-50 text-amber-800 border-amber-300'
                                : 'bg-slate-50 text-slate-700 border-slate-300'
                            }`}
                          >
                            <option value="pending">Pending Session Lock</option>
                            <option value="invoice_sent">Invoice / Link Dispatched</option>
                            <option value="paid">Paid / Confirmed</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold text-slate-700">
                          {seats}
                        </td>
                        <td className="py-3 px-4 max-w-xs text-xs text-slate-600 truncate" title={s.hopes || 'None specified'}>
                          {s.hopes ? s.hopes : <span className="text-slate-300 italic">None specified</span>}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                          {formatPacificTime(s.created_at)}
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-xs text-slate-500 font-mono">
                          {s.confirmed_at ? (
                            <span className="text-emerald-700 font-semibold">
                              {formatPacificTime(s.confirmed_at)}
                            </span>
                          ) : (
                            <span className="text-slate-300 italic">Pending direct signup</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom Helper Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>
            * All timestamps are automatically calculated in <strong>Pacific Time (America/Los_Angeles)</strong>.
          </p>
          <p>
            Payment preferences accommodate State of California procurement (Net 30, POs, Form STD 697), Cal-Card holders, and corporate teams.
          </p>
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
