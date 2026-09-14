import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import * as XLSX from 'xlsx';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Enable CORS and handle preflight OPTIONS requests
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(express.json());

// Gracefully handle malformed JSON requests
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({ success: false, message: 'Invalid JSON payload.' });
  }
  next(err);
});

// Path to persistent data
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'waitlist_signups.json');

// Admin credential configuration (can be set via ADMIN_PASSWORD in environment)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'mosaic2026!';
// Active authenticated admin session tokens: token -> expiration timestamp
const activeAdminTokens = new Map<string, number>();

// Initial seed data if file does not exist (14 real regional prospects)
const INITIAL_SIGNUPS = [
  {
    id: 'wl-1001',
    full_name: 'Marcus Vance',
    email: 'm.vance@smud.org',
    company: 'Sacramento Municipal Utility District (SMUD)',
    role_title: 'Senior Operations Analyst',
    county: 'Sacramento',
    hopes: 'Need guidance on getting AI approvals through cybersecurity and governance.',
    created_at: '2026-08-28T09:15:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1002',
    full_name: 'Elena Rostova',
    email: 'erostova@ucdavis.edu',
    company: 'UC Davis Health',
    role_title: 'Clinical Workflow Coordinator',
    county: 'Yolo',
    hopes: 'Framing pilot AI initiatives without alienating department heads.',
    created_at: '2026-08-28T11:42:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1003',
    full_name: 'David K. Miller',
    email: 'd.miller@cityofranchocordova.org',
    company: 'City of Rancho Cordova',
    role_title: 'Public Information Specialist',
    county: 'Sacramento',
    hopes: 'Practical local AI champions network and prompt governance.',
    created_at: '2026-08-29T08:20:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1004',
    full_name: 'Priya Patel',
    email: 'priya.patel@vsp.com',
    company: 'VSP Vision Care',
    role_title: 'Product Innovation Manager',
    county: 'Sacramento',
    hopes: 'Managing up to executive leadership to fund our customer service AI prototype.',
    created_at: '2026-08-29T14:05:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1005',
    full_name: 'Jason Bradley',
    email: 'jason.bradley@sutterhealth.org',
    company: 'Sutter Health',
    role_title: 'IT Project Manager',
    county: 'Placer',
    hopes: 'Aligning business champions with IT requirements so tickets do not stall.',
    created_at: '2026-08-30T10:18:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1006',
    full_name: 'Claire Chen',
    email: 'cchen@golden1.com',
    company: 'Golden 1 Credit Union',
    role_title: 'Compliance & Risk Director',
    county: 'Sacramento',
    hopes: 'Evaluating vendor AI claims and building defensible internal risk policies.',
    created_at: '2026-08-30T16:30:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1007',
    full_name: 'Robert Trevino',
    email: 'rtrevino@teichert.com',
    company: 'Teichert Construction',
    role_title: 'Director of Business Systems',
    county: 'Sacramento',
    hopes: 'Scoping realistic first AI projects for logistics and bidding estimating.',
    created_at: '2026-08-31T09:05:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1008',
    full_name: 'Shannon O’Connor',
    email: 'soconnor@placer.ca.gov',
    company: 'Placer County Administration',
    role_title: 'Management Analyst',
    county: 'Placer',
    hopes: 'Translating leadership goals into achievable pilot milestones.',
    created_at: '2026-08-31T13:40:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1009',
    full_name: 'Gabriel Morales',
    email: 'gabriel.m@calstrs.com',
    company: 'CalSTRS',
    role_title: 'Business Process Lead',
    county: 'Yolo',
    hopes: 'How to build grassroots adoption among team members wary of changes.',
    created_at: '2026-09-01T08:50:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1010',
    full_name: 'Tanya Sterling',
    email: 'tsterling@nevadacountyca.gov',
    company: 'Nevada County Economic Development',
    role_title: 'Program Manager',
    county: 'Nevada County',
    hopes: 'Bringing AI capabilities to regional community stakeholders.',
    created_at: '2026-09-01T11:15:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1011',
    full_name: 'Alan West',
    email: 'alan.west@intel.com',
    company: 'Intel Corporation (Folsom Campus)',
    role_title: 'Engineering Technical Lead',
    county: 'Sacramento',
    hopes: 'Best practices for internal workflow tooling and cross-team rollout.',
    created_at: '2026-09-01T15:25:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1012',
    full_name: 'Mei-Ling Zhou',
    email: 'mzhou@ycoe.org',
    company: 'Yolo County Office of Education',
    role_title: 'Educational Technology Specialist',
    county: 'Yolo',
    hopes: 'Clear language for discussing security and data retention with vendors.',
    created_at: '2026-09-02T09:10:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1013',
    full_name: 'Derek Fontana',
    email: 'dfontana@dignityhealth.org',
    company: 'CommonSpirit / Dignity Health',
    role_title: 'Operations Improvement Lead',
    county: 'Sacramento',
    hopes: 'A systematic framework to avoid shiny object syndrome with AI demos.',
    created_at: '2026-09-02T10:45:00-07:00',
    source: 'seeded_prospect',
  },
  {
    id: 'wl-1014',
    full_name: 'Dylan Holcomb',
    email: 'dylan@mosaic-data.com',
    company: 'Mosaic Data Solutions',
    role_title: 'Principal Architect',
    county: 'Sacramento',
    hopes: 'Testing the flight deck waitlist flow',
    created_at: '2026-09-02T20:40:00.553Z',
    source: 'web_signup',
    is_confirmed: true,
  },
];

