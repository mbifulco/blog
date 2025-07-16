import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  ContactEvents,
  EmailEvents,
  emailIsBad,
  fakeSubscribe,
  getSubscriberCount,
  isContactEvent,
  isEmailEvent,
  resend,
  subscribe,
  subscribeSchema,
} from './resend';

// Mock the env module to avoid environment variable validation issues
vi.mock('./env', () => ({
  env: {
    RESEND_API_KEY: 'test-resend-key',
    RESEND_NEWSLETTER_AUDIENCE_ID: 'test-audience-id',
    RESEND_SIGNING_SECRET: 'test-signing-secret',
  },
}));

// Mock the Resend SDK
vi.mock('resend', () => ({
  Resend: vi.fn(() => ({
    contacts: {
      create: vi.fn(),
      list: vi.fn(),
      get: vi.fn(),
    },
  })),
}));

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

    legitimateEmails.forEach((email) => {
      const result = emailIsBad(email);
      expect(result).toBe(false);
    });
  });

  it('should handle case insensitivity correctly', () => {
    const result = emailIsBad('test@MAILINATOR.COM');
    expect(result).toBe(true); // Domains are case-insensitive, so this should be caughtt
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

  it('should handle case insensitivity in domain checking', async () => {
    const badSubscriber = {
      email: 'test@MAILINATOR.COM',
      firstName: 'Test',
    };

    const result = await fakeSubscribe(badSubscriber);
    expect(result).toEqual({
      success: true,
    }); // Domains are case-insensitive, so this should be caught
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

describe('isContactEvent', () => {
  it('should return true for contact.created events', () => {
    const event = {
      type: ContactEvents.ContactCreated,
      data: {
        audience_id: 'test-id',
        created_at: '2023-01-01T00:00:00Z',
        email: 'test@example.com',
        id: 'contact-id',
        unsubscribed: false,
        updated_at: '2023-01-01T00:00:00Z',
      },
    };
    expect(isContactEvent(event)).toBe(true);
  });

  it('should return true for contact.updated events', () => {
    const event = {
      type: ContactEvents.ContactUpdated,
      data: {
        audience_id: 'test-id',
        created_at: '2023-01-01T00:00:00Z',
        email: 'test@example.com',
        id: 'contact-id',
        unsubscribed: false,
        updated_at: '2023-01-01T00:00:00Z',
      },
    };
    expect(isContactEvent(event)).toBe(true);
  });

  it('should return true for contact.deleted events', () => {
    const event = {
      type: ContactEvents.ContactDeleted,
      data: {
        audience_id: 'test-id',
        created_at: '2023-01-01T00:00:00Z',
        email: 'test@example.com',
        id: 'contact-id',
        unsubscribed: false,
        updated_at: '2023-01-01T00:00:00Z',
      },
    };
    expect(isContactEvent(event)).toBe(true);
  });

  it('should return false for email events', () => {
    const event = {
      type: EmailEvents.EmailSent,
      data: {
        created_at: '2023-01-01T00:00:00Z',
        email_id: 'email-id',
        from: 'sender@example.com',
        subject: 'Test Subject',
        to: ['recipient@example.com'],
      },
    };
    expect(isContactEvent(event)).toBe(false);
  });
});

describe('isEmailEvent', () => {
  it('should return true for email.sent events', () => {
    const event = {
      type: EmailEvents.EmailSent,
      data: {
        created_at: '2023-01-01T00:00:00Z',
        email_id: 'email-id',
        from: 'sender@example.com',
        subject: 'Test Subject',
        to: ['recipient@example.com'],
      },
    };
    expect(isEmailEvent(event)).toBe(true);
  });

  it('should return true for email.delivered events', () => {
    const event = {
      type: EmailEvents.EmailDelivered,
      data: {
        created_at: '2023-01-01T00:00:00Z',
        email_id: 'email-id',
        from: 'sender@example.com',
        subject: 'Test Subject',
        to: ['recipient@example.com'],
      },
    };
    expect(isEmailEvent(event)).toBe(true);
  });

  it('should return true for email.bounced events', () => {
    const event = {
      type: EmailEvents.EmailBounced,
      data: {
        created_at: '2023-01-01T00:00:00Z',
        email_id: 'email-id',
        from: 'sender@example.com',
        subject: 'Test Subject',
        to: ['recipient@example.com'],
      },
    };
    expect(isEmailEvent(event)).toBe(true);
  });

  it('should return false for contact events', () => {
    const event = {
      type: ContactEvents.ContactCreated,
      data: {
        audience_id: 'test-id',
        created_at: '2023-01-01T00:00:00Z',
        email: 'test@example.com',
        id: 'contact-id',
        unsubscribed: false,
        updated_at: '2023-01-01T00:00:00Z',
      },
    };
    expect(isEmailEvent(event)).toBe(false);
  });
});

describe('subscribeSchema', () => {
  it('should validate valid email with firstName and lastName', () => {
    const validData = {
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };
    const result = subscribeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should validate valid email without optional fields', () => {
    const validData = {
      email: 'test@example.com',
    };
    const result = subscribeSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const invalidData = {
      email: 'not-an-email',
      firstName: 'John',
    };
    const result = subscribeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject missing email', () => {
    const invalidData = {
      firstName: 'John',
      lastName: 'Doe',
    };
    const result = subscribeSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('getSubscriberCount', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return count of subscribed contacts', async () => {
    const mockData = {
      data: {
        data: [
          { email: 'user1@example.com', unsubscribed: false },
          { email: 'user2@example.com', unsubscribed: false },
          { email: 'user3@example.com', unsubscribed: true }, // This should be filtered out
          { email: 'user4@example.com', unsubscribed: false },
        ],
      },
      error: null,
    };

    vi.mocked(resend.contacts.list).mockResolvedValue(mockData);

    const count = await getSubscriberCount();
    expect(count).toBe(3); // Only unsubscribed: false contacts
    expect(resend.contacts.list).toHaveBeenCalledWith({
      audienceId: 'test-audience-id',
    });
  });

  it('should handle API errors gracefully', async () => {
    const mockError = {
      data: null,
      error: {
        name: 'API_ERROR',
        message: 'Something went wrong',
      },
    };

    vi.mocked(resend.contacts.list).mockResolvedValue(mockError);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const count = await getSubscriberCount();
    expect(count).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle network errors gracefully', async () => {
    vi.mocked(resend.contacts.list).mockRejectedValue(
      new Error('Network error')
    );

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const count = await getSubscriberCount();
    expect(count).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle missing data gracefully', async () => {
    vi.mocked(resend.contacts.list).mockResolvedValue({
      data: null,
      error: null,
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const count = await getSubscriberCount();
    expect(count).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});

describe('subscribe', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return fake response for bad domain emails', async () => {
    const badSubscriber = {
      email: 'test@mailinator.com',
      firstName: 'Test',
      lastName: 'User',
    };

    const result = await subscribe(badSubscriber);
    expect(result).toEqual({
      data: {
        id: '123',
      },
      error: null,
    });
    expect(resend.contacts.create).not.toHaveBeenCalled();
  });

  it('should create contact for legitimate emails when contact does not exist', async () => {
    const legitimateSubscriber = {
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    };

    // Mock contact.get to return "not found" error
    vi.mocked(resend.contacts.get).mockRejectedValue(new Error('not_found'));

    const mockResponse = {
      data: { id: 'real-contact-id' },
      error: null,
    };

    vi.mocked(resend.contacts.create).mockResolvedValue(mockResponse);

    const result = await subscribe(legitimateSubscriber);
    expect(result).toEqual(mockResponse);
    expect(resend.contacts.get).toHaveBeenCalledWith({
      email: 'user@example.com',
      audienceId: 'test-audience-id',
    });
    expect(resend.contacts.create).toHaveBeenCalledWith({
      audienceId: 'test-audience-id',
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
    });
  });

  it('should return already subscribed message when contact exists and is not unsubscribed', async () => {
    const existingSubscriber = {
      email: 'existing@example.com',
      firstName: 'Jane',
    };

    // Mock contact.get to return existing contact
    const mockExistingContact = {
      data: {
        id: 'existing-contact-id',
        email: 'existing@example.com',
        first_name: 'Jane',
        unsubscribed: false,
      },
      error: null,
    };

    vi.mocked(resend.contacts.get).mockResolvedValue(mockExistingContact);

    const result = await subscribe(existingSubscriber);
    expect(result).toEqual({
      data: null,
      error: {
        name: 'already_subscribed',
        message:
          "You're already subscribed with existing@example.com! Check your inbox for previous newsletters.",
      },
    });
    expect(resend.contacts.get).toHaveBeenCalledWith({
      email: 'existing@example.com',
      audienceId: 'test-audience-id',
    });
    expect(resend.contacts.create).not.toHaveBeenCalled();
  });

  it('should handle API errors when subscribing legitimate emails', async () => {
    const legitimateSubscriber = {
      email: 'user@example.com',
      firstName: 'John',
    };

    // Mock contact.get to return "not found" error so we proceed to create
    vi.mocked(resend.contacts.get).mockRejectedValue(new Error('not_found'));

    const mockErrorResponse = {
      data: null,
      error: {
        name: 'VALIDATION_ERROR',
        message: 'Invalid email format',
      },
    };

    vi.mocked(resend.contacts.create).mockResolvedValue(mockErrorResponse);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(subscribe(legitimateSubscriber)).rejects.toThrow(
      'VALIDATION_ERROR: Invalid email format'
    );
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('should handle network errors when subscribing', async () => {
    const legitimateSubscriber = {
      email: 'user@example.com',
    };

    // Mock contact.get to return "not found" error so we proceed to create
    vi.mocked(resend.contacts.get).mockRejectedValue(new Error('not_found'));

    const networkError = new Error('Network failure');
    vi.mocked(resend.contacts.create).mockRejectedValue(networkError);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(subscribe(legitimateSubscriber)).rejects.toThrow(
      'Network failure'
    );
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
