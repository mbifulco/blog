# Newsletter Signup Conversion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Stop the signup form from looking broken, send Mike a daily digest
of signups that fail verification, and replace the scroll modal and bottom
banner with one end-of-post sign-off.

**Architecture:** The Turnstile gate hook switches to Cloudflare's `execute`
mode. It starts the challenge when the reader engages with the form, and it
reveals errors only after a submit. A new tRPC mutation stores blocked
signups in Upstash Redis, and a Vercel cron route emails them to Mike
through Resend. A new `PostSignoff` component sits at the end of the article
column in `FullPost`.

**Tech Stack:**
- Next.js 16.4.4 (pages router for posts and the API)
- tRPC with superjson
- `@marsidev/react-turnstile` 1.6.3
- `@upstash/redis`
- Resend and React Email
- PostHog (`posthog-js`, plus the server helper in `src/server/posthog.ts`)
- Vitest and Testing Library

**Spec:** `docs/superpowers/specs/2026-11-03-newsletter-signup-conversion-design.md`

## Global Constraints

- Before writing Next.js code, read the relevant guide in
  `node_modules/next/dist/docs/` (see `AGENTS.md`).
- All copy, comments, and commit messages are in US English.
- Follow the `writing-comments` skill before adding any comment.
- `mailingList.subscribe` behavior doesn't change. Tokenless requests still
  get the silent fake success.
- Keep every existing PostHog event name the form sends. New events:
  - `newsletter/signoff_viewed`
  - `newsletter/blocked_signup_reported`
  - `newsletter/blocked_digest_sent`
- Turnstile options keep `appearance: 'interaction-only'`,
  `size: 'flexible'`, and `theme: 'auto'`, and add `execution: 'execute'`.
- The wait limit stays `TOKEN_WAIT_LIMIT_MS = 8000`. It's paused while an
  interactive challenge is on screen.
- Store blocked signups under the per-day key `blocked-signups:YYYY-MM-DD`,
  using the US Eastern date. Dedupe by lowercased email and expire after
  7 days (`604800` seconds).
- The digest goes from
  `💌 Tiny Improvements Notifications <notifications@mikebifulco.com>` to
  `hello@mikebifulco.com` in production, and to `delivered@resend.com`
  elsewhere, matching `sendSubscriberNotificationEmail`.
- The cron schedule is `0 13 * * *` (8am EST, 9am EDT). The route requires
  `Authorization: Bearer ${CRON_SECRET}`.
- Run tests with `pnpm vitest run <path>`. Before each commit, run
  `pnpm tsc --noEmit` and `pnpm lint`.

## Review Focus

These are the cases most likely to bite a reader if nothing tests them:

1. **A token expires before the reader submits.** A reader focuses a field,
   walks away for more than 5 minutes, and then submits. The submit should
   fetch a fresh token rather than hang or error. (Task 1:
   `gets a fresh token on submit after the token expired`.)
2. **A second form only ever hits the wait limit.** A script blocker
   reports only to the first widget on the page, so a second form reaches
   `token_wait_limit`. That form must still show the error and send a
   blocked report. (Task 1: `treats the wait limit as a failure after
   submit`. Task 3: `reports the wait-limit failure once`.)
3. **The reader keeps hitting "Try again."** The blocked report goes out at
   most once per form instance. (Task 3: `reports a blocked signup only
   once per form`.)
4. **Redis is down when a report comes in.** The mutation must not throw,
   and the reader's UI doesn't change. (Task 2: `returns ok when storage
   throws`.)
5. **The Resend contact lookup fails for one digest entry.** The digest
   still sends, and that entry is marked as unknown. (Task 4: `marks an
   entry unknown when the contact lookup fails`.)

---

### Task 1: Start Turnstile on engagement and show errors only after a submit

**Files:**
- Modify: `src/hooks/useTurnstileGate.ts`
- Modify: `src/components/SubscriptionForm/SubscriptionForm.tsx`
- Modify: `src/components/SubscriptionForm/TurnstileStatus.tsx`
- Test: `src/components/SubscriptionForm/SubscriptionForm.test.tsx`

