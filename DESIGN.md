---
name: Mike Bifulco
description: A two-ink risograph zine for founders and product builders, printed weekly.
colors:
  riso-pink: "#c21469"
  riso-pink-bright: "#ff48b0"
  riso-blue: "#2340b0"
  stock: "#f5f7fb"
  stock-raised: "#ffffff"
  ink: "#17182a"
  ink-muted: "#55576c"
  tint-pink: "#ffe0ef"
  tint-blue: "#dde3f8"
  pink-fill: "#d4197a"
  blue-fill: "#2340b0"
  on-fill: "#ffffff"
  destructive: "#c42b1c"
  code-ink: "#141a3d"
  riso-pink-dark: "#ff5cb0"
  riso-blue-dark: "#8399ff"
  stock-dark: "#121318"
  stock-raised-dark: "#1a1b22"
  ink-dark: "#eceaf3"
  ink-muted-dark: "#a3a5b8"
  tint-pink-dark: "#221820"
  tint-blue-dark: "#181a23"
  goose-orange: "#ff7a1a"
typography:
  display:
    fontFamily: "TAY Dumpling (var(--font-dumpling))"
    fontSize: "clamp(3.25rem, 13vw, 9rem)"
    fontWeight: 400
    lineHeight: 0.86
    letterSpacing: "normal"
  headline:
    fontFamily: "Futura, Jost, Trebuchet MS, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Futura, Jost, Trebuchet MS, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Source Serif 4, Georgia, serif"
    fontSize: "1.25rem"
    fontWeight: 400
    lineHeight: 1.625
  section:
    fontFamily: "Futura, Jost, Trebuchet MS, Arial, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  meta:
    fontFamily: "Futura, Jost, Trebuchet MS, Arial, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 700
    lineHeight: 1.25
  ui:
    fontFamily: "Futura, Jost, Trebuchet MS, Arial, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
  label:
    fontFamily: "Futura, Jost, Trebuchet MS, Arial, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "0.12em"
  mono:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.33
rounded:
  none: "0px"
spacing:
  gutter: "16px"
  plate-offset: "12px"
  stack-sm: "12px"
  stack-md: "32px"
  section: "64px"
  section-md: "80px"
  container: "72rem"
  measure: "68ch"
components:
  button-primary:
    backgroundColor: "{colors.pink-fill}"
    textColor: "{colors.on-fill}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.blue-fill}"
    textColor: "{colors.on-fill}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.riso-blue}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
    padding: "8px 16px"
  button-outline-hover:
    backgroundColor: "{colors.pink-fill}"
    textColor: "{colors.on-fill}"
  input-text:
    backgroundColor: "{colors.stock-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "1ch 2ch"
    height: "44px"
  nav-item:
    backgroundColor: "transparent"
    textColor: "{colors.riso-blue}"
    typography: "{typography.ui}"
    padding: "8px 12px"
    height: "36px"
  nav-item-hover:
    textColor: "{colors.riso-pink}"
  pagination-active:
    backgroundColor: "{colors.blue-fill}"
    textColor: "{colors.on-fill}"
    typography: "{typography.ui}"
    rounded: "{rounded.none}"
  newsletter-band:
    backgroundColor: "{colors.tint-pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "32px"
  code-block:
    backgroundColor: "{colors.code-ink}"
    typography: "{typography.mono}"
    rounded: "{rounded.none}"
  callout-pink:
    backgroundColor: "{colors.tint-pink}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
---

# Design System: Mike Bifulco

## Overview

**Creative North Star: "The Weekly Riso Zine"**

The site is a two-ink risograph zine Mike prints every week: fluorescent pink and federal blue laid on a cool white stock, with the inks overprinting (multiply) where they cross. In dark mode the same two inks print on black stock and the overprint switches to screen. It deliberately refuses the default dev blog: a neutral surface, one accent, and a uniform grid of rounded cards.

Character comes from print craft, not decoration. Display type is printed slightly out of register, covers sit on an offset blue plate, structure is drawn with ink rules instead of boxes, and halftone dots are the only texture. The reading column is quiet serif on stock; everything loud happens at the masthead, the cover, and the solid ink bands. A small pixel-art goose is the house mascot, honking from the nav and charging across the top of the footer.

The density is editorial: generous section gaps, one lead story with a newsletter band printed under it, then a tiered "Lately" list. Headings say what a section is; there are no eyebrows. Corners are square everywhere.