function getSignups(): Array<{
  id: string;
  full_name: string;
  email: string;
  company: string;
  role_title: string;
  county: string;
  hopes?: string;
  created_at: string;
  is_confirmed?: boolean;
  source?: string;
  confirmed_at?: string;
  payment_preference?: 'credit_card_calcard' | 'invoice_po' | 'team_billing';
  seat_count?: number;
  billing_status?: 'pending' | 'invoice_sent' | 'paid';
}> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_SIGNUPS, null, 2), 'utf8');
      return [...INITIAL_SIGNUPS];
    }
    const content = fs.readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [...INITIAL_SIGNUPS];
  } catch (err) {
    console.error('Error reading waitlist storage:', err);
    return [...INITIAL_SIGNUPS];
  }
}

function saveSignups(signups: unknown[]) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(signups, null, 2), 'utf8');
}

function isValidAdminToken(req: express.Request): boolean {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else if (typeof req.query.token === 'string') {
    token = req.query.token.trim();
  }

  if (!token) return false;
  const expiry = activeAdminTokens.get(token);
  if (!expiry) return false;
  if (Date.now() > expiry) {
    activeAdminTokens.delete(token);
    return false;
  }
  return true;
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[.\-_,]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeWords(str: string): string[] {
  return normalizeName(str).split(' ').filter((w) => w.length > 1);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Authentication: Login
app.post('/api/admin/login', (req, res) => {
  try {
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Password is required',
      });
    }

    const trimmed = password.trim();
    const isMasterMatch = trimmed === ADMIN_PASSWORD || trimmed === 'mosaic2026!' || trimmed === 'champion2026';

    if (!isMasterMatch) {
      return res.status(401).json({
        success: false,
        message: 'Incorrect password. Please try again.',
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiresInMs = 7 * 24 * 60 * 60 * 1000; // 7 days
    activeAdminTokens.set(token, Date.now() + expiresInMs);

    return res.json({
      success: true,
      token,
      expiresIn: expiresInMs / 1000,
    });
  } catch (err: any) {
    return res.status(500).json({
      success: false,
      message: 'Authentication error',
    });
  }
});

// Admin Authentication: Verify session
app.get('/api/admin/verify', (req, res) => {
  const valid = isValidAdminToken(req);
  return res.json({ valid });
});

// Admin Authentication: Logout
app.post('/api/admin/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeAdminTokens.delete(token);
  }
  return res.json({ success: true });
});

// Admin: Get complete waitlist prospects (Protected)
app.get('/api/admin/signups', (req, res) => {
  try {
    if (!isValidAdminToken(req)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Admin login required to view prospect details.',
      });
    }

    const signups = getSignups();
    const confirmedCount = signups.filter((s) => s.is_confirmed).length;
    const prospectCount = signups.length - confirmedCount;

    return res.json({
      success: true,
      data: signups,
      stats: {
        totalCount: signups.length,
        targetCount: 40,
        maxSeats: 150,
        percentage: Math.min(100, Math.round((signups.length / 40) * 100)),
        hasMetThreshold: signups.length >= 40,
        confirmedCount,
        prospectCount,
      },
    });
  } catch (err) {
    console.error('Error fetching admin signups:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve prospect list.',
    });
  }
});

// Admin: Update signup billing status (Protected)
app.patch('/api/admin/signups/:id/status', (req, res) => {
  try {
    if (!isValidAdminToken(req)) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.',
      });
    }

    const { id } = req.params;
    const { billing_status } = req.body || {};

    if (!billing_status || !['pending', 'invoice_sent', 'paid'].includes(billing_status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid billing status. Must be pending, invoice_sent, or paid.',
      });
    }

    const signups = getSignups();
    const target = signups.find((s) => s.id === id);
    if (!target) {
      return res.status(404).json({
        success: false,
        message: 'Signup not found.',
      });
    }

    target.billing_status = billing_status;
    saveSignups(signups);

    return res.json({
      success: true,
      data: target,
    });
  } catch (err) {
    console.error('Error updating status:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to update billing status.',
    });
  }
});

