// ─── Enums ───────────────────────────────────────────────

export enum UserRole {
  ADMIN = 'admin',
  COMPANY_ADMIN = 'company_admin',
  SELLER = 'seller',
  CUSTOMER = 'customer',
}

export enum WalletType {
  BONUS = 'bonus',
  DEPOSIT = 'deposit',
  BURN = 'burn',
  SYSTEM_FEE = 'system_fee',
}

export enum TransactionType {
  ACCRUAL = 'accrual',
  REDEMPTION = 'redemption',
  TRANSFER = 'transfer',
  ADJUSTMENT = 'adjustment',
  REFUND = 'refund',
  EXPIRATION = 'expiration',
}

export enum TransactionStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
  HELD = 'held',
}

export enum EntityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BLOCKED = 'blocked',
}

// ─── Entities ────────────────────────────────────────────

export interface Company {
  id: string;
  name: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Store {
  id: string;
  company_id: string;
  name: string;
  city: string;
  address: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: UserRole;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  referral_code: string;
  bonus_balance: number;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface SellerProfile {
  id: string;
  user_id: string;
  store_id: string;
  commission_rate: number;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: string;
  owner_type: string;
  owner_id: string;
  wallet_type: WalletType;
  balance_cached: number;
  currency: string;
  status: EntityStatus;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: string;
  source_wallet_id: string | null;
  target_wallet_id: string | null;
  status: TransactionStatus;
  idempotency_key: string;
  meta: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface LedgerEntry {
  id: string;
  wallet_id: string;
  transaction_id: string;
  amount: number;
  balance_after: number;
  entry_type: string;
  created_at: string;
}

export interface BonusLot {
  id: string;
  wallet_id: string;
  original_amount: number;
  remaining_amount: number;
  expires_at: string;
  created_at: string;
}

export interface Hold {
  id: string;
  wallet_id: string;
  amount: number;
  reason: string;
  released_at: string | null;
  expires_at: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  channel: string;
  title: string;
  body: string;
  read_at: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  entity_type: string;
  entity_id: string;
  action: string;
  meta: Record<string, unknown>;
  created_at: string;
}

// ─── API Response ────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DashboardStats {
  customers_count: number;
  stores_count: number;
  transactions_today: number;
  transactions_total: number;
  bonus_volume: number;
}