**Interfaces:**
- Produces:
  - `useTurnstileGate(source?: string, options?: { onSubmitFailed?: (reason: string) => void })`
    returns:
    - `widgetProps`
    - `status: 'idle' | 'waiting' | 'error'`
    - `start(): void`, which is idempotent and calls `ref.execute()` once
      per challenge
    - `submitWhenVerified(send)`
    - `retry()`
    - `resetToken()`
  - `onSubmitFailed` fires once each time the gate enters `error` after a
    submit. Task 3 calls the report from it.

- [ ] **Step 1: Update the Turnstile mock in the test file**

  - Make it a `forwardRef` component that exposes
    `{ execute, reset, remove, getResponse }` as `vi.fn()`s.
  - `execute` emits `'test-turnstile-token'` through `onSuccess` when
    `turnstileShouldEmitToken` is true, instead of emitting on mount.
  - Capture the latest `onError`, `onTimeout`, `onExpire`,
    `onBeforeInteractive`, and `onAfterInteractive` props into module-level
    variables so tests can fire them.
  - Run the existing suite and fix any test that relied on emitting the
    token on mount. Each such test should focus a field or submit first.

- [ ] **Step 2: Write the failing tests** in a new
  `describe('Turnstile gate timing')`:

```tsx
it('does not start the challenge until a field is focused', async () => {
  render(<SubscriptionForm source="test" />);
  expect(turnstileExecute).not.toHaveBeenCalled();
  fireEvent.focus(screen.getByLabelText('Email Address'));
  fireEvent.focus(screen.getByLabelText('First name (optional)'));
  expect(turnstileExecute).toHaveBeenCalledTimes(1);
});

it('starts the challenge on submit if no field was focused', () => {
  // fill email via fireEvent.change (no focus), submit
  // expect(turnstileExecute).toHaveBeenCalledTimes(1)
});

it('hides a pre-submit failure until the reader submits', () => {
  // render, focus email, fire turnstileOnError('300010')
  // expect(screen.queryByText(/couldn’t finish our spam check/i)).toBeNull()
  // expect(posthog.capture).toHaveBeenCalledWith('newsletter/turnstile_error',
  //   { source: 'test', reason: '300010', after_submit: false })
});

it('logs a repeated pre-submit failure only once', () => {
  // fire turnstileOnTimeout() three times
  // expect turnstile_error captured exactly once
});

it('retries once on submit after a pre-submit failure', () => {
  // focus, fire onError('300010'), fill valid email, submit
  // expect(turnstileReset).toHaveBeenCalledTimes(1)
  // expect(turnstileExecute).toHaveBeenCalledTimes(2)
  // emit token -> expect(mockMutate).toHaveBeenCalledTimes(1)
});

it('shows the error after a post-submit failure', () => {
  // turnstileShouldEmitToken = false; focus, submit, fire onError('600010')
  // expect(screen.getByText(/couldn’t finish our spam check/i)).toBeInTheDocument()
  // expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  // expect turnstile_error captured with after_submit: true
});

it('treats the wait limit as a failure after submit', () => {
  // fake timers; turnstileShouldEmitToken = false; submit; advance 8000ms
  // expect error copy visible; turnstile_error reason 'token_wait_limit'
});

it('pauses the wait limit during an interactive challenge', () => {
  // fake timers; turnstileShouldEmitToken = false; submit
  // act(() => turnstileOnBeforeInteractive()); advance 20000ms -> no error copy
  // act(() => turnstileOnAfterInteractive()); advance 8000ms -> error copy visible
});

it('gets a fresh token on submit after the token expired', () => {
  // focus (token emitted), fire turnstileOnExpire(), fill email, submit
  // expect(turnstileExecute).toHaveBeenCalledTimes(2)
  // emit token -> mockMutate called once with turnstileToken set
});
```

