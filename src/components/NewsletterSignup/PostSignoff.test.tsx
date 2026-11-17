import { act, render, screen } from '@testing-library/react';
import posthog from 'posthog-js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import PostSignoff from './PostSignoff';

vi.mock('posthog-js', () => ({ default: { capture: vi.fn() } }));

vi.mock('../SubscriptionForm', () => ({
  SubscriptionForm: (props: { source?: string; showFirstName?: boolean }) => (
    <div
      data-testid="form"
      data-source={props.source}
      data-show-first-name={String(props.showFirstName)}
    />
  ),
}));

vi.mock('./SubscriberCount', () => ({
  default: () => <span>1,234</span>,
}));

let observerCallback: IntersectionObserverCallback;
const disconnect = vi.fn();

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe = vi.fn();
      disconnect = disconnect;
    }
  );
});

const entry = (isIntersecting: boolean, intersectionRatio: number) =>
  [{ isIntersecting, intersectionRatio }] as IntersectionObserverEntry[];

describe('PostSignoff', () => {
  it('renders the sign-off copy, an email-only form, and the latest issue link', () => {
    render(
      <PostSignoff
        source="post-signoff"
        slug="a-post"
        latestIssue={{ slug: 'some-issue', title: 'Some issue' }}
      />
    );
    expect(
      screen.getByText(/If this was useful, I write one of these every week/)
    ).toBeInTheDocument();
    const form = screen.getByTestId('form');
    expect(form).toHaveAttribute('data-source', 'post-signoff');
    expect(form).toHaveAttribute('data-show-first-name', 'false');
    expect(
      screen.getByRole('link', { name: /Read last week's issue/ })
    ).toHaveAttribute('href', '/newsletter/some-issue');
  });

  it('links to the archive when there is no newer issue', () => {
    render(
      <PostSignoff source="newsletter-signoff" slug="a" latestIssue={null} />
    );
    expect(
      screen.getByRole('link', { name: 'Browse past issues' })
    ).toHaveAttribute('href', '/newsletter');
  });

  it('records signoff_viewed once when half visible', () => {
    render(
      <PostSignoff source="post-signoff" slug="a-post" latestIssue={null} />
    );
    act(() => observerCallback(entry(true, 0.5), {} as IntersectionObserver));
    act(() => observerCallback(entry(true, 0.5), {} as IntersectionObserver));
    expect(posthog.capture).toHaveBeenCalledTimes(1);
    expect(posthog.capture).toHaveBeenCalledWith('newsletter/signoff_viewed', {
      source: 'post-signoff',
      slug: 'a-post',
    });
    expect(disconnect).toHaveBeenCalled();
  });
});
