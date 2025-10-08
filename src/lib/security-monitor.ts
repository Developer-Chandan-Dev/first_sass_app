import { sanitizeForLog } from './input-sanitizer';

export interface SecurityEvent {
  type: 'FAILED_LOGIN' | 'RATE_LIMIT_EXCEEDED' | 'INVALID_INPUT' | 'UNAUTHORIZED_ACCESS' | 'SUSPICIOUS_ACTIVITY';
  userId?: string;
  ip?: string;
  userAgent?: string;
  details: Record<string, unknown>;
  timestamp: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly maxEvents = 1000;
  logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      userId: event.userId ? sanitizeForLog(event.userId) : undefined,
      ip: event.ip ? sanitizeForLog(event.ip) : undefined,
      userAgent: event.userAgent ? sanitizeForLog(event.userAgent) : undefined,
      details: this.sanitizeDetails(event.details)
    };

    this.events.push(securityEvent);
    
    // Keep only recent events
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents);
    }

    // Log to console with sanitized data
    console.warn('SECURITY_EVENT:', JSON.stringify(securityEvent));

    // Alert on critical events
    if (event.severity === 'CRITICAL' || event.severity === 'HIGH') {
      this.alertSecurityTeam(securityEvent);
    }
  }

  private sanitizeDetails(details: Record<string, unknown>): Record<string, string> {
    const sanitized: Record<string, string> = {};
    
    Object.entries(details).forEach(([key, value]) => {
      sanitized[sanitizeForLog(key)] = sanitizeForLog(String(value));
    });
    
    return sanitized;
  }

  private alertSecurityTeam(event: SecurityEvent): void {
    // In production, this would send alerts to security team
    console.error('CRITICAL_SECURITY_EVENT:', JSON.stringify(event));
    
    // Could integrate with:
    // - Slack/Discord webhooks
    // - Email alerts
    // - Security monitoring services (Datadog, New Relic, etc.)
    // - PagerDuty for critical incidents
  }

  getRecentEvents(limit = 50): SecurityEvent[] {
    return this.events.slice(-limit);
  }

  getEventsByType(type: SecurityEvent['type'], limit = 50): SecurityEvent[] {
    return this.events
      .filter(event => event.type === type)
      .slice(-limit);
  }

  getEventsByUserId(userId: string, limit = 50): SecurityEvent[] {
    const sanitizedUserId = sanitizeForLog(userId);
    return this.events
      .filter(event => event.userId === sanitizedUserId)
      .slice(-limit);
  }

  // Detect suspicious patterns
  detectSuspiciousActivity(ip: string, timeWindowMs = 5 * 60 * 1000): boolean {
    const sanitizedIp = sanitizeForLog(ip);
    const now = Date.now();
    const recentEvents = this.events.filter(event => 
      event.ip === sanitizedIp && 
      (now - new Date(event.timestamp).getTime()) < timeWindowMs
    );

    // Multiple failed attempts
    const failedAttempts = recentEvents.filter(event => 
      event.type === 'FAILED_LOGIN' || event.type === 'UNAUTHORIZED_ACCESS'
    ).length;

    if (failedAttempts >= 5) {
      this.logSecurityEvent({
        type: 'SUSPICIOUS_ACTIVITY',
        ip: sanitizedIp,
        severity: 'HIGH',
        details: {
          reason: 'Multiple failed attempts',
          count: failedAttempts,
          timeWindow: `${timeWindowMs / 1000}s`
        }
      });
      return true;
    }

    return false;
  }
}

export const securityMonitor = new SecurityMonitor();

// Helper functions for common security events
export function logFailedLogin(userId?: string, ip?: string, userAgent?: string, reason?: string): void {
  securityMonitor.logSecurityEvent({
    type: 'FAILED_LOGIN',
    userId,
    ip,
    userAgent,
    severity: 'MEDIUM',
    details: {
      reason: reason || 'Authentication failed',
      timestamp: new Date().toISOString()
    }
  });
}

export function logRateLimitExceeded(ip?: string, endpoint?: string, userAgent?: string): void {
  securityMonitor.logSecurityEvent({
    type: 'RATE_LIMIT_EXCEEDED',
    ip,
    userAgent,
    severity: 'MEDIUM',
    details: {
      endpoint: endpoint || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
}

export function logInvalidInput(userId?: string, ip?: string, field?: string, value?: string): void {
  securityMonitor.logSecurityEvent({
    type: 'INVALID_INPUT',
    userId,
    ip,
    severity: 'LOW',
    details: {
      field: field || 'unknown',
      value: value ? sanitizeForLog(value) : 'unknown',
      timestamp: new Date().toISOString()
    }
  });
}

export function logUnauthorizedAccess(userId?: string, ip?: string, resource?: string, userAgent?: string): void {
  securityMonitor.logSecurityEvent({
    type: 'UNAUTHORIZED_ACCESS',
    userId,
    ip,
    userAgent,
    severity: 'HIGH',
    details: {
      resource: resource || 'unknown',
      timestamp: new Date().toISOString()
    }
  });
}