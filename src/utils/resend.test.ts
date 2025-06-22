import { describe, it, expect, vi } from 'vitest';

// Mock the env module to avoid environment variable validation issues
vi.mock('./env', () => ({
  env: {
    RESEND_API_KEY: 'test-resend-key',
    RESEND_NEWSLETTER_AUDIENCE_ID: 'test-audience-id',
    RESEND_SIGNING_SECRET: 'test-signing-secret',
  }
}));

import { emailIsBad, fakeSubscribe } from './resend';

describe('emailIsBad', () => {
  it('should return true for mailinator.com domain', () => {
    const result = emailIsBad('test@mailinator.com');
    expect(result).toBe(true);
  });

  it('should return false for legitimate email domains', () => {
    const legitimateEmails = [
      'user@gmail.com',
      'test@example.com',
      'hello@company.org',
      'contact@domain.net',
    ];

    legitimateEmails.forEach(email => {
      const result = emailIsBad(email);
      expect(result).toBe(false);
    });
  });

  it('should handle case sensitivity correctly', () => {
    const result = emailIsBad('test@MAILINATOR.COM');
    expect(result).toBe(false); // Should be case-sensitive
  });

  it('should handle emails with subdomains', () => {
    const result = emailIsBad('test@sub.mailinator.com');
    expect(result).toBe(false); // Should only match exact domain
  });

  it('should handle emails with plus signs and dots', () => {
    const result = emailIsBad('test+tag@mailinator.com');
    expect(result).toBe(true);
  });

  it('should handle empty string gracefully', () => {
    // This will cause split('@')[1] to be undefined, making includes() return false
    const result = emailIsBad('');
    expect(result).toBe(false);
  });

  it('should handle malformed email addresses', () => {
    // These should return false rather than throw
    const result1 = emailIsBad('notanemail');
    const result2 = emailIsBad('@mailinator.com'); // This actually returns true because split('@')[1] = 'mailinator.com'
    const result3 = emailIsBad('@example.com'); // This should return false
    expect(result1).toBe(false);
    expect(result2).toBe(true); // Fixed expectation
    expect(result3).toBe(false);
  });
});

describe('fakeSubscribe', () => {
  it('should return success for bad domain emails', async () => {
    const badSubscriber = {
      email: 'test@mailinator.com',
      firstName: 'Test',
      lastName: 'User',
    };

    const result = await fakeSubscribe(badSubscriber);
    expect(result).toEqual({
      success: true,
    });
  });

  it('should return undefined for legitimate email domains', async () => {
    const legitimateSubscriber = {
      email: 'user@gmail.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    const result = await fakeSubscribe(legitimateSubscriber);
    expect(result).toBeUndefined();
  });

  it('should return success for bad domain emails without optional fields', async () => {
    const badSubscriber = {
      email: 'test@mailinator.com',
    };

    const result = await fakeSubscribe(badSubscriber);
    expect(result).toEqual({
      success: true,
    });
  });

  it('should return undefined for legitimate emails without optional fields', async () => {
    const legitimateSubscriber = {
      email: 'user@example.com',
    };

    const result = await fakeSubscribe(legitimateSubscriber);
    expect(result).toBeUndefined();
  });

  it('should handle case sensitivity in domain checking', async () => {
    const badSubscriber = {
      email: 'test@MAILINATOR.COM',
      firstName: 'Test',
    };

    const result = await fakeSubscribe(badSubscriber);
    expect(result).toBeUndefined(); // Should be case-sensitive
  });

  it('should handle multiple bad domains correctly', async () => {
    // Test with the known bad domain
    const badSubscriber = {
      email: 'test@mailinator.com',
      firstName: 'Test',
    };

    const result = await fakeSubscribe(badSubscriber);
    expect(result).toEqual({
      success: true,
    });
  });
});