**Key Characteristics:**
- Two inks only (pink and blue) on stock; tints are diluted ink, not new hues.
- Light and dark print the same inks; dark follows `prefers-color-scheme`.
- Misregistered display type: blue face with a bright pink copy nudged down and right.
- Cover art always sits on an offset blue plate.
- Ink rules (2px) divide; there are no rounded cards and no drop shadows.
- Mono is reserved for dates and code.
- No eyebrows above headings; metadata trails the excerpt in a single meta line.
- A pixel-art goose mascot, the one place a third color (orange) is allowed.

## Colors

Two fluorescent-leaning inks, pink and blue, on a near-white (or near-black) stock, with diluted tints of each ink for grounds.

### Primary
- **Fluorescent Riso Pink** (`riso-pink`): the brand color carried over from years of cover art. Used for links' underline color, the content type in meta lines, small labels, bullets and list counters, focus rings, the selection highlight (bright variant), ink rules under the hero strap and the TL;DR, and the hover state of every blue text link. In dark mode it lifts to `riso-pink-dark` so it holds on black.
- **Bright Overprint Pink** (`riso-pink-bright`): the second plate. Only used for the misregistered copy behind display type, the halftone dots, and text selection. Never for running text.

### Secondary
- **Federal Riso Blue** (`riso-blue`): the "text ink." Headings, links, nav items, the masthead face, the cover plate, and the structural 2px rules (nav underline, section headers, footer top). Lifts to `riso-blue-dark` in dark mode.

### Tertiary
- **Goose Orange** (`goose-orange`): beak and feet of the pixel goose only. Fixed in both themes. It is a deliberate exception to the two-ink rule because orange is what makes the goose read as a goose.

### Neutral
- **Cool White Stock** (`stock`) / **Black Stock** (`stock-dark`): the page ground. The light stock leans slightly blue so the federal blue sits in it, not on it.
- **Raised Stock** (`stock-raised` / `stock-raised-dark`): input fields, popovers, toasts.
- **Press Ink** (`ink` / `ink-dark`): body copy.
- **Faded Ink** (`ink-muted` / `ink-muted-dark`): dates, excerpts in lists, captions, TOC links at rest.
- **Pink Tint** (`tint-pink`) and **Blue Tint** (`tint-blue`): diluted ink grounds. Pink tint grounds the newsletter box, default callouts, highlights, and menu hover; blue tint grounds the footer, info callouts, inline code, and hover on blue controls. In dark mode both become desaturated near-stock grounds (`tint-pink-dark`, `tint-blue-dark`) so a tinted region reads as a quiet change of paper, not a colored panel.
- **Hairline** (blue at 22% via `color-mix`): default border color for lighter dividers; inputs use blue at 40%.

### Solid fills
- **Deep Pink Fill** (`pink-fill`), **Deep Blue Fill** (`blue-fill`), **On Fill** (`on-fill`): solid ink bands and buttons. These do not remap in dark mode; they stay deep with white text in both themes so the button contrast never flips.
- **Code Ink** (`code-ink`): a fixed, very deep federal blue that code blocks print on in both themes. Line numbers use the bright overprint pink; syntax token colors stay Night Owl's.

### Named Rules
**The Two Ink Rule.** Every color on the page is pink, blue, a tint of one of them, or stock and ink. No third hue enters the system; the goose's orange is the only sanctioned exception, and it lives inside the mascot.

**The Same Inks Rule.** Dark mode is the same print on black stock, not a different palette. It is implemented by remapping the riso tokens and Tailwind's gray, slate, pink, white, and black palette variables under `prefers-color-scheme: dark`; the `dark:` variant is intentionally inert, so never write `dark:` utilities (they would flip twice).

**The Fixed Fill Rule.** Solid pink and blue fills (buttons, the announcement band, active pagination, the double rule) use the fixed fill tokens with white text, and code blocks use the fixed code ink, in both themes.

## Typography

**Display Font:** TAY Dumpling (local woff), for the masthead wordmark and the footer wordmark
**Headline / UI Font:** Futura (system on Apple platforms), with Jost loaded as the cross-platform stand-in, then Trebuchet MS, Arial. This is the default `font-sans` stack, applied on the app's font wrapper; `html` carries the same stack without the Jost variable so portaled UI (dialogs, toasts, menus) rendered outside the wrapper still gets Futura.
**Body Font:** Source Serif 4 (normal and italic), with Georgia. Used for article prose and for prose-like UI copy: the hero bio, the newsletter pitch and fine print, the TL;DR body, excerpts, and the footer disclaimer.
**Mono:** the system mono stack, for dates and code only (plus the `⌘K` key cap in the nav).

**Character:** A chunky, rounded hand-cut wordmark against a geometric, all-business Futura, with a warm book serif for the actual reading. The pairing reads like a zine masthead over a well-set essay.

