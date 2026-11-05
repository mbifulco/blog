# Newsletter signup conversion: on-site changes

Date: 2026-11-03
Status: draft for review

## Why

mikebifulco.com turns about 0.4% of visits into newsletter subscribers (16
signups in the 30 days to Nov 3, from about 1,550 post visitors). Readers who
land on strong posts read them to the end, so the problem is what happens
around the content, not the content itself.

PostHog and Cloudflare data from that period show two causes:

1. **The signup form often looks broken.** About 430 people hit a Turnstile
   error on mikebifulco.com, roughly 190 of them real readers. 18 people who
   hit an error tried to subscribe, and only 6 got through.
2. **The ask comes at the wrong moment and in the wrong voice.** The modal
   opens at 50% scroll: 476 people saw it, 368 closed it, and 1 subscribed.
   The bottom-of-post banner sits below "Keep reading" and got 2 signup
   attempts in 30 days.

The goal: readers get real value from the post, and subscribing feels like a
natural next step rather than an interruption.

## What we know about the Turnstile failures

Turnstile has been on the form since June 2026 (`cf85d73f`). The Oct 13 change
(`39d6b105`) only made failures visible: before it, the subscribe button
stayed grayed out with no explanation.

- **Widget:** `newsletter-spam-protection`, sitekey
  `0x4AAAAAADkNF163_hdHwRki`, Managed mode, hostname mikebifulco.com, no
  pre-clearance. Unchanged since it was created.
- **Server verification works.** A production request with a dummy token
  returned 403. Cloudflare counted 5 siteverify calls from Oct 28 to Nov 3,
  all passing. The dashboard's "Siteverify isn't being called" warning is a
  low-volume false alarm.
- **Root cause of the largest failure group (confirmed).** The widget runs as
  soon as the page loads, while the form is far below the fold. In Managed
  mode, Cloudflare sometimes wants a click. Nobody sees the request, so it
  times out and retries about every 125 seconds for as long as the tab stays
  open (`challenge_timeout`, 181 people). Cloudflare, Oct 28 to Nov 3:
  19,416 challenges started, 9,351 passed with no click needed, and only 4
  passed after a click.
- **Other failures:**
  - 300/600-series codes (about 240 people): Cloudflare judged the browser to
    be a bot. This mixes real bots with privacy browsers and VPNs.
  - `script_load_failed` (82 people): a content blocker stopped the script.
  - `110200`: Vercel preview hostnames. Not a production problem.
- **Turnstile is the only effective bot gate.** About 900 bot requests in 60
  days posted straight to the API with no token. They used real-looking
  addresses and sent no honeypot or `formLoadedAt`, so the honeypot and
  timing checks don't stop them.

## Goals

1. Readers never see a verification error unless they have tried to subscribe.
2. When Cloudflare needs a click, the request appears while the reader is at
   the form.
3. Nothing interrupts reading. The main ask on each post and newsletter
   issue comes at the end of the content, in Mike's voice. Quiet, always-on
   links (the pink announcement bar and the 💌 button) stay. They don't
   interrupt, and they barely send anyone to signup pages (2 visits to
   `/newsletter` came from posts in 30 days), so they won't skew the
   sign-off's numbers.
4. Readers who fail verification aren't lost. Mike gets a daily digest of
   them and decides who to add by hand.
5. Readers who aren't ready to subscribe have an obvious next thing to read.
6. We can measure a seen-to-subscribed rate for the new ask and compare it
   with the modal baseline (1 subscriber per 476 views).

## Non-goals

- Promotion and distribution work: re-promoting posts, resubmitting to HN,
  adding UTM tags to newsletter links, and the Oct 26 click anomaly. That's a
  later project.
- A mid-article prompt. It's deferred until the end-of-post sign-off has
  data, so we can tell which change worked.
- Replacing Turnstile. Resend's email verification API was considered and
  rejected for now: it only works in Chrome through an origin trial, only for
  Gmail, and does nothing against bots that post straight to the API.