- [ ] **Step 3: Run the tests and confirm they fail**

  Run: `pnpm vitest run src/components/SubscriptionForm/SubscriptionForm.test.tsx`
  Expected: the new tests fail, and the existing tests pass after the
  Step 1 mock changes.

- [ ] **Step 4: Implement the gate changes in `useTurnstileGate.ts`**

  - **Options:** add `execution: 'execute'`, and wire `onBeforeInteractive`
    and `onAfterInteractive` to pause and resume the wait timer.
  - **`submitted` flag:** track it in a ref. Before a submit, failures set
    an internal `failedBeforeSubmit` and leave `status` at `'idle'`.
  - **Submitting after a pre-submit failure:** call `reset()` then
    `execute()` once, and set `status: 'waiting'`.
  - **Submitting with no token and no challenge running:** call `start()`.
  - **Expired tokens:** `onExpire` clears the token and the started flag, so
    the next `start()` or submit runs the challenge again.
  - **Logging:** capture `newsletter/turnstile_error`
    `{ source, reason, after_submit }` at most once with
    `after_submit: false`, and at most once with `after_submit: true`, per
    hook instance.
  - **After-submit failures:** set `status: 'error'` and call
    `options.onSubmitFailed?.(reason)`.

- [ ] **Step 5: Wire up the form and update the copy**

  - In `SubscriptionForm.tsx`, call `turnstile.start` from `onFocus` on both
    the email and first-name inputs.
  - In `TurnstileStatus.tsx`, replace the error copy with exactly the
    following, keeping the "Try again" button after it:

    `We couldn’t finish our spam check. A content blocker or privacy setting is the usual cause. Allow challenges.cloudflare.com and try again.`

- [ ] **Step 6: Run the tests and confirm they pass**

  Run: `pnpm vitest run src/components/SubscriptionForm/SubscriptionForm.test.tsx`
  Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add src/hooks/useTurnstileGate.ts src/components/SubscriptionForm
