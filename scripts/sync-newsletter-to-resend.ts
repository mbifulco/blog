#!/usr/bin/env tsx
/**
 * Syncs newsletter MDX files to Resend broadcast drafts.
 *
 * This script:
 * 1. Detects changed newsletter files in the current PR (via git diff)
 * 2. Filters out newsletters dated before November 1, 2025
 * 3. Converts MDX content to HTML using React Email templates
 * 4. Creates or updates draft broadcasts in Resend
 *
 * Usage:
 *   pnpm tsx scripts/sync-newsletter-to-resend.ts
 *
 * Environment Variables Required:
 *   RESEND_API_KEY - Resend API key
 *   RESEND_NEWSLETTER_AUDIENCE_ID - Resend segment/audience ID
 */
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { render } from '@react-email/render';
import { isAfter, isSameDay, parseISO } from 'date-fns';
import matter from 'gray-matter';

import { NewsletterEmail } from '../src/utils/email/templates/NewsletterEmail';
import { upsertBroadcast } from '../src/utils/resend/broadcasts';

// Date cutoff: only process newsletters from November 1, 2025 onwards
const CUTOFF_DATE = new Date('2025-11-01');

// Sender for all newsletter broadcasts
const FROM_ADDRESS =
  '💌 Tiny Improvements by Mike Bifulco <hello@mikebifulco.com>';

/**
 * Parses a newsletter date string to a Date object.
 * Handles YYYY-MM-DD, MM-DD-YYYY formats, and Date objects.
 */
function parseNewsletterDate(dateStr: string | number | Date): Date {
  // If already a Date object, return it
  if (dateStr instanceof Date) {
    return dateStr;
  }

  // If it's a number (Unix timestamp), convert it
  if (typeof dateStr === 'number') {
    return new Date(dateStr);
  }

  // Try to parse as a Date string (handles various date string formats)
  const parsedDate = new Date(dateStr);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }

  // Try YYYY-MM-DD format (ISO date string)
  if (dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return parseISO(dateStr);
  }

  // Try MM-DD-YYYY format
  if (dateStr.match(/^\d{2}-\d{2}-\d{4}$/)) {
    const [month, day, year] = dateStr.split('-');
    return parseISO(`${year}-${month}-${day}`);
  }

  throw new Error(`Invalid date format: ${dateStr}`);
}

/**
 * Checks if a newsletter should be processed based on its date.
 */
function shouldProcessNewsletter(
  date: string | number | Date,
  slug: string
): boolean {
  try {
    const newsletterDate = parseNewsletterDate(date);
    // Newsletter date must be on or after the cutoff date
    const shouldProcess =
      isAfter(newsletterDate, CUTOFF_DATE) ||
      isSameDay(newsletterDate, CUTOFF_DATE);

    if (!shouldProcess) {
      console.log(`⏭️  Skipping ${slug}: dated before cutoff (${date})`);
    }

    return shouldProcess;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`⚠️  Skipping ${slug}: ${message}`);
    return false;
  }
}

/**
 * Converts custom <Image> MDX components to standard markdown image syntax.
 */
function convertImagesToMarkdown(content: string): string {
  const imageRegex = /<Image\s+publicId="([^"]+)"[^>]*\/>/g;

  return content.replace(imageRegex, (_, publicId) => {
    const cloudinaryUrl = getCloudinaryImageUrl(publicId);
    return `![](${cloudinaryUrl})`;
  });
}

// Mirrors the site's SponsoredSection band: white type on the fixed deep blue fill
const SPONSOR_BAND_BLUE = '#2340b0';
const SPONSOR_BUTTON_PINK = '#d4197a';
const SPONSOR_LINK_PINK = '#ff48b0';
// White at 75% over the band blue, as a solid color because many clients drop opacity
const SPONSOR_LABEL_WHITE = '#c8cfeb';
const SPONSOR_FONT = "Futura, Jost, 'Trebuchet MS', Arial, sans-serif";