- Redesigning `/subscribe` or the `/newsletter` index. They already convert
  better than posts.

## Anti-goals

These would make the project a failure even if everything technically works:

- **Letting people subscribe without a Turnstile token.** That would have let
  about 900 bot signups with real people's addresses onto the list in 60
  days, hurting sender reputation. The server must keep rejecting tokenless
  requests.
- **Sending confirmation emails to addresses bots submitted.** For the same
  reason, a double opt-in fallback for tokenless signups is out of scope.
- **A pitch that reads as marketing,** such as hype copy, stacked CTAs, or
  something that pops up over the post.
- **Adding failed-verification signups to the list automatically.** They
  reach the list only when Mike adds them.

## Decisions

### 1. Turnstile runs when the reader starts filling in the form

- Render the widget with `execution: 'execute'`. Start the challenge
  (`ref.execute()`) the first time the reader focuses or types in either form
  field, and again on submit if it hasn't started yet. `appearance` stays
  `interaction-only`.
- The `waiting` / `error` status text in `TurnstileStatus` shows only after
  the reader has submitted. If the widget fails before then, the gate records
  the failure quietly. On submit, it resets and runs again once, then waits
  for a token. *(Claude's call.)* The automatic re-run happens only for
  failures from before the submit. A failure after the submit goes straight
  to the error.
- **Wait limit.** After a submit, the existing 8-second limit still applies.
  It pauses while Cloudflare is showing a click challenge: use Turnstile's
  `before-interactive-callback` / `after-interactive-callback`, which the
  library exposes as `onBeforeInteractive` and `onAfterInteractive`. That
  way, a reader who is busy clicking isn't failed. *(Claude's call.)*
