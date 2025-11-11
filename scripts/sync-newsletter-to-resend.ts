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
 * Converts custom <Image> MDX components to standard <img> tags with Cloudinary URLs.
 */
function convertImagesToHtml(content: string): string {
  // Match <Image publicId="path/to/image" ... />
  const imageRegex = /<Image\s+publicId="([^"]+)"[^>]*\/>/g;

  return content.replace(imageRegex, (_, publicId) => {
    const cloudinaryUrl = getCloudinaryImageUrl(publicId);
    return `![](${cloudinaryUrl})`;
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

      // Convert MDX content to markdown-friendly format
      const cleanContent = convertImagesToHtml(content);

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