/**
 * Converts basic markdown to HTML for sponsored section content.
 * Handles headings, bold, italic, links, and paragraphs.
 */
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Convert headings (###, ##, #)
  html = html.replace(
    /^### (.+)$/gm,
    `<h3 style="font-family: ${SPONSOR_FONT}; font-weight: 700; font-size: 22px; line-height: 1.25; margin: 0 0 8px 0; color: #ffffff;">$1</h3>`
  );
  html = html.replace(
    /^## (.+)$/gm,
    `<h2 style="font-family: ${SPONSOR_FONT}; font-weight: 700; font-size: 24px; line-height: 1.25; margin: 0 0 8px 0; color: #ffffff;">$1</h2>`
  );
  html = html.replace(
    /^# (.+)$/gm,
    `<h1 style="font-family: ${SPONSOR_FONT}; font-weight: 700; font-size: 26px; line-height: 1.25; margin: 0 0 8px 0; color: #ffffff;">$1</h1>`
  );

  // Convert bold (**text** or __text__)
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

  // Convert italic (*text* or _text_)
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Convert links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    `<a href="$2" style="color: #ffffff; text-decoration: underline; text-decoration-color: ${SPONSOR_LINK_PINK};">$1</a>`
  );

  // Convert paragraphs (lines separated by blank lines)
  html = html
    .split(/\n\s*\n/)
    .map((para) => {
      const trimmed = para.trim();
      // Don't wrap if already an HTML tag
      if (trimmed.startsWith('<')) {
        return trimmed;
      }
      return `<p style="margin: 12px 0 0 0; font-size: 17px; line-height: 1.6; color: #ffffff;">${trimmed}</p>`;
    })
    .join('\n');

  return html;
}

/**
 * Converts custom <SponsoredSection> MDX components to email-safe HTML.
 * The Markdown component in @react-email/components can handle inline HTML.
 */
function convertSponsoredSectionsToHtml(content: string): string {
  const sponsorRegex =
    /<SponsoredSection\s+([^>]+)>\s*([\s\S]*?)\s*<\/SponsoredSection>/g;

  return content.replace(sponsorRegex, (_, attributes, children) => {
    // Extract attributes
    const imagePublicId =
      attributes.match(/imagePublicId="([^"]+)"/)?.[1] || '';
    const logoPublicId = attributes.match(/logoPublicId="([^"]+)"/)?.[1] || '';
    const sponsorName = attributes.match(/sponsorName="([^"]+)"/)?.[1] || '';
    const CTAtext = attributes.match(/CTAtext="([^"]+)"/)?.[1] || '';
    const href = attributes.match(/href="([^"]+)"/)?.[1] || '';

    // Convert markdown children to HTML
    const htmlContent = convertMarkdownToHtml(children.trim());

    // Padding every logo into the same 176x40 box (2x for retina) lets the img
    // carry fixed width and height attributes, which Outlook needs to size it
    const brand = logoPublicId
      ? `<a href="${href}" style="display: inline-block;"><img src="https://res.cloudinary.com/mikebifulco-com/image/upload/f_png,c_pad,g_west,w_352,h_80,b_transparent/${logoPublicId}" alt="${sponsorName}" width="176" height="40" style="display: block; width: 176px; height: 40px; border: 0;" /></a>`
      : `<span style="font-family: ${SPONSOR_FONT}; font-weight: 700; font-size: 18px; color: #ffffff;">${sponsorName}</span>`;

    // Outlook's Word renderer ignores backgrounds on divs and links, so the band
    // and the button take their fills from table cells. The block must contain
    // no blank lines, or Markdown ends the HTML block early.
    let html = `\n\n<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${SPONSOR_BAND_BLUE}" style="background-color: ${SPONSOR_BAND_BLUE}; margin: 32px 0;"><tr><td class="sponsor-band" style="padding: 24px; color: #ffffff;">\n`;

    html += `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr>
  <td style="vertical-align: middle;">${brand}</td>
  <td style="vertical-align: middle; text-align: right;"><a href="https://mikebifulco.com/sponsor" style="font-family: ${SPONSOR_FONT}; font-size: 11px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: ${SPONSOR_LABEL_WHITE}; text-decoration: none;">Sponsor</a></td>
</tr></table>\n`;

    if (imagePublicId) {
      const imageUrl = getCloudinaryImageUrl(imagePublicId);
      html += `<a href="${href}" style="display: block; margin: 20px 0 0 0;"><img src="${imageUrl}" alt="Sponsored by ${sponsorName}" style="display: block; width: 100%; max-width: 100%; height: auto; border: 0;" /></a>\n`;
    }

    html += `<div style="margin: 20px 0 0 0;">\n${htmlContent}\n</div>\n`;

    html += `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0 0 0;"><tr>
  <td bgcolor="${SPONSOR_BUTTON_PINK}" style="background-color: ${SPONSOR_BUTTON_PINK};"><a href="${href}" style="display: inline-block; padding: 14px 20px; color: #ffffff; text-decoration: none; font-family: ${SPONSOR_FONT}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">${CTAtext}</a></td>
</tr></table>\n`;

    html += '</td></tr></table>\n\n';

    return html;
  });
}