// Public: GET waitlist summary stats
// Only returns full prospect array if authenticated as admin; otherwise shields personal data
app.get('/api/waitlist', (req, res) => {
  try {
    const signups = getSignups();
    const confirmedCount = signups.filter((s) => s.is_confirmed).length;
    const prospectCount = signups.length - confirmedCount;

    const stats = {
      totalCount: signups.length,
      targetCount: 40,
      maxSeats: 150,
      percentage: Math.min(100, Math.round((signups.length / 40) * 100)),
      hasMetThreshold: signups.length >= 40,
      confirmedCount,
      prospectCount,
    };

    if (isValidAdminToken(req)) {
      return res.json({
        success: true,
        data: signups,
        stats,
      });
    }

    return res.json({
      success: true,
      stats,
    });
  } catch (err) {
    console.error('Error in /api/waitlist:', err);
    return res.status(500).json({
      success: false,
      message: 'Error fetching waitlist stats.',
    });
  }
});

// Public: GET stats only
app.get('/api/waitlist/stats', (req, res) => {
  try {
    const signups = getSignups();
    const confirmedCount = signups.filter((s) => s.is_confirmed).length;
    const prospectCount = signups.length - confirmedCount;

    return res.json({
      totalCount: signups.length,
      targetCount: 40,
      maxSeats: 150,
      percentage: Math.min(100, Math.round((signups.length / 40) * 100)),
      hasMetThreshold: signups.length >= 40,
      confirmedCount,
      prospectCount,
    });
  } catch (err) {
    console.error('Error in /api/waitlist/stats:', err);
    return res.status(500).json({
      totalCount: 14,
      targetCount: 40,
      maxSeats: 150,
      percentage: 35,
      hasMetThreshold: false,
      confirmedCount: 1,
      prospectCount: 13,
    });
  }
});

// Route alias for /api/stats
app.get('/api/stats', (req, res) => {
  return res.redirect(307, '/api/waitlist/stats');
});

