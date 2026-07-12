import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'nursphere_secure_key_2024_v1';
const IV_LENGTH = 16;
const KEY_HASH = createHash('sha256').update(ENCRYPTION_KEY).digest();

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const hash = createHash('sha256').update(password + salt).digest('hex');
  return `${salt}:${hash}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, hash] = storedHash.split(':');
  const newHash = createHash('sha256').update(password + salt).digest('hex');
  return newHash === hash;
}

export function encryptData(data: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', KEY_HASH, iv);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

export function decryptData(encryptedData: string): string {
  const [ivHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = createDecipheriv('aes-256-cbc', KEY_HASH, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export function generateSecureToken(length: number = 32): string {
  return randomBytes(length).toString('hex');
}

export function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function hashEmail(email: string): string {
  return createHash('sha256').update(email.toLowerCase()).digest('hex');
}

export function generateUserId(): string {
  const timestamp = Date.now().toString(36);
  const random = randomBytes(4).toString('hex');
  return `ns_${timestamp}_${random}`;
}

export function encryptUserData<T extends object>(data: T): string {
  const jsonString = JSON.stringify(data);
  return encryptData(jsonString);
}

export function decryptUserData<T>(encryptedData: string): T {
  const decrypted = decryptData(encryptedData);
  return JSON.parse(decrypted);
}

export function generateSessionId(): string {
  return `sess_${randomBytes(24).toString('hex')}`;
}

export function isTokenExpired(expiryDate: string | Date): boolean {
  return new Date(expiryDate) < new Date();
}

export function generateExpiryDate(daysFromNow: number = 7): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
}

export class SecureStorage {
  private prefix = 'ns_secure_';

  setItem(key: string, value: string): void {
    const encrypted = encryptData(value);
    localStorage.setItem(this.prefix + key, encrypted);
  }

  getItem(key: string): string | null {
    const encrypted = localStorage.getItem(this.prefix + key);
    if (!encrypted) return null;
    try {
      return decryptData(encrypted);
    } catch {
      return null;
    }
  }

  removeItem(key: string): void {
    localStorage.removeItem(this.prefix + key);
  }

  setObject<T>(key: string, value: T): void {
    this.setItem(key, JSON.stringify(value));
  }

  getObject<T>(key: string): T | null {
    const data = this.getItem(key);
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch {
      return null;
    }
  }
}

export const secureStorage = new SecureStorage();

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  return `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (phone.length <= 4) return phone;
  return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
}

export interface AuditLogEntry {
  id: string;
  action: string;
  userId: string;
  timestamp: string;
  ip?: string;
  userAgent?: string;
  details?: string;
}

export function createAuditLog(action: string, userId: string, details?: string): AuditLogEntry {
  return {
    id: generateSessionId(),
    action,
    userId,
    timestamp: new Date().toISOString(),
    details,
  };
}

export function saveAuditLog(entry: AuditLogEntry): void {
  const logs = secureStorage.getObject<AuditLogEntry[]>('audit_logs') || [];
  logs.unshift(entry);
  if (logs.length > 100) logs.pop();
  secureStorage.setObject('audit_logs', logs);
}

export function getAuditLogs(userId?: string): AuditLogEntry[] {
  const logs = secureStorage.getObject<AuditLogEntry[]>('audit_logs') || [];
  if (userId) {
    return logs.filter(log => log.userId === userId);
  }
  return logs;
}