### Hierarchy
- **Display** (Dumpling 400, `clamp(3.25rem, 13vw, 9rem)`, line-height 0.86, uppercase): the two-line "MIKE BIFULCO" masthead on the home page, and the closing wordmark in the footer on every other page. Always misregistered.
- **Headline** (Futura 700, `clamp(2.25rem, 6vw, 4.5rem)`, line-height 0.98, -0.02em, uppercase, max 18ch): article titles, misregistered.
- **Title** (Futura 700, 1.875 to 2.25rem for the lead story, 1.5rem for featured items, 1.125rem for list items, tight leading, slight negative tracking): feed and related-post titles, in blue, turning pink on hover.
- **Body** (Source Serif 4 400, 1.25rem, line-height 1.625, measure 68ch): article prose, list items, and excerpts. Article deks run at 1.25 to 1.5rem in faded ink, max 54ch.
- **Section** (Futura 700, 1.875rem, -0.01em, blue, over a 2px blue rule): real section headings that name what follows: "Lately", "Keep reading". Smaller siblings at 1.25 to 1.5rem: "Browse by topic", "Explore by topic" (ink, in the footer); "In this article" heads the TOC at 0.875rem in ink.
- **Meta** (Futura 700, 0.875rem, faded ink): the meta line that trails an excerpt or the article dek. It reads date (mono) · N min read · topic · type on articles, where the topic appears only when at least two tags match one, and date · type in feeds and related posts. In feeds "💌 Tiny Improvements" is pink and "Article" stays faded ink; on the article page the type is always pink. Breadcrumbs, tags, and social links are the same Futura bold at 0.75rem.
- **UI** (Futura 700, 0.8rem, 0.08 to 0.1em tracking, uppercase): nav items and buttons.
- **Label** (Futura 700, 0.75rem, 0.12em tracking, uppercase, pink): a small marker, never above a heading. Used only for the TL;DR box marker, the group labels in the mobile menu, and the shared page subtitle on secondary listing pages.
- **Mono** (0.75rem): publish dates; inline code at 0.85em in blue on blue tint; code blocks.

Prose headings (h1 through h6 inside `.prose`) are set in Dumpling by the typography plugin; headings rendered through the shared `Heading` component are blue Futura bold with balanced wrapping.

### Named Rules
**The Misregistration Rule.** Display and headline type that carries the misregistration is blue with a bright pink duplicate offset (0.045em, 0.03em) and blended with the theme's overprint mode. It needs a `data-text` copy of its content. Reserve it for the masthead, article titles, and the footer wordmark; never apply it to running text or small sizes.

**The Mono Is Dates and Code Rule.** Monospace appears only for dates and code. Tags, breadcrumbs, social links, pagination, and the copyright line are Futura bold; pagination numerals use tabular figures instead of mono.

**The No Eyebrow Rule.** Nothing sits above a heading to label it. A section is named by a real heading; an item's type, date, read time, and topic trail its excerpt in the meta line.

## Layout

A single centered container (`container`, 72rem) with a 16px side gutter on all widths. Pages stack sections with large gaps (`section` 64px, `section-md` 80px from md up); the footer sits 96px below content.

- **Home:** thin ink-rule nav; the giant two-line masthead with a pink halftone disc tucked behind its top right; a pink-ruled strap (2px rules above and below) holding the headshot, serif bio line, and social links. Below it, the lead story in a `1.35fr / 1fr` grid, vertically centered: cover on its plate at left; title, serif excerpt, and meta line at right. Directly under it, the full-width newsletter band. Then the "Lately" section heading: four featured items in two columns, a lighter blue hairline, and the rest in two to three columns.
- **Article:** breadcrumbs, the misregistered uppercase title, the serif dek, then the meta line with tags beneath it, and the full-width cover on its plate. The body is a two-column grid from md up: the reading column at `minmax(0, 68ch)` and a 15rem sticky margin (top 4rem) holding Copy as Markdown, the table of contents, and the Carbon ad. On mobile the margin collapses away and Copy as Markdown moves under the dek.
- **Paginated feeds and related posts:** a uniform one/two/three-column grid with 32px column gaps and 48px row gaps.
- Plated images reserve 12px on their right and bottom so the plate never collides with neighbors.

## Elevation & Depth

The system is flat. There are no drop shadows anywhere; inputs explicitly drop the shadcn shadow. Depth is printed, not lit: the only "lift" is the offset blue plate under cover images, which overprints (multiply, or screen in dark) and slides a further 0.3rem down-right on hover with a long ease-out (0.45s, `cubic-bezier(0.16, 1, 0.3, 1)`). Tint grounds (pink, blue) separate regions tonally.