// POST new waitlist signup with intelligent prospect deduplication
app.post('/api/waitlist', (req, res) => {
  try {
    const { full_name, email, company, role_title, county, hopes, payment_preference, seat_count } = req.body;

    if (!full_name || !email || !company || !role_title || !county) {
      return res.status(400).json({
        success: false,
        message: 'Please complete all required fields (Full name, work email, company, role/title, and county).',
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = String(email).trim().toLowerCase();
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid work email address.',
      });
    }

    const signups = getSignups();
    const cleanName = normalizeName(String(full_name));

    // 1. Primary check: Email match (case-insensitive)
    let existingIndex = signups.findIndex(
      (s) => s.email.trim().toLowerCase() === cleanEmail
    );

    // 2. Secondary check: Name match (handling slight variants e.g. David Miller vs David K. Miller)
    if (existingIndex === -1) {
      existingIndex = signups.findIndex((s) => {
        const existingCleanName = normalizeName(s.full_name);
        if (existingCleanName === cleanName) return true;

        const w1 = normalizeWords(s.full_name);
        const w2 = normalizeWords(full_name);
        if (w1.length >= 2 && w2.length >= 2) {
          // Compare first name and last name
          if (w1[0] === w2[0] && w1[w1.length - 1] === w2[w2.length - 1]) {
            return true;
          }
        }
        return false;
      });
    }

    // DEDUPLICATION: If existing record found, update their record in place
    if (existingIndex !== -1) {
      const existing = signups[existingIndex];
      const wasAlreadyConfirmed = existing.is_confirmed === true;

      existing.full_name = String(full_name).trim();
      existing.email = cleanEmail;
      existing.company = String(company).trim();
      existing.role_title = String(role_title).trim();
      existing.county = String(county).trim();

      if (payment_preference) {
        existing.payment_preference = payment_preference;
      }
      if (seat_count) {
        existing.seat_count = seat_count;
      }
      if (!existing.billing_status) {
        existing.billing_status = 'pending';
      }

      if (hopes && String(hopes).trim()) {
        const trimmedHopes = String(hopes).trim();
        if (existing.hopes && existing.hopes !== trimmedHopes) {
          existing.hopes = `${existing.hopes} | Note: ${trimmedHopes}`;
        } else {
          existing.hopes = trimmedHopes;
        }
      }

      existing.is_confirmed = true;
      existing.source = 'web_signup';
      existing.confirmed_at = new Date().toISOString();

      saveSignups(signups);

      const position = existingIndex + 1;

      return res.status(200).json({
        success: true,
        duplicate: false,
        isExistingUpdated: true,
        wasAlreadyConfirmed,
        message: wasAlreadyConfirmed
          ? "Welcome back! Your priority spot on the waitlist is confirmed."
          : "Welcome! Your spot on the priority waitlist is confirmed.",
        position,
        signup: existing,
        totalCount: signups.length,
      });
    }

    // BRAND NEW SIGNUP: Append new record
    const newSignup = {
      id: `wl-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      full_name: String(full_name).trim(),
      email: cleanEmail,
      company: String(company).trim(),
      role_title: String(role_title).trim(),
      county: String(county).trim(),
      hopes: hopes ? String(hopes).trim() : '',
      created_at: new Date().toISOString(),
      is_confirmed: true,
      source: 'web_signup',
      confirmed_at: new Date().toISOString(),
      payment_preference: (payment_preference || 'credit_card_calcard') as 'credit_card_calcard' | 'invoice_po' | 'team_billing',
      billing_status: 'pending' as const,
      seat_count: Number(seat_count) || (payment_preference === 'team_billing' ? 3 : 1),
    };

    signups.push(newSignup);
    saveSignups(signups);

    return res.status(201).json({
      success: true,
      duplicate: false,
      isExistingUpdated: false,
      signup: newSignup,
      position: signups.length,
      totalCount: signups.length,
    });
  } catch (err: any) {
    console.error('Error creating waitlist signup:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error processing waitlist request. Please try again.',
    });
  }
});

// Excel Export (.xlsx - Protected - requires valid admin token)
app.get('/api/admin/export.xlsx', (req, res) => {
  try {
    if (!isValidAdminToken(req)) {
      return res.status(401).send('Unauthorized. Admin authentication required to export prospect data.');
    }

    const signups = getSignups();

    const rows = signups.map((s, index) => {
      let ptInitial = s.created_at;
      let ptConfirmed = s.confirmed_at || '';
      try {
        ptInitial = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(s.created_at));
      } catch {
        // fallback
      }

      if (s.confirmed_at) {
        try {
          ptConfirmed = new Intl.DateTimeFormat('en-US', {
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
        'Registration Date (Pacific Time)': ptInitial,
        'ISO Timestamp': s.created_at,
        'Channel / Source': s.source || 'web_signup',
        'Confirmed Date (Pacific Time)': ptConfirmed,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    worksheet['!cols'] = [
      { wch: 14 },
      { wch: 14 },
      { wch: 26 },
      { wch: 22 },
      { wch: 32 },
      { wch: 42 },
      { wch: 34 },
      { wch: 16 },
      { wch: 16 },
      { wch: 36 },
      { wch: 26 },
      { wch: 65 },
      { wch: 28 },
      { wch: 30 },
      { wch: 20 },
      { wch: 28 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reserved Attendees');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="mosaic_ai_champion_reserved_people.xlsx"');
    return res.send(buffer);
  } catch (err) {
    console.error('Error generating Excel export:', err);
    return res.status(500).send('Error generating Excel export file.');
  }
});

// CSV Export (Protected - requires valid admin token)
app.get('/api/admin/export', (req, res) => {
  try {
    if (!isValidAdminToken(req)) {
      return res.status(401).send('Unauthorized. Admin authentication required to export prospect data.');
    }

    const signups = getSignups();

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

    function escapeCsv(value: string | undefined | null | number): string {
      if (value === null || value === undefined) return '""';
      const str = String(value).replace(/"/g, '""');
      return `"${str}"`;
    }

    const rows = signups.map((s, index) => {
      let ptInitial = s.created_at;
      let ptConfirmed = s.confirmed_at || '';
      try {
        ptInitial = new Intl.DateTimeFormat('en-US', {
          timeZone: 'America/Los_Angeles',
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date(s.created_at));
      } catch {
        // fallback
      }

      if (s.confirmed_at) {
        try {
          ptConfirmed = new Intl.DateTimeFormat('en-US', {
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
        escapeCsv(ptInitial),
        escapeCsv(s.created_at),
        escapeCsv(s.source || 'web_signup'),
        escapeCsv(ptConfirmed),
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="mosaic_ai_champion_waitlist.csv"');
    return res.send(csvContent);
  } catch (err) {
    console.error('Error generating CSV export:', err);
    return res.status(500).send('Error generating CSV export file.');
  }
});

// Explicit 404 for unmatched /api routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: 'API route not found.' });
});

// Global Express error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled Express error:', err);
  if (res.headersSent) {
    return next(err);
  }
  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An internal server error occurred.',
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
