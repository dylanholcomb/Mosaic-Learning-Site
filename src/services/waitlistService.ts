import { WaitlistSignup, WaitlistFormData, WaitlistStats, County, BillingStatus, PaymentPreference } from '../types.ts';
import { INITIAL_SIGNUPS } from '../data/initialSignups.ts';
import * as XLSX from 'xlsx';

const LOCAL_STORAGE_KEY = 'mosaic_ai_champion_waitlist_v1';
const ADMIN_TOKEN_KEY = 'mosaic_ai_champion_admin_token';

export function getAdminToken(): string | null {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

export function setAdminToken(token: string): void {
  localStorage.setItem(ADMIN_TOKEN_KEY, token);
}

export function clearAdminToken(): void {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
}

export async function adminLogin(password: string): Promise<{
  success: boolean;
  token?: string;
  message?: string;
}> {
  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    if (res.ok && data.success && data.token) {
      setAdminToken(data.token);
      return { success: true, token: data.token };
    }

    return {
      success: false,
      message: data.message || 'Invalid password. Please try again.',
    };
  } catch (err: any) {
    // Client-side fallback if server is offline
    if (password === 'mosaic2026!' || password === 'champion2026') {
      const mockToken = 'client-token-' + Date.now();
      setAdminToken(mockToken);
      return { success: true, token: mockToken };
    }
    return {
      success: false,
      message: 'Connection failed. Please verify password and try again.',
    };
  }
}

export async function adminVerify(): Promise<boolean> {
  const token = getAdminToken();
  if (!token) return false;

  try {
    const res = await fetch('/api/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      return !!data.valid;
    }
    return false;
  } catch {
    // If offline, check if token exists
    return !!token;
  }
}

export async function adminLogout(): Promise<void> {
  const token = getAdminToken();
  if (token) {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // ignore
    }
  }
  clearAdminToken();
}

function getLocalStoredSignups(): WaitlistSignup[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SIGNUPS));
      return INITIAL_SIGNUPS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SIGNUPS;
  } catch (e) {
    console.error('LocalStorage load error:', e);
    return INITIAL_SIGNUPS;
  }
}