git commit -m "fix: start Turnstile on engagement and show errors only after submit"
```

### Task 2: Store blocked signups and add the report mutation

**Files:**
- Create: `src/server/redis.ts`
- Modify: `src/server/rateLimit.ts`, so it imports `redis` from
  `./redis` instead of constructing its own client
- Create: `src/server/blockedSignups.ts`
- Test: `src/server/blockedSignups.test.ts`
- Modify: `src/server/routers/mailingList.ts`
- Test: `src/server/routers/mailingList.test.ts`

**Interfaces:**
- Produces:
  - `redis` (an `@upstash/redis` client) from `src/server/redis.ts`.
  - `type BlockedSignup = { email: string; firstName?: string; source?: string; path: string; reason: string; at: string /* ISO */ }`.
  - `easternDateKey(date: Date): string`, which returns
    `blocked-signups:YYYY-MM-DD` using `America/New_York`.
  - `recordBlockedSignup(entry: BlockedSignup): Promise<void>`, which runs
    `HSET key <lowercased email> <JSON>` and then `EXPIRE key 604800`.
  - `listBlockedSignups(key: string): Promise<BlockedSignup[]>`.
  - `reportBlockedSignupSchema` (zod), with:
    - `email` (an email string)
    - `firstName?`
    - `source?`
    - `path` (a string of at most 300 characters)
    - `reason` (a string of at most 64 characters)
    - `honeypot?`
    - `formLoadedAt?`
  - A `mailingList.reportBlockedSignup` mutation that returns
    `{ ok: true }`.

- [ ] **Step 1: Write the failing tests**

  In `blockedSignups.test.ts`, mock `./redis` with `hset`, `expire`, and
  `hgetall` as `vi.fn()`s:

```ts
it('builds the key from the US Eastern date', () => {
  expect(easternDateKey(new Date('2026-11-04T03:30:00Z'))).toBe('blocked-signups:2026-11-03');
});
it('dedupes by lowercased email and sets a 7-day expiry', async () => {
  await recordBlockedSignup({ email: 'Ann@Example.com', path: '/posts/x', reason: '300010', at: '2026-11-03T12:00:00Z' });
  expect(redis.hset).toHaveBeenCalledWith('blocked-signups:2026-11-03', { 'ann@example.com': expect.any(String) });
  expect(redis.expire).toHaveBeenCalledWith('blocked-signups:2026-11-03', 604800);
});
it('lists stored entries', async () => { /* hgetall returns two JSON strings or objects -> two BlockedSignup */ });
```

  In `mailingList.test.ts`, add `describe('mailingListRouter.reportBlockedSignup')`
  and mock `../blockedSignups`:

```ts
it('stores a clean report and records blocked_signup_reported', async () => { /* recordBlockedSignup called once; captureServerEvent event 'newsletter/blocked_signup_reported' */ });
it('drops a report with a filled honeypot', async () => { /* not stored; spam_detected with source 'newsletter-blocked-report', reason 'honeypot' */ });
it('drops a report from a disallowed origin', async () => { /* not stored; reason 'bad_origin' */ });
it('drops a report submitted too fast', async () => { /* formLoadedAt = Date.now(); reason 'form_too_fast' */ });
it('drops a report with a junk first name', async () => { /* firstName 'VKvNcRvi'; reason 'suspicious_first_name' */ });
it('returns ok when storage throws', async () => { /* recordBlockedSignup rejects -> resolves { ok: true } */ });
it('never calls Turnstile verification', async () => { /* verifyTurnstileTokenMock not called */ });
```

  Rate-limited requests throw `TOO_MANY_REQUESTS`, the same as
  `subscribe`.

- [ ] **Step 2: Run the tests and confirm they fail**

  Run: `pnpm vitest run src/server/blockedSignups.test.ts src/server/routers/mailingList.test.ts`
  Expected: the new tests fail.

- [ ] **Step 3: Implement it**

  - **`redis.ts` and `blockedSignups.ts`:** build the Eastern date with
    `Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' })`.
  - **The mutation:** run these checks in order, the same as `subscribe`:
    1. the rate limit
    2. the origin check
    3. the honeypot
    4. form timing
    5. the junk name

    Then store the report with `at: new Date().toISOString()`. Wrap the
    store in try/catch: log the error and still return `{ ok: true }`.
    Every rejection returns `{ ok: true }` too, except the rate limit.

- [ ] **Step 4: Run the tests and confirm they pass**

  Run the same command as Step 2. Expected: all tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/server
