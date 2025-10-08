import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

// Secure hashing
export function secureHash(data: string, salt?: string): string {
  const actualSalt = salt || randomBytes(16).toString('hex');
  const hash = createHash('sha256');
  hash.update(data + actualSalt);
  return hash.digest('hex');
}

// Generate secure random tokens
export function generateSecureToken(length = 32): string {
  return randomBytes(length).toString('hex');
}

// Secure data encryption (for sensitive data at rest)
export function encryptSensitiveData(data: string, key: string): { encrypted: string; iv: string } {
  const iv = randomBytes(16);
  const cipher = createCipheriv('aes-256-gcm', Buffer.from(key, 'hex'), iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  return {
    encrypted: encrypted + ':' + authTag.toString('hex'),
    iv: iv.toString('hex')
  };
}

// Decrypt sensitive data
export function decryptSensitiveData(encryptedData: string, key: string, iv: string): string {
  const [encrypted, authTag] = encryptedData.split(':');
  const decipher = createDecipheriv('aes-256-gcm', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Secure comparison to prevent timing attacks
export function secureCompare(a: string, b: string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

// Generate CSRF token
export function generateCSRFToken(): string {
  return generateSecureToken(32);
}

// Validate CSRF token
export function validateCSRFToken(token: string, expectedToken: string): boolean {
  if (!token || !expectedToken) {
    return false;
  }
  
  return secureCompare(token, expectedToken);
}