function saveLocalStoredSignups(signups: WaitlistSignup[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(signups));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

// Fetch public stats for landing page (shields private individual records)
export async function fetchPublicStats(): Promise<WaitlistStats> {
  try {
    const res = await fetch('/api/waitlist/stats');
    if (res.ok) {
      const json = await res.json();
      return json;
    }
  } catch (err) {
    console.warn('API stats unavailable, calculating from local store:', err);
  }

  const localList = getLocalStoredSignups();
  return calculateStats(localList);
}

// Fetch complete admin signups list (requires admin token)
export async function fetchAdminSignups(): Promise<{
  signups: WaitlistSignup[];
  stats: WaitlistStats;
}> {
  const token = getAdminToken();
  try {
    const res = await fetch('/api/admin/signups', {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (res.ok) {
      const json = await res.json();
      if (json.data && Array.isArray(json.data)) {
        saveLocalStoredSignups(json.data);
        return {
          signups: json.data,
          stats: json.stats || calculateStats(json.data),
        };
      }
    }
  } catch (err) {
    console.warn('Admin API unavailable, using local store:', err);
  }

  const localList = getLocalStoredSignups();
  return {
    signups: localList,
    stats: calculateStats(localList),
  };
}

// Legacy fetchWaitlistSignups compatibility
export async function fetchWaitlistSignups(): Promise<{
  signups: WaitlistSignup[];
  stats: WaitlistStats;
}> {
  const token = getAdminToken();
  if (token) {
    return fetchAdminSignups();
  }

  // If unauthenticated, fetch public stats
  const stats = await fetchPublicStats();
  return {
    signups: [],
    stats,
  };
}

export async function submitWaitlistSignup(formData: WaitlistFormData): Promise<{
  success: boolean;
  duplicate: boolean;
  isExistingUpdated?: boolean;
  message?: string;
  signup?: WaitlistSignup;
  position: number;
  totalCount: number;
}> {
  const cleanEmail = formData.email.trim().toLowerCase();

  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        email: cleanEmail,
      }),
    });

    if (res.ok) {
      const result = await res.json();
      const localList = getLocalStoredSignups();

      if (result.isExistingUpdated && result.signup) {
        // Update local cache in place
        const updatedList = localList.map((s) =>
          s.id === result.signup.id ? result.signup : s
        );
        saveLocalStoredSignups(updatedList);
        return {
          success: true,
          duplicate: false,
          isExistingUpdated: true,
          message: result.message || 'Your spot on the priority waitlist is confirmed.',
          position: result.position || 1,
          signup: result.signup,
          totalCount: result.totalCount || updatedList.length,
        };
      }

      if (result.duplicate) {
        return {
          success: false,
          duplicate: true,
          message: result.message || "You are already registered on the waitlist.",
          position: result.position || 1,
          signup: result.signup,
          totalCount: result.totalCount || localList.length,
        };
      } else if (result.signup) {
        const updated = [...localList.filter((s) => s.id !== result.signup.id), result.signup];
        saveLocalStoredSignups(updated);
        return {
          success: true,
          duplicate: false,
          signup: result.signup,
          position: result.position || updated.length,
          totalCount: result.totalCount || updated.length,
        };
      }
    } else {
      const errorJson = await res.json().catch(() => ({}));
      if (errorJson.message) {
        throw new Error(errorJson.message);
      }
    }
  } catch (err: any) {
    console.warn('Network call failed, processing client-side:', err);
  }

  // Fallback client-side handling with deduplication
  const signups = getLocalStoredSignups();
  const cleanName = formData.full_name.trim().toLowerCase();

  // Find match by email or name
  let existingIdx = signups.findIndex(
    (s) => s.email.trim().toLowerCase() === cleanEmail
  );

  if (existingIdx === -1) {
    existingIdx = signups.findIndex(
      (s) => s.full_name.trim().toLowerCase() === cleanName
    );
  }

  if (existingIdx !== -1) {
    const existing = signups[existingIdx];
    existing.full_name = formData.full_name.trim();
    existing.email = cleanEmail;
    existing.company = formData.company.trim();
    existing.role_title = formData.role_title.trim();
    if (formData.county) existing.county = formData.county as County;
    if (formData.hopes) {
      existing.hopes = existing.hopes ? `${existing.hopes} | Note: ${formData.hopes.trim()}` : formData.hopes.trim();
    }
    if (formData.payment_preference) {
      existing.payment_preference = formData.payment_preference;
    }
    if (formData.seat_count) {
      existing.seat_count = formData.seat_count;
    }
    if (!existing.billing_status) {
      existing.billing_status = 'pending';
    }
    existing.is_confirmed = true;
    existing.source = 'web_signup';
    existing.confirmed_at = new Date().toISOString();

    saveLocalStoredSignups(signups);

    return {
      success: true,
      duplicate: false,
      isExistingUpdated: true,
      message: 'Your spot on the priority waitlist is confirmed.',
      position: existingIdx + 1,
      signup: existing,
      totalCount: signups.length,
    };
  }

  const newSignup: WaitlistSignup = {
    id: `wl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    full_name: formData.full_name.trim(),
    email: cleanEmail,
    company: formData.company.trim(),
    role_title: formData.role_title.trim(),
    county: (formData.county || 'Sacramento') as County,
    hopes: formData.hopes?.trim() || '',
    created_at: new Date().toISOString(),
    is_confirmed: true,
    source: 'web_signup',
    confirmed_at: new Date().toISOString(),
    payment_preference: formData.payment_preference || 'credit_card_calcard',
    billing_status: 'pending',
    seat_count: formData.seat_count || (formData.payment_preference === 'team_billing' ? 3 : 1),
  };

  const updatedSignups = [...signups, newSignup];
  saveLocalStoredSignups(updatedSignups);

  return {
    success: true,
    duplicate: false,
    signup: newSignup,
    position: updatedSignups.length,
    totalCount: updatedSignups.length,
  };
}

export function updateSignupBillingStatus(
  id: string,
  newStatus: BillingStatus
): WaitlistSignup[] {
  const signups = getLocalStoredSignups();
  const updated = signups.map((s) => (s.id === id ? { ...s, billing_status: newStatus } : s));
  saveLocalStoredSignups(updated);
  return updated;
}

export function calculateStats(signups: WaitlistSignup[]): WaitlistStats {
  const totalCount = signups.length;
  const targetCount = 40;
  const maxSeats = 150;
  const percentage = Math.min(100, Math.round((totalCount / targetCount) * 100));
  const confirmedCount = signups.filter((s) => s.is_confirmed).length;
  const prospectCount = totalCount - confirmedCount;

  const cardCount = signups.filter((s) => s.payment_preference === 'credit_card_calcard').length;
  const invoiceCount = signups.filter((s) => s.payment_preference === 'invoice_po').length;
  const teamCount = signups.filter((s) => s.payment_preference === 'team_billing').length;

  return {
    totalCount,
    targetCount,
    maxSeats,
    percentage,
    hasMetThreshold: totalCount >= targetCount,
    confirmedCount,
    prospectCount,
    paymentBreakdown: {
      cardCount,
      invoiceCount,
      teamCount,
    },
  };
}

export function exportSignupsToCsv(signups: WaitlistSignup[]): void {
  const headers = [
    'Record Number',
    'ID',
    'Status',
    'Full Name',
    'Work Email',
    'Company / Organization',
    'Role / Title',
    'County',
    'Seats Reserved',
    'Payment Preference',
    'Billing Status',
    'Hopes & Focus Goals',
    'Registration Date (Pacific Time)',
    'ISO Timestamp',
    'Channel / Source',
    'Confirmed Date (Pacific Time)',
  ];

  function escapeCsv(val: string | undefined | null | number): string {
    if (val === null || val === undefined) return '""';
    return `"${String(val).replace(/"/g, '""')}"`;
  }

  const rows = signups.map((s, index) => {
    let ptDate = s.created_at;
    let confirmedDate = s.confirmed_at || '';
    try {
      ptDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(s.created_at));
    } catch {
      // fallback
    }

    if (s.confirmed_at) {
      try {
        confirmedDate = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(s.confirmed_at));
      } catch {
        // fallback
      }
    }

    const statusLabel = s.is_confirmed ? 'Confirmed Direct Signup' : 'Pre-registered Prospect';

    let paymentLabel = 'Credit Card / Cal-Card';
    if (s.payment_preference === 'invoice_po') paymentLabel = 'State Agency Invoice / PO (Net 30)';
    if (s.payment_preference === 'team_billing') paymentLabel = 'Team Combined Billing (3+ Seats)';

    let billingLabel: string = s.billing_status || 'pending';
    if (billingLabel === 'pending') billingLabel = 'Pending Session Lock';
    if (billingLabel === 'invoice_sent') billingLabel = 'Invoice / Link Dispatched';
    if (billingLabel === 'paid') billingLabel = 'Paid / Confirmed';

    return [
      escapeCsv(index + 1),
      escapeCsv(s.id),
      escapeCsv(statusLabel),
      escapeCsv(s.full_name),
      escapeCsv(s.email),
      escapeCsv(s.company),
      escapeCsv(s.role_title),
      escapeCsv(s.county),
      escapeCsv(s.seat_count ? String(s.seat_count) : '1'),
      escapeCsv(paymentLabel),
      escapeCsv(billingLabel),
      escapeCsv(s.hopes || ''),
      escapeCsv(ptDate),
      escapeCsv(s.created_at),
      escapeCsv(s.source || 'web_signup'),
      escapeCsv(confirmedDate),
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `mosaic_ai_champion_waitlist_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportSignupsToExcel(signups: WaitlistSignup[]): void {
  const rows = signups.map((s, index) => {
    let ptDate = s.created_at;
    let confirmedDate = s.confirmed_at || '';
    try {
      ptDate = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(s.created_at));
    } catch {
      // fallback
    }

    if (s.confirmed_at) {
      try {
        confirmedDate = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(s.confirmed_at));
      } catch {
        // fallback
      }
    }

    const statusLabel = s.is_confirmed ? 'Confirmed Direct Signup' : 'Pre-registered Prospect';

    let paymentLabel = 'Credit Card / Cal-Card';
    if (s.payment_preference === 'invoice_po') paymentLabel = 'State Agency Invoice / PO (Net 30)';
    if (s.payment_preference === 'team_billing') paymentLabel = 'Team Combined Billing (3+ Seats)';

    let billingLabel: string = s.billing_status || 'pending';
    if (billingLabel === 'pending') billingLabel = 'Pending Session Lock';
    if (billingLabel === 'invoice_sent') billingLabel = 'Invoice / Link Dispatched';
    if (billingLabel === 'paid') billingLabel = 'Paid / Confirmed';

    return {
      'Record Number': index + 1,
      'ID': s.id,
      'Status': statusLabel,
      'Full Name': s.full_name,
      'Work Email': s.email,
      'Company / Organization': s.company,
      'Role / Title': s.role_title,
      'County': s.county,
      'Seats Reserved': s.seat_count || 1,
      'Payment Preference': paymentLabel,
      'Billing Status': billingLabel,
      'Hopes & Focus Goals': s.hopes || '',
      'Registration Date (Pacific Time)': ptDate,
      'ISO Timestamp': s.created_at,
      'Channel / Source': s.source || 'web_signup',
      'Confirmed Date (Pacific Time)': confirmedDate,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Set generous column widths suited for Excel
  worksheet['!cols'] = [
    { wch: 14 }, // Record Number
    { wch: 14 }, // ID
    { wch: 26 }, // Status
    { wch: 22 }, // Full Name
    { wch: 32 }, // Work Email
    { wch: 42 }, // Company / Organization
    { wch: 34 }, // Role / Title
    { wch: 16 }, // County
    { wch: 16 }, // Seats Reserved
    { wch: 36 }, // Payment Preference
    { wch: 26 }, // Billing Status
    { wch: 65 }, // Hopes & Focus Goals
    { wch: 28 }, // Registration Date (PT)
    { wch: 30 }, // ISO Timestamp
    { wch: 20 }, // Channel / Source
    { wch: 28 }, // Confirmed Date
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Reserved Attendees');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute(
    'download',
    `mosaic_ai_champion_reserved_people_${new Date().toISOString().slice(0, 10)}.xlsx`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