git commit -m "feat: store signups that fail Turnstile for a daily digest"
```

### Task 3: Report blocked signups from the form

**Files:**
- Modify: `src/components/SubscriptionForm/SubscriptionForm.tsx`
- Test: `src/components/SubscriptionForm/SubscriptionForm.test.tsx`

**Interfaces:**
- Consumes:
  - `onSubmitFailed` from Task 1
  - `trpc.mailingList.reportBlockedSignup` from Task 2

- [ ] **Step 1: Write the failing tests**

  First, add `reportBlockedSignup: { useMutation: () => ({ mutate: mockReport }) }`
  to the trpc mock. Then:

```tsx
it('reports a blocked signup after a post-submit failure', () => {
  // turnstileShouldEmitToken = false; fill first name 'Ann', email 'ann@example.com'; submit; fire onError('600010')
  // expect(mockReport).toHaveBeenCalledWith(expect.objectContaining({
  //   email: 'ann@example.com', firstName: 'Ann', source: 'test', reason: '600010',
  //   path: window.location.pathname, formLoadedAt: expect.any(Number) }))
});
it('reports the wait-limit failure once', () => { /* fake timers; submit; advance 8000 -> mockReport once with reason 'token_wait_limit' */ });
it('reports a blocked signup only once per form', () => { /* fail, click Try again, fail again -> mockReport called once */ });
it('does not report a pre-submit failure', () => { /* focus, onError -> mockReport not called */ });
```

- [ ] **Step 2: Run the tests and confirm they fail**

  Run: `pnpm vitest run src/components/SubscriptionForm/SubscriptionForm.test.tsx`

- [ ] **Step 3: Implement it**

  - Pass `onSubmitFailed` to `useTurnstileGate`. Have it read the current
    field values from the refs and call `reportBlockedSignup.mutate`, with
    `path: window.location.pathname` and the honeypot value.
  - Guard it with a `hasReportedRef` so it runs at most once.
  - Don't change any UI.

- [ ] **Step 4: Run the tests and confirm they pass**, using the same
  command.

- [ ] **Step 5: Commit**

```bash
git add src/components/SubscriptionForm
git commit -m "feat: report signups that fail Turnstile after submit"
```

### Task 4: Send the daily digest

**Files:**
- Create: `src/utils/email/templates/BlockedSignupsDigest.tsx`, a React
  Email template wrapped in the existing `EmailLayout`
- Create: `src/utils/email/sendBlockedSignupsDigest.tsx`
- Modify: `src/utils/email/tags.ts`, to add
  `BlockedSignupsDigest: { name: 'category', value: 'blocked_signups_digest' }`
- Modify: `src/utils/resend.ts`, to add
  `getSubscriptionStatus(email: string): Promise<'subscribed' | 'not_subscribed' | 'unknown'>`
- Create: `src/pages/api/cron/blocked-signups-digest.ts`
- Modify: `src/utils/env.ts`, to add `CRON_SECRET: z.string().min(1)`
  (required when `isVercelProduction`, optional otherwise)
- Modify: `vercel.json`, to add
  `"crons": [{ "path": "/api/cron/blocked-signups-digest", "schedule": "0 13 * * *" }]`
- Test: `src/utils/email/sendBlockedSignupsDigest.test.ts`
- Test: `src/pages/api/cron/blocked-signups-digest.test.ts`

**Interfaces:**
- Consumes:
  - `listBlockedSignups` from Task 2
  - `easternDateKey` from Task 2
- Produces:
  - `sendBlockedSignupsDigest(dateKey: string): Promise<{ sent: boolean; count: number }>`.
    It lists the entries, looks up each one's subscription status, renders
    the template, sends one email, and captures
    `newsletter/blocked_digest_sent` `{ count, dateKey }`. With no entries,
    it sends nothing.

- [ ] **Step 1: Write the failing tests**

  In `sendBlockedSignupsDigest.test.ts`, mock `../resend` (`resend.emails.send`
  and `getSubscriptionStatus`), `@server/blockedSignups`, and `@server/posthog`:

```ts
it('sends nothing when there are no entries', async () => { /* list -> [] ; expect send not called; returns { sent: false, count: 0 } */ });
it('sends one email listing every entry', async () => {
  // two entries -> send called once; to ['delivered@resend.com'] in test env;
  // subject 'Signups blocked by Turnstile: 2 on 2026-11-03'; tags include BlockedSignupsDigest
});
it('marks entries that are already subscribed', async () => { /* status 'subscribed' -> rendered html contains 'already subscribed' */ });
it('marks an entry unknown when the contact lookup fails', async () => { /* getSubscriptionStatus rejects -> still sends; html contains 'unknown' */ });
```

  In `blocked-signups-digest.test.ts`, call the handler with mocked
  `req`/`res`:

```ts
it('rejects a request without the cron secret', async () => { /* 401, digest not sent */ });
it('sends the digest for the previous Eastern day', async () => {
  // vi.setSystemTime(new Date('2026-11-04T13:00:00Z')); Bearer secret
  // expect sendBlockedSignupsDigest called with 'blocked-signups:2026-11-03'; 200 with { sent, count }
});
```

- [ ] **Step 2: Run the tests and confirm they fail**

  Run: `pnpm vitest run src/utils/email/sendBlockedSignupsDigest.test.ts src/pages/api/cron/blocked-signups-digest.test.ts`

- [ ] **Step 3: Implement it**

  - **`getSubscriptionStatus`:** use `resend.contacts.get` with
    `env.RESEND_NEWSLETTER_AUDIENCE_ID`. A contact that exists and isn't
    unsubscribed counts as `subscribed`. A not-found response counts as
    `not_subscribed`. Any other error counts as `unknown`.
  - **The template:** a plain table with these columns: email, name, page,
    reason, time (Eastern), and status.
  - **The route:** compute yesterday as
    `easternDateKey(new Date(Date.now() - 86_400_000))`, since the cron
    runs at 13:00 UTC.
  - Preview the template with `pnpm email`.

- [ ] **Step 4: Run the tests and confirm they pass**, using the same
  command.

- [ ] **Step 5: Commit**

```bash
git add src/utils/email src/utils/resend.ts src/utils/env.ts src/pages/api/cron vercel.json
git commit -m "feat: email Mike a daily digest of signups blocked by Turnstile"
```

Before deploying, Mike adds `CRON_SECRET` to the Vercel production
environment. Note this in the PR description.

### Task 5: The end-of-post sign-off

**Files:**
- Create: `src/components/NewsletterSignup/PostSignoff.tsx`
- Test: `src/components/NewsletterSignup/PostSignoff.test.tsx`
- Modify: `src/components/SubscriptionForm/SubscriptionForm.tsx`, to add a
  `showFirstName?: boolean` prop (default `true`)
- Modify: `src/components/Post/FullPost.tsx`, to add a
  `signoff?: React.ReactNode` prop rendered after the `.prose` block and
  before `<MentionsSummary />`
- Modify: `src/lib/newsletters.ts`, to add `getLatestNewsletter()`
- Modify: `src/pages/posts/[slug].tsx` and `src/pages/newsletter/[slug].tsx`

**Interfaces:**
- Produces:
  - `PostSignoff` with props
    `{ source: 'post-signoff' | 'newsletter-signoff'; slug: string; latestIssue: { slug: string; title: string } | null }`.
  - `getLatestNewsletter(): Promise<Newsletter | null>`, which returns the
    published newsletter with the greatest `frontmatter.date`.

- [ ] **Step 1: Write the failing tests** in `PostSignoff.test.tsx`. Mock
  `SubscriptionForm` to render its props, and stub `IntersectionObserver`.

```tsx
it('renders the sign-off copy, an email-only form, and the latest issue link', () => {
  // render with latestIssue { slug: 'some-issue', title: 'Some issue' }
  // expect text /If this was useful, I write one of these every week/
  // expect form rendered with source 'post-signoff' and showFirstName false
  // expect link "Read last week's issue" with href '/newsletter/some-issue'
});
it('links to the archive when there is no newer issue', () => { /* latestIssue null -> link 'Browse past issues' href '/newsletter' */ });
it('records signoff_viewed once when half visible', () => {
  // trigger observer callback with isIntersecting true, intersectionRatio 0.5, twice
  // expect posthog.capture called once with 'newsletter/signoff_viewed', { source: 'post-signoff', slug }
});
```

  Also add `it('hides the first name field when showFirstName is false')`
  to `SubscriptionForm.test.tsx`.

- [ ] **Step 2: Run the tests and confirm they fail**

  Run: `pnpm vitest run src/components/NewsletterSignup src/components/SubscriptionForm`

- [ ] **Step 3: Implement `PostSignoff` and `showFirstName`**

  - **Copy:** the starting copy is exactly the following. It's Mike's to
    revise.

    `If this was useful, I write one of these every week. Tiny Improvements goes to <SubscriberCount /> builders.`

  - **Layout:** the `Headshot` at 56px, the copy, `SubscriptionForm` with
    `showFirstName={false}`, then the issue link. Use the riso tokens
    already in `NewsletterBannerFancy`. It should read as a personal note,
    not a banner.
  - **Tracking:** use an `IntersectionObserver` at `threshold: 0.5`. That's
    a legitimate effect, because it syncs with a browser API. Disconnect it
    after the first hit.

- [ ] **Step 4: Run the tests and confirm they pass**, using the same
  command.

- [ ] **Step 5: Wire up the pages**

  - **`getStaticProps`:** both pages call `getLatestNewsletter()`. On
    `/newsletter/[slug]`, pass `latestIssue: null` when the latest slug
    equals the current slug.
  - **Page order:** pass
    `signoff={<PostSignoff source=... slug=... latestIssue=... />}` to
    `FullPost` / `Post`. Then reorder each page to match the spec:
    1. the article
    2. `RelatedPosts`
    3. `Colophon`
  - **Removals:** remove `<NewsletterSignup />` from both pages. Leave
    `WebmentionMetadata` where it is.
  - **Check it:** run `pnpm dev`, open one post and one newsletter, and
    confirm the order: post body, sign-off, mentions, "Keep reading",
    asterisks. Make sure there's no banner and nothing scrolls sideways at
    375px width.

- [ ] **Step 6: Commit**

```bash
git add src/components src/lib/newsletters.ts src/pages/posts src/pages/newsletter
git commit -m "feat: replace the bottom banner with an end-of-post sign-off"
```

### Task 6: Stop the scroll modal and label the remaining forms

**Files:**
- Modify: `src/hooks/useNewsletterModalTrigger.ts`
- Modify: `src/components/NewsletterSignup/NewsletterModal.tsx`
- Modify: `src/pages/newsletter/index.tsx`, so its `SubscriptionForm` gets
  `source="newsletter-index"`
- Modify: `src/pages/newsletter/page/[page].tsx`, so its `SubscriptionForm`
  gets `source="newsletter-archive"`
- Test: `src/hooks/useNewsletterModalTrigger.test.ts`

**Interfaces:**
- Produces:
  - `useNewsletterModalTrigger()` with no parameters, returning
    `{ isOpen, openedBy: 'fab' | null, open, dismiss }`.
  - The `NewsletterModalTrigger` type narrows to `'fab'`.

- [ ] **Step 1: Write the failing tests**

```ts
it('does not open when the reader scrolls', () => { /* renderHook; set scrollY and dispatch 'scroll' past 90% -> isOpen false */ });
it('opens from the floating button and closes on dismiss', () => { /* act(open('fab')) -> isOpen true, openedBy 'fab'; act(dismiss) -> false */ });
```

- [ ] **Step 2: Run the test and confirm it fails**

  Run: `pnpm vitest run src/hooks/useNewsletterModalTrigger.test.ts`
  Expected: the scroll test fails.

- [ ] **Step 3: Simplify the hook**

  - Remove the scroll listener, `DO_NOT_SHOW_ON_PATHS`, the
    `scrollDepth` parameter, and the session and local storage keys. They
    only existed to throttle auto-opening.
  - Keep the `newsletter_modal_viewed` and `newsletter_modal_dismissed`
    captures in `NewsletterModal.tsx`.

- [ ] **Step 4: Run the test and confirm it passes.** Also run
  `pnpm knip` and confirm nothing new is unused.

- [ ] **Step 5: Commit**

```bash
git add src/hooks src/components/NewsletterSignup src/pages/newsletter
git commit -m "feat: stop opening the newsletter modal on scroll"
```

### Task 7: Verify the whole branch

- [ ] **Step 1: Run every check**

  Run: `pnpm vitest run && pnpm tsc --noEmit && pnpm lint && pnpm build`
  Expected: everything passes.

- [ ] **Step 2: Click through it in the browser** (`pnpm dev`; outside
  production the always-pass test keys apply)

  On a post:
  - No modal opens on scroll.
  - The sign-off appears after the body, and `newsletter/signoff_viewed`
    shows in the console or PostHog debug.
  - Focusing the email field starts Turnstile.
  - A submit succeeds.

- [ ] **Step 3: Check the Turnstile error path** by temporarily setting
  `NEXT_PUBLIC_TURNSTILE_SITE_KEY=2x00000000000000000000AB` (Cloudflare's
  always-fail test key) locally, not in a commit.

  - No error shows before a submit.
  - After a submit, the new copy and the "Try again" button show.
  - One `reportBlockedSignup` request goes out.