### Named Rules
**The Plate, Not Shadow Rule.** Cover art sits on a solid blue plate offset 12px down and right, blended as ink. This is misregistration, not a shadow: never soften it, blur it, or tint it gray, and never use it on non-image containers.

## Shapes

Every corner is square. Buttons, inputs, pagination, toasts (`borderRadius: 0`), callouts, the goose tile, and the headshot are all sharp rectangles. The only circle in the system is the halftone disc behind the masthead.

Structure is drawn with ink rules: 2px blue rules under the nav, under section heads, and across the footer top; 2px pink rules above and below the hero strap, the TL;DR, and callouts (top and bottom only, never four-sided boxes); 1px blue hairlines at 30% between list tiers and footer columns. The horizontal rule in prose is a double rule: a pink line over a blue line nudged 8px right, half the column wide.

### Named Rules
**The No Card Rule.** Content is never boxed in rounded, shadowed cards. A feed item is a plated cover plus type, separated by space and rules.

## Components

### Buttons
Solid ink, square, and loud.
- **Shape:** square (`rounded.none`) with a 2px border in the fill color.
- **Primary:** deep pink fill with white uppercase Futura UI type, 8px by 16px padding, 44px tall in forms.
- **Hover / Focus:** swaps to the deep blue fill (color transition only, no movement). Focus shows the global 2px pink outline at a 3px offset. Disabled drops to 60% opacity.
- **Outline (topic chips):** 2px blue border, blue text; on hover the border turns pink and the chip fills deep pink with white text.

### Chips / Tags
- **Style:** inline text, not pills: a pink `#` followed by the tag in faded ink, in Futura bold at 0.75rem; underline on hover.
- **Topic chips:** see the outline button. They carry text only, no emoji icons.

### Copy as Markdown
- Square, transparent, 2px blue ink rule, blue Futura bold 0.75rem with a small line icon; hover grounds it in blue tint. No shadow. It sits in the article's sticky margin from md up and under the dek on mobile.

### Callouts (Aside, TL;DR, newsletter box)
- **Corner Style:** square.
- **Background:** pink tint by default; blue tint for info and note; destructive at 10% for warnings.
- **Border:** 2px rules top and bottom only (pink, or blue for info).
- **Internal Padding:** 16px by 20px for asides; the TL;DR has no ground, just its rules and a pink label.
- **Newsletter box:** solid pink tint ground. Halftone is confined to a 12px printed strip (6px dots) along the top edge; copy never sits on dots. A Futura title in ink, then a serif pitch that ends "Join N other builders" with the live count in pink Futura bold, then the form and serif fine print. The **full** variant stacks everything with a 72px headshot and the sponsor line (max 48rem wide). The **band** variant, used under the home lead story, is full width: pitch on the left and form on the right (`1fr / 1.1fr` from md up, 32px padding), with no headshot or sponsor line.

### Sponsor band
- A tipped-in insert in the reading column: the fixed deep blue fill with white type in both themes, square, with a 12px bright pink halftone strip (6px dots, normal blend) along the top edge. No asterisk colophons around it.
- **Header row:** the sponsor's logo (a version made for dark grounds, 32px tall) at left and a "Sponsor" label at right in white at 75%, linking to `/sponsor`. The disclosure lives here, never as a line above the heading.
- **Body:** Futura bold title at 1.5rem in white, serif copy at 1.125rem in white at 90%, max 60ch. Links are white with a bright pink underline.
- **CTA:** the primary button, left aligned under the copy. On the blue ground its hover inverts to a white fill with blue text, and its focus ring is white.
- Sponsor brand colors are not used; the sponsor's identity comes from its logo. The email version in `scripts/sync-newsletter-to-resend.ts` mirrors this band and must change with it.

### Inputs / Fields
- **Style:** raised stock ground, 2px solid blue border, square, 44px tall, `1ch 2ch` padding, faded-ink placeholder, no shadow. Stacked fields share a border (the upper field drops its bottom border).
- **Focus:** the global pink outline.

