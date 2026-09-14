export type County =
  | 'Sacramento'
  | 'Yolo'
  | 'Placer'
  | 'Nevada County'
  | 'Other';

export type PaymentPreference =
  | 'credit_card_calcard'
  | 'invoice_po'
  | 'team_billing';

export type BillingStatus =
  | 'pending'
  | 'invoice_sent'
  | 'paid';

export interface WaitlistSignup {
  id: string;
  full_name: string;
  email: string;
  company: string;
  role_title: string;
  county: County;
  hopes?: string;
  created_at: string; // ISO 8601 string
  is_confirmed?: boolean;
  source?: 'web_signup' | 'seeded_prospect';
  confirmed_at?: string;
  payment_preference?: PaymentPreference;
  billing_status?: BillingStatus;
  seat_count?: number;
}

export interface WaitlistFormData {
  full_name: string;
  email: string;
  company: string;
  role_title: string;
  county: County | '';
  hopes?: string;
  payment_preference?: PaymentPreference;
  seat_count?: number;
}

export interface WaitlistStats {
  totalCount: number;
  targetCount: number;
  maxSeats: number;
  percentage: number;
  hasMetThreshold: boolean;
  confirmedCount?: number;
  prospectCount?: number;
  paymentBreakdown?: {
    cardCount: number;
    invoiceCount: number;
    teamCount: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  duplicate?: boolean;
  position?: number;
}
