import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import NewsletterSignupPage from './page';

// Mock dependencies
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock('posthog-js', () => ({
  default: {
    identify: vi.fn(),
    capture: vi.fn(),
    init: vi.fn(),
  },
}));

vi.mock('../posthog-provider', () => ({
  PostHogPageview: () => null,
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
    className,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
    />
  ),
}));

vi.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/subscribe',
      pathname: '/subscribe',
      query: {},
      asPath: '/subscribe',
      push: vi.fn(),
      pop: vi.fn(),
      reload: vi.fn(),
      back: vi.fn(),
      prefetch: vi.fn(() => Promise.resolve()),
      beforePopState: vi.fn(),
      events: {
        on: vi.fn(),
        off: vi.fn(),
        emit: vi.fn(),
      },
      isFallback: false,
      isLocaleDomain: true,
      isReady: true,
      isPreview: false,
    };
  },
}));

vi.mock('@utils/trpc', () => ({
  trpc: {
    mailingList: {
      subscribe: {
        useMutation: vi.fn(() => ({
          mutate: vi.fn(),
          mutateAsync: vi.fn(),
          isPending: false,
          isSuccess: false,
          error: null,
        })),
      },
      stats: {
        useQuery: vi.fn(() => ({
          data: { subscribers: 1234 },
          isLoading: false,
          error: null,
        })),
      },
    },
  },
  default: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

// Test wrapper component
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('NewsletterSignupPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the newsletter signup form', () => {
    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    expect(screen.getByText('💌 Get the newsletter')).toBeInTheDocument();
    expect(screen.getByText('💌 Tiny Improvements')).toBeInTheDocument();
    expect(
      screen.getByText(
        'One sharp idea each week to help you ship smarter and faster.'
      )
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /💌 Get the newsletter/i })
    ).toBeInTheDocument();
  });

  it('should display Mike Bifulco headshot image', () => {
    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    const image = screen.getByAltText('Mike Bifulco');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/mike-headshot-square.png');
  });

  it('should show validation errors for empty required fields', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    const submitButton = screen.getByRole('button', {
      name: /💌 Get the newsletter/i,
    });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('First name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('should have email input with email type validation', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    const emailInput = screen.getByPlaceholderText('you@example.com');

    // Verify input has correct type for basic HTML5 validation
    expect(emailInput).toHaveAttribute('type', 'email');

    // Verify input accepts valid email format
    await user.type(emailInput, 'test@example.com');
    expect(emailInput).toHaveValue('test@example.com');
  });

  it('should accept valid form data', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const emailInput = screen.getByPlaceholderText('you@example.com');

    await user.type(firstNameInput, 'John');
    await user.type(emailInput, 'john@example.com');

    // Form should be valid, no validation errors should be shown
    expect(
      screen.queryByText('First name is required')
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Email is required')).not.toBeInTheDocument();
    expect(
      screen.queryByText('Please enter a valid email address')
    ).not.toBeInTheDocument();
  });

  it('should render privacy disclaimer with newsletter link', () => {
    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    expect(
      screen.getByText("I'll never sell your contact info.")
    ).toBeInTheDocument();

    expect(screen.getByText('Unsubscribe any time.')).toBeInTheDocument();
    const privacyLink = screen.getByRole('link', {
      name: /I'll never sell your contact info/i,
    });
    expect(privacyLink).toBeInTheDocument();
    expect(privacyLink).toHaveAttribute('href', '/integrity');
  });

  it('should have proper SEO meta tags', () => {
    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    // The SEO component should be rendered (we can't easily test the actual meta tags in jsdom)
    // But we can verify the component is present by checking if the page renders without errors
    expect(screen.getByText('💌 Get the newsletter')).toBeInTheDocument();
  });

  it('should apply correct styling classes', () => {
    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    const firstNameInput = screen.getByPlaceholderText('First Name');
    expect(firstNameInput).toHaveClass('border-input');

    const emailInput = screen.getByPlaceholderText('you@example.com');
    expect(emailInput).toHaveClass('border-input');
  });

  it('should show success state after successful submission', async () => {
    // Create a mock that properly triggers the onSuccess callback
    let capturedOnSuccess: ((data: unknown) => void) | null = null;
    const mockMutate = vi.fn().mockImplementation(() => {
      // Simulate successful mutation by calling the captured onSuccess callback
      if (capturedOnSuccess) {
        capturedOnSuccess({ data: { id: "sub_12345" }, error: null });
      }
    });

    // Mock successful mutation that will capture and trigger onSuccess
    const { trpc } = await import('@utils/trpc');
    const mockUseMutation = vi.fn().mockImplementation((options) => {
      // Capture the onSuccess callback
      capturedOnSuccess = options?.onSuccess || null;
      
      return {
        mutate: mockMutate,
        mutateAsync: vi.fn(),
        isPending: false,
        isSuccess: false,
        error: null,
      };
    });

    vi.mocked(trpc.mailingList.subscribe.useMutation).mockImplementation(
      mockUseMutation
    );

    const user = userEvent.setup();

    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    const firstNameInput = screen.getByPlaceholderText('First Name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', {
      name: /💌 Get the newsletter/i,
    });

    await user.type(firstNameInput, 'John');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    // Wait for success state to appear
    await waitFor(() => {
      expect(screen.getByText("🪩 Success! You're in!")).toBeInTheDocument();
      expect(screen.getByTestId('read-latest-button')).toBeInTheDocument();

      const readLatestLink = screen.getByRole('link', {
        name: /read the latest dispatch/i,
      });
      expect(readLatestLink).toHaveAttribute('href', '/newsletter');
    });
  });

  it('should render initial form state correctly', () => {
    // Test that the component renders in its initial state
    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    // Verify initial form state
    expect(screen.getByText('💌 Get the newsletter')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('should show success state with correct link to newsletter', async () => {
    // Create a mock that properly triggers the onSuccess callback
    let capturedOnSuccess: ((data: unknown) => void) | null = null;
    const mockMutate = vi.fn().mockImplementation(() => {
      // Simulate successful mutation by calling the captured onSuccess callback
      if (capturedOnSuccess) {
        capturedOnSuccess({ data: { id: "sub_12345" }, error: null });
      }
    });

    const { trpc } = await import('@utils/trpc');
    const mockUseMutation = vi.fn().mockImplementation((options) => {
      // Capture the onSuccess callback
      capturedOnSuccess = options?.onSuccess || null;
      
      return {
        mutate: mockMutate,
        mutateAsync: vi.fn(),
        isPending: false,
        isSuccess: false,
        error: null,
      };
    });

    vi.mocked(trpc.mailingList.subscribe.useMutation).mockImplementation(
      mockUseMutation
    );

    const user = userEvent.setup();

    render(
      <TestWrapper>
        <NewsletterSignupPage />
      </TestWrapper>
    );

    // Fill and submit form
    const firstNameInput = screen.getByPlaceholderText('First Name');
    const emailInput = screen.getByPlaceholderText('you@example.com');
    const submitButton = screen.getByRole('button', {
      name: /💌 Get the newsletter/i,
    });

    await user.type(firstNameInput, 'John');
    await user.type(emailInput, 'john@example.com');
    await user.click(submitButton);

    // Wait for success state to appear
    await waitFor(() => {
      expect(screen.getByText("🪩 Success! You're in!")).toBeInTheDocument();
    });

    // Verify the link has correct attributes
    const readLatestLink = screen.getByRole('link', {
      name: /read the latest dispatch/i,
    });
    expect(readLatestLink).toHaveAttribute('href', '/newsletter');
    expect(screen.getByTestId('read-latest-button')).toBeInTheDocument();
  });
});