- **One error message for every failure reason.** *(Claude's call.)* The
  form can't reliably tell whether a blocker was the cause: a blocked script
  reports only to the first widget on the page. Draft copy: "We couldn't
  finish our spam check. A content blocker or privacy setting is the usual
  cause. Allow challenges.cloudflare.com and try again." Keep the "Try again"
  button. Don't link to `/subscribe`, which uses the same check. Mike
  approves the final wording. Readers aren't told about the digest below.
- **Fire `newsletter/turnstile_error` at most once per form instance per
  page view,** carrying the first `reason`. If the widget recovers and fails
  again after a submit attempt, that may fire once more, marked as having
  happened after the reader submitted.
- **The subscribe endpoint doesn't change.** Tokenless requests keep getting
  the silent fake success.

### 2. A daily digest of signups that failed verification

- **Capture.** When a submit ends in the Turnstile error state, the form
  calls a new tRPC mutation, `mailingList.reportBlockedSignup`, with:
  - the email and first name
  - the form's `source`
  - the page path
  - the gate's failure reason
  - the honeypot value
  - `formLoadedAt`

  It fires once per form per page view. The reader's UI doesn't change.
- **Filtering.** The mutation runs the same checks as `subscribe`, except
  Turnstile:
  - the rate limit
  - the origin allowlist
  - the honeypot
  - the form-timing check
  - the junk-name filter

  A request that fails any of them is dropped silently and recorded as
  `newsletter/spam_detected` with `source: 'newsletter-blocked-report'`.
  Anything that passes goes into Upstash Redis, which the repo already uses
  for rate limiting. Store it under a per-day key (US Eastern time),
  deduplicated by lowercased email, with a 7-day expiry. Each entry holds
  the email, first name, source, path, reason, and timestamp.
- **Digest.** A Vercel cron job runs a protected API route once a day at
  about 8am Eastern. The route checks a `CRON_SECRET` bearer token. It reads
  the previous day's entries and sends one transactional email through Resend
  from `hello@mikebifulco.com` to `hello@mikebifulco.com`. The email lists
  each entry and marks addresses that are already subscribers. If there are
  no entries, it sends nothing.
- **Tracking.** The server records `newsletter/blocked_signup_reported` for
  each stored entry and `newsletter/blocked_digest_sent` with a count for
  each digest.
- **Out of scope:** a one-click "subscribe this person" link in the digest.
  Mike adds people by hand in Resend.

### 3. The end-of-post sign-off replaces the scroll modal and the bottom banner

On `/posts/[slug]` and `/newsletter/[slug]`:

- **A new sign-off block** sits right after the post body, inside the article
  column, above `MentionsSummary`. It contains:
  - Mike's headshot (the existing `Headshot` component).
  - Two short sentences in Mike's first-person voice, along the lines of: "If
    this was useful, I write one of these every week. Tiny Improvements goes
    to {SubscriberCount}+ builders." Final copy is Mike's to approve.
  - The subscription form, email only (no first-name field), with a `source`
    of `post-signoff` or `newsletter-signoff`.
  - A "Read last week's issue" link to the most recent published newsletter.
    On a newsletter page whose issue is the most recent one, link to the
    `/newsletter` archive instead.
- **Page order** *(Claude's call)*:
  1. The post body, then the sign-off and `MentionsSummary`, all inside the
     article column. The sign-off lives in `FullPost`.
  2. Directly after the article, "Keep reading" at full width, keeping its
     current component, grid, and tag-based selection.
  3. The `Colophon` asterisks and `WebmentionMetadata`, moved below "Keep
     reading" so nothing sits between the end of the article and it.

  `MentionsSummary` is often empty, so in most cases the sign-off is
  directly followed by "Keep reading".
- **Remove the bottom `NewsletterSignup` banner** from both pages.
- **Stop the modal from opening on scroll anywhere on the site.** The 💌
  floating button stays and still opens the modal. The scroll code in
  `useNewsletterModalTrigger` goes, and `trigger: 'scroll'` stops appearing.
- **The design follows the site's existing riso style.** It should read as a
  personal note, not a promo box.

### 4. Tracking

- **`newsletter/signoff_viewed`** fires once per page view when the sign-off
  is at least half visible. It carries `source` and the page slug. Combined
  with `newsletter/subscribed` filtered by the same `source`, this gives the
  seen-to-subscribed rate.
- **Forms without a source get one.** The newsletter index and paginated
  archive forms pass `newsletter-index` and `newsletter-archive`.

## Constraints

- **Read the Next.js docs first.** This repo pins Next 16.4.4 with
  non-standard conventions. Read `node_modules/next/dist/docs/` before
  writing code (see `AGENTS.md`).
- **Turnstile library:** `@marsidev/react-turnstile` 1.6.3 supports
  `options.execution` and `ref.execute()`.
- **Existing behavior to keep:** the honeypot, the `formLoadedAt` timing
  check, the client-side junk-name filter, and every PostHog event name the
  form already sends.
- **Tests:** `SubscriptionForm.test.tsx` covers the current gate. Update it
  and extend it for the deferred start and the error that appears only after
  a submit.
- **Language:** all copy and comments in US English.
- **New environment variable:** `CRON_SECRET`, required in Vercel
  production. The cron schedule goes in `vercel.json`, which currently has
  no crons.

## Left to the builder

- Exactly how the sign-off looks, within the site's riso style.
- What the digest email looks like. Plain, scannable, and built with the
  existing React Email setup is enough.
- How to look up the most recent newsletter at build time.
- Whether `NewsletterBannerFancy` keeps its `full` variant once posts stop
  using it. Other pages still use it.

## How we'll judge it

Check two to four weeks after shipping:

- **Fewer Turnstile errors:** `newsletter/turnstile_error` drops sharply,
  because the widget now only runs for readers who start filling in the form.
- **Signups get through:** the share of `attempting_subscribe` that reaches
  `subscribed` rises from about 1 in 3 among readers who hit errors.
- **The sign-off converts:** its seen-to-subscribed rate is well above the
  modal's 0.2%.
- **More signups from posts:** weekly new subscribers rise from the baseline
  of 4 or 5.
- **The digest is useful:** it arrives only on days with entries, and most
  of its entries look like real people rather than bots.
