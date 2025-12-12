import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi, beforeEach } from 'vitest';
import posthog from 'posthog-js';

import SubscriptionForm from './SubscriptionForm';

// Mock dependencies
vi.mock('posthog-js', () => ({
  default: {
    capture: vi.fn(),
    identify: vi.fn(),
  },
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('@hooks/useNewsletterStats', () => ({
  default: () => ({
    refreshStats: vi.fn(),
  }),
}));

vi.mock('@utils/trpc', () => ({
  trpc: {
    mailingList: {
      subscribe: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
          isSuccess: false,
        }),
      },
    },
  },
}));

describe('SubscriptionForm - Spam Detection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Honeypot field', () => {
    it('should render honeypot field as hidden', () => {
      render(<SubscriptionForm />);

      const honeypot = screen.getByLabelText('Website');
      expect(honeypot).toBeInTheDocument();
      expect(honeypot).toHaveStyle({ display: 'none' });
      expect(honeypot).toHaveAttribute('name', 'website');
      expect(honeypot).toHaveAttribute('tabIndex', '-1');
      expect(honeypot).toHaveAttribute('autoComplete', 'off');
    });

    it('should detect spam when honeypot field is filled', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const honeypotInput = screen.getByLabelText('Website');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'John');
      await user.type(emailInput, 'john@example.com');
      await user.type(honeypotInput, 'http://spam-site.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.objectContaining({
            source: 'test-source',
            reason: 'honeypot',
            honeypotValue: 'http://spam-site.com',
          })
        );
      });

      // Should show success message (silent failure)
      expect(screen.getByText(/Success!/)).toBeInTheDocument();
    });
  });

  describe('First name validation', () => {
    it('should detect spam with mixed case pattern (e.g., VKvNcRvi)', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'VKvNcRvi');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.objectContaining({
            source: 'test-source',
            firstName: 'VKvNcRvi',
            reason: 'suspicious_first_name',
          })
        );
      });

      expect(screen.getByText(/Success!/)).toBeInTheDocument();
    });

    it('should detect spam with excessive consonants (e.g., mtpDQVeZaqb)', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'mtpDQVeZaqb');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.objectContaining({
            firstName: 'mtpDQVeZaqb',
            reason: 'suspicious_first_name',
          })
        );
      });
    });

    it('should detect spam with low vowel ratio (e.g., gVSnxvUzDY)', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'gVSnxvUzDY');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.objectContaining({
            firstName: 'gVSnxvUzDY',
            reason: 'suspicious_first_name',
          })
        );
      });
    });

    it('should detect spam with excessive uppercase letters (e.g., EUWwTGxGAX)', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'EUWwTGxGAX');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.objectContaining({
            firstName: 'EUWwTGxGAX',
            reason: 'suspicious_first_name',
          })
        );
      });
    });

    it('should detect spam with excessive uppercase letters (e.g., DGgPsflyGSa)', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'DGgPsflyGSa');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.objectContaining({
            firstName: 'DGgPsflyGSa',
            reason: 'suspicious_first_name',
          })
        );
      });
    });

    it('should allow normal names with mixed case (e.g., McDonald, O\'Brien)', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');

      // Test McDonald - has mixed case but normal vowel ratio
      await user.clear(firstNameInput);
      await user.type(firstNameInput, 'McDonald');
      await user.type(emailInput, 'john@example.com');

      // Should NOT trigger spam detection for normal names
      expect(posthog.capture).not.toHaveBeenCalledWith(
        'newsletter/spam_detected',
        expect.anything()
      );
    });

    it('should allow common first names', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');

      const validNames = ['John', 'Sarah', 'Michael', 'Emma', 'David'];

      for (const name of validNames) {
        await user.clear(firstNameInput);
        await user.clear(emailInput);
        await user.type(firstNameInput, name);
        await user.type(emailInput, 'test@example.com');

        expect(posthog.capture).not.toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.anything()
        );
      }
    });

    it('should allow names with reasonable consonant clusters', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');

      // Names with 3-4 consonants in a row are normal (e.g., "Christopher", "Andrew")
      await user.type(firstNameInput, 'Christopher');
      await user.type(emailInput, 'chris@example.com');

      expect(posthog.capture).not.toHaveBeenCalledWith(
        'newsletter/spam_detected',
        expect.anything()
      );
    });
  });

  describe('Silent failure behavior', () => {
    it('should show success message for spam submissions', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'VKvNcRvi');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Success!/)).toBeInTheDocument();
        expect(screen.getByText(/Thanks so much for subscribing/)).toBeInTheDocument();
      });
    });

    it('should not call mutation for spam submissions', async () => {
      const mutateMock = vi.fn();
      const user = userEvent.setup();

      vi.mocked(vi.fn()).mockReturnValue({
        mutate: mutateMock,
        isPending: false,
        isSuccess: false,
      });

      render(<SubscriptionForm />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'VKvNcRvi');
      await user.type(emailInput, 'spam@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/spam_detected',
          expect.anything()
        );
      });

      // Mutation should not be called for spam
      expect(mutateMock).not.toHaveBeenCalled();
    });
  });

  describe('Analytics tracking', () => {
    it('should capture newsletter/attempting_subscribe event on valid form submission', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'Alice');
      await user.type(emailInput, 'alice@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.capture).toHaveBeenCalledWith(
          'newsletter/attempting_subscribe',
          {
            source: 'test-source',
            email: 'alice@example.com',
            firstName: 'Alice',
          }
        );
      });
    });

    it('should identify user before capturing attempting_subscribe event', async () => {
      const user = userEvent.setup();
      render(<SubscriptionForm source="test-source" />);

      const firstNameInput = screen.getByPlaceholderText('First Name');
      const emailInput = screen.getByPlaceholderText('Email Address');
      const submitButton = screen.getByRole('button', { name: /subscribe/i });

      await user.type(firstNameInput, 'Bob');
      await user.type(emailInput, 'bob@example.com');
      await user.click(submitButton);

      await waitFor(() => {
        expect(posthog.identify).toHaveBeenCalledWith('bob@example.com', {
          firstName: 'Bob',
        });
      });
    });
  });
});
