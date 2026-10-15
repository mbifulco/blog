# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Founders and product builders** reading essays and Tiny Improvements newsletter issues. They come for one idea per piece and stay for the author's perspective. Success: they subscribe to the newsletter.
- **Developers arriving from search** on a single tutorial (React, Next.js, CSS, AI tooling). They want the answer fast, then a reason to read the next piece.

## Product Purpose

mikebifulco.com is Mike Bifulco's personal publishing home: technical articles, Tiny Improvements newsletter issues, and the Tiny Improvements podcast, in one unified feed. It exists to share hard-won lessons on building products and to grow the newsletter audience.

## Positioning

Written by a practicing founder and CTO (co-founder & CTO at Craftwork, Y Combinator alum, ex-Googler) with a design and development background. Pieces are grounded in shipping real products, not in commentary.

## Operating Context

- Content is MDX in `src/data/posts` and `src/data/newsletters`; cover images are hosted on Cloudinary.
- Readers arrive mostly on individual article URLs, from search and social, and less often on the home page.
- Newsletter signup is protected by Turnstile and appears inline, in a modal, and in the site announcement bar.
- Pagefind search, RSS, webmentions, Carbon ads, and Copy-as-Markdown are existing features.

## Capabilities and Constraints

- Next.js pages router with Tailwind v4 and shadcn/ui primitives.
- Light and dark themes; dark follows the OS setting.

## Brand Commitments

- Typography: the TAY Dumpling wordmark and Futura display headings are signature and must stay.
- Cover art: the illustrated pixel-art cover style (chunky title type plus a pixel-art scene) is signature and must stay.
- Hot pink stays as the brand color: it is baked into years of existing cover images, and the site must sit comfortably beside them.
- The wiggle pattern and the asterisk colophon are current traits but not binding; they may evolve.
- Voice: first person, warm, a little irreverent ("irreverentmike"), with emoji used sparingly (💌 for Tiny Improvements).

## Evidence on Hand

- Real subscriber count is fetched live (`useNewsletterStats`); never hard-code or inflate it.
- Headshot: Cloudinary `mike-headshot-square`.
- No testimonials or press quotes exist in the repo; do not invent any.

## Product Principles

1. The reading comes first: an article page is for reading, and everything else waits until the reader is done.
2. One clear next step: after reading, offer the newsletter or the next related piece, not a wall of options.
3. Personality through craft: character comes from type, covers, and details, not from decoration.
4. Every piece stands alone: most readers arrive on one article, so each page must introduce Mike and the newsletter on its own.
