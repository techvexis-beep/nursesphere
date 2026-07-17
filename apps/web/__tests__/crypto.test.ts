import { encryptData, decryptData, hashPassword, verifyPassword, generateSecureToken, maskEmail, maskPhone } from '@/lib/crypto';

describe('Crypto utilities', () => {
  test('encryptData and decryptData round-trip', () => {
    const data = 'sensitive-nurse-data-12345';
    const encrypted = encryptData(data);
    expect(encrypted).not.toBe(data);
    const decrypted = decryptData(encrypted);
    expect(decrypted).toBe(data);
  });

  test('hashPassword and verifyPassword', async () => {
    const password = 'SecureP@ss123';
    const hash = await hashPassword(password);
    expect(hash).toContain(':');
    expect(await verifyPassword(password, hash)).toBe(true);
    expect(await verifyPassword('wrong', hash)).toBe(false);
  });

  test('generateSecureToken returns hex string', () => {
    const token = generateSecureToken();
    expect(token).toMatch(/^[a-f0-9]+$/);
    expect(token.length).toBe(64);
  });

  test('generateSecureToken respects length', () => {
    const token = generateSecureToken(16);
    expect(token.length).toBe(32);
  });

  test('maskEmail masks correctly', () => {
    expect(maskEmail('john@example.com')).toBe('j***n@example.com');
    expect(maskEmail('ab@test.com')).toBe('a**b@test.com');
    expect(maskEmail('a@x.com')).toBe('a***@x.com');
  });

  test('maskPhone masks correctly', () => {
    expect(maskPhone('1234567890')).toBe('******7890');
    expect(maskPhone('1234')).toBe('1234');
  });
});