### Navigation
- **Style:** a single row over a 2px blue rule. Left: the goose neck rising from behind the rule (56 to 72px tall) and either the Dumpling "MIKE BIFULCO" wordmark in pink, or, on the home page where the masthead is the wordmark, a pink uppercase "Build products that matter" line that wraps to two lines on small phones.
- **Items:** deliberately short: Newsletter, About, Search, then the CTA. Futura UI type in blue; hover and the current page turn pink with no background. Search is an icon until lg, where it adds the label and a mono `⌘K` key in a faint blue box. Topics, browse links, and the podcast live in the mobile panel and the footer.
- **CTA:** "💌 Subscribe" in the primary button style at the end of the row, linking to `/subscribe`.
- **Mobile (below md):** a hamburger reveals a stacked panel with labeled groups and a full-width pink subscribe button.
- **Goose hover:** the neck lifts 2px and a halftone burst pops off the bill in stepped frames (the burst only shows on hover or keyboard focus).

### Pagination
- Square Futura bold numerals with tabular figures, in blue; hover grounds them in blue tint. The active page is a solid deep blue fill with white text.

### Code blocks
- Printed on the fixed code ink in both themes, square, full bleed on mobile and column width from sm up. Line numbers in bright overprint pink in a non-selectable gutter; Night Owl token colors for syntax. A copy button floats at the top right. Inline code is blue on blue tint.

### Feed item
- Plated cover (link, hidden from assistive tech), a Futura title in blue that turns pink on hover, a serif excerpt in faded ink clamped to two or three lines, then the meta line (mono date · type, with "💌 Tiny Improvements" in pink).

### Pixel Goose (signature)
A pixel-art goose drawn as crisp-edged SVG rects: white body, blue eye and wing ink, orange beak and feet.
- **Frames:** `stand` and `step` are the upright honk; `charge` and `chargeStep` are the neck-out hiss. Each step frame dips the head one pixel so a walk bobs.
- **Variants:** `outline` inks a one-pixel blue (themed) edge so it reads on any ground; `tile` sets it on a fixed deep-blue square.
- **Nav neck (`GooseNeck`):** a separate pixel drawing of just the neck and honking head, leaning slightly right, with a straight neck that flares into the chest. Its bottom rows sit hidden behind the nav rule so it can rise on load and lift on hover without a gap. The bill has no outline so its open V stays legible at nav size.
- **Footer walker:** outline variant, alternating `charge` and `chargeStep` every 0.25s, crossing right to left along the footer's top rule over 34s. Under reduced motion it stands still near the right edge.
- Colors are fixed, not themed (except the outline ink), so the goose looks the same in both modes.

### Masthead and wordmark
The home masthead is the display style, misregistered, with a pink halftone disc (9px dot grid, 60% opacity) at the top right, sized to the masthead's height so it never crosses the strap rule. The disc is a live halftone screen drawn on canvas: dots near the cursor swell, print in the blue plate out of register, and spring away from the pointer; a click sends a ripple; every 8 to 13s idle it halftones a glyph (the goose, a heart, the colophon asterisk), easing in from the center out. Typing `honk`, `<3`, or `*` on the page prints the matching glyph. Glyphs are skipped when the disc is under 18 dots across. On every other page the footer closes with the same wordmark at `clamp(2.5rem, 11vw, 7.5rem)` on the blue-tint footer.

## Do's and Don'ts

### Do:
- **Do** build every color from the riso tokens (`riso-pink`, `riso-blue`, tints, `ink`, `stock`) so dark mode prints correctly without extra work.
- **Do** put cover images on the offset blue plate and leave 12px of room on its right and bottom.
- **Do** use the fixed fill tokens with white text for any solid band or button.
- **Do** divide content with 2px ink rules (blue for structure, pink for emphasis) and space, not boxes.
- **Do** set reading text in Source Serif 4 at 1.25rem in a column no wider than 68ch, and use the serif for prose-like UI copy (bios, pitches, summaries, disclaimers).
- **Do** keep the TAY Dumpling wordmark, Futura headings, pixel-art covers, and hot pink; they are brand commitments.
- **Do** honor `prefers-reduced-motion` for the load-in, the plate shift, the goose rise and hover, the goose walk, and the halftone disc (which keeps only its hover recolor and typed glyphs, cut in and out without easing).

### Don't:
- **Don't** write `dark:` utilities; the variant is inert and dark mode comes from the palette remap.
- **Don't** introduce a third hue beyond the goose's orange, and don't recolor the goose.
- **Don't** round corners or wrap feed items in shadowed cards.
- **Don't** use drop shadows; depth is the plate and the tints.
- **Don't** use mono for anything but dates and code.
- **Don't** put an eyebrow or kicker above a heading; name the section with a real heading and trail metadata in the meta line.
- **Don't** set copy on halftone; keep the dots to rims, strips, and the masthead disc.
- **Don't** apply the misregistration to body copy, buttons, or anything smaller than a title.
- **Don't** add textures other than the halftone dot.
- **Don't** use emoji as icons in navigation or topic links.