const getCloudinaryImageUrl = (publicId: string) => {
  return `https://res.cloudinary.com/mikebifulco-com/image/upload/${publicId}`;
};

/**
 * Gets list of changed newsletter files in current PR.
 */
function getChangedNewsletters(): string[] {
  try {
    const diffOutput = execSync('git diff --name-only origin/main...HEAD', {
      encoding: 'utf-8',
    });

    const files = diffOutput
      .split('\n')
      .filter(
        (file) =>
          file.startsWith('src/data/newsletters/') && file.endsWith('.mdx')
      )
      .map((file) => path.basename(file, '.mdx'));

    return files;
  } catch (error) {
    console.error('Error getting git diff:', error);
    return [];
  }
}

/**
 * Main sync function
 */
async function main() {
  console.log('🚀 Starting newsletter sync to Resend...\n');

  // Get changed newsletters
  const changedSlugs = getChangedNewsletters();

  if (changedSlugs.length === 0) {
    console.log('✅ No newsletter changes detected. Nothing to sync.');
    process.exit(0);
  }

  console.log(`📝 Found ${changedSlugs.length} changed newsletter(s):\n`);
  changedSlugs.forEach((slug) => console.log(`   - ${slug}`));
  console.log('');

  const newslettersDir = path.join(process.cwd(), 'src/data/newsletters');
  let processed = 0;
  let skipped = 0;
  let errors = 0;

  for (const slug of changedSlugs) {
    try {
      console.log(`📰 Processing: ${slug}`);

      // Load newsletter file with gray-matter (avoids MDX dependencies)
      const filePath = path.join(newslettersDir, `${slug}.mdx`);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data: frontmatter, content } = matter(fileContents);

      // Check if newsletter has required frontmatter
      if (!frontmatter.title || !frontmatter.excerpt || !frontmatter.date) {
        console.warn(
          `⚠️  Skipping ${slug}: missing required frontmatter (title, excerpt, or date)`
        );
        skipped++;
        continue;
      }

      // Check date cutoff
      if (!shouldProcessNewsletter(frontmatter.date, slug)) {
        skipped++;
        continue;
      }

      // Convert MDX content to email-friendly format
      // 1. Convert <Image> components to markdown
      let cleanContent = convertImagesToMarkdown(content);
      // 2. Convert <SponsoredSection> components to inline HTML
      cleanContent = convertSponsoredSectionsToHtml(cleanContent);

      // Check if newsletter has sponsors (auto-detect or use frontmatter)
      const hasSponsor =
        frontmatter.hasSponsor ??
        frontmatter.disableClickTracking ??
        content.includes('<SponsoredSection');

      if (hasSponsor) {
        console.log(
          `   📊 Disabling click tracking (sponsor content detected)`
        );
      }

      // Render to HTML
      const html = await render(
        React.createElement(NewsletterEmail, {
          content: cleanContent,
          excerpt: frontmatter.excerpt,
          coverImage: frontmatter.coverImagePublicId
            ? getCloudinaryImageUrl(frontmatter.coverImagePublicId)
            : undefined,
        })
      );

      // Upsert broadcast
      const result = await upsertBroadcast({
        slug,
        subject: frontmatter.title,
        html,
        from: FROM_ADDRESS,
        disableClickTracking: hasSponsor,
      });

      if (result.data) {
        console.log(`✅ Success: ${slug}`);
        console.log(`   Broadcast ID: ${result.data.id || 'N/A'}`);
        console.log(
          `   View: https://resend.com/broadcasts/${result.data.id}\n`
        );
        processed++;
      } else if (result.error?.name === 'already_sent') {
        console.log(`⏭️  Skipped ${slug}: already sent\n`);
        skipped++;
      } else {
        console.error(`❌ Error: ${slug}`);
        console.error(`   ${result.error?.message}\n`);
        errors++;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`❌ Error processing ${slug}: ${message}\n`);
      errors++;
    }
  }

  // Summary
  console.log('━'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ Processed: ${processed}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  console.log(`   ❌ Errors: ${errors}`);
  console.log('━'.repeat(50));

  if (errors > 0) {
    process.exit(1);
  }
}

// Run the script
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
