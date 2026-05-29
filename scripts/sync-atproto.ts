#!/usr/bin/env npx tsx
/**
 * Syncs blog posts and newsletters to AT Protocol as standard.site records.
 *
 * Creates or updates:
 * - site.standard.publication: one record representing this blog
 * - site.standard.document: one record per published post and newsletter
 *
 * AT-URIs are stored in src/data/generated/atproto-documents.json so the
 * Next.js build can include them in page <head> link tags without needing
 * AT Protocol credentials at build time.
 *
 * The /.well-known/site.standard.publication file is also written so
 * standard.site-compatible readers can discover this publication.
 *
 * Usage:
 *   pnpm sync:atproto
 *
 * Environment variables required:
 *   ATPROTO_IDENTIFIER  - Bluesky handle (e.g. mikebifulco.com) or DID
 *   ATPROTO_APP_PASSWORD - App password from bsky.app/settings/app-passwords
 */

import 'dotenv/config';

import fs from 'fs';
import path from 'path';

import matter from 'gray-matter';

import { ATPROTO_DID, BASE_SITE_URL } from '../src/config';
import {
  buildDocumentRecord,
  buildPublicationRecord,
} from '../src/utils/atproto';

const PDS_URL = 'https://bsky.social';

const ATPROTO_DOCUMENTS_PATH = path.join(
  process.cwd(),
  'src/data/generated/atproto-documents.json'
);
const WELL_KNOWN_PATH = path.join(
  process.cwd(),
  'public/.well-known/site.standard.publication'
);

// ─── AT Protocol HTTP helpers ────────────────────────────────────────────────

type Session = { accessJwt: string };

async function createSession(
  identifier: string,
  password: string
): Promise<Session> {
  const res = await fetch(`${PDS_URL}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password }),
  });
  if (!res.ok) throw new Error(`Login failed: ${await res.text()}`);
  return res.json() as Promise<Session>;
}

async function createRecord(
  session: Session,
  collection: string,
  record: unknown
): Promise<{ uri: string }> {
  const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({ repo: ATPROTO_DID, collection, record }),
  });
  if (!res.ok) throw new Error(`createRecord failed: ${await res.text()}`);
  return res.json() as Promise<{ uri: string }>;
}

async function putRecord(
  session: Session,
  collection: string,
  rkey: string,
  record: unknown
): Promise<{ uri: string }> {
  const res = await fetch(`${PDS_URL}/xrpc/com.atproto.repo.putRecord`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.accessJwt}`,
    },
    body: JSON.stringify({ repo: ATPROTO_DID, collection, rkey, record }),
  });
  if (!res.ok) throw new Error(`putRecord failed: ${await res.text()}`);
  return res.json() as Promise<{ uri: string }>;
}

// ─── Local data helpers ──────────────────────────────────────────────────────

type AtprotoData = {
  publicationUri: string | null;
  documents: Record<string, string>;
};

function loadAtprotoData(): AtprotoData {
  const raw = fs.readFileSync(ATPROTO_DOCUMENTS_PATH, 'utf-8');
  return JSON.parse(raw) as AtprotoData;
}

function saveAtprotoData(data: AtprotoData): void {
  fs.writeFileSync(
    ATPROTO_DOCUMENTS_PATH,
    JSON.stringify(data, null, 2) + '\n'
  );
}

function writeWellKnown(publicationUri: string): void {
  fs.mkdirSync(path.dirname(WELL_KNOWN_PATH), { recursive: true });
  fs.writeFileSync(WELL_KNOWN_PATH, publicationUri);
}

type ContentFrontmatter = {
  title: string;
  slug: string;
  date: string | number | Date;
  published?: boolean;
  excerpt?: string;
  tags?: string[];
};

function readContentDirectory(dir: string): ContentFrontmatter[] {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) return [];

  return fs
    .readdirSync(dirPath)
    .filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dirPath, file), 'utf-8');
      const { data } = matter(raw);
      return data as ContentFrontmatter;
    })
    .filter(
      (fm): fm is ContentFrontmatter =>
        !!fm.slug && !!fm.title && fm.published !== false
    );
}

function atUriToRkey(atUri: string): string {
  return atUri.split('/').at(-1) ?? '';
}

// ─── Sync logic ──────────────────────────────────────────────────────────────

const CREATE_ONLY = process.argv.includes('--create-only');

async function syncPublication(
  session: Session,
  data: AtprotoData
): Promise<string> {
  const record = buildPublicationRecord({
    url: BASE_SITE_URL,
    name: 'Mike Bifulco',
    description:
      'Resources for modern software designers and developers. Tips and walkthroughs on React, node, and javascript.',
  });

  if (data.publicationUri) {
    const rkey = atUriToRkey(data.publicationUri);
    await putRecord(session, 'site.standard.publication', rkey, record);
    console.log(`Updated publication record: ${data.publicationUri}`);
    return data.publicationUri;
  }

  const { uri } = await createRecord(session, 'site.standard.publication', record);
  console.log(`Created publication record: ${uri}`);
  return uri;
}

async function syncDocument(
  session: Session,
  data: AtprotoData,
  publicationUri: string,
  slug: string,
  contentPath: string,
  frontmatter: ContentFrontmatter
): Promise<string> {
  const record = buildDocumentRecord(publicationUri, contentPath, frontmatter);

  if (data.documents[slug]) {
    if (CREATE_ONLY) {
      return data.documents[slug];
    }
    const rkey = atUriToRkey(data.documents[slug]);
    await putRecord(session, 'site.standard.document', rkey, record);
    console.log(`  Updated: ${slug}`);
    return data.documents[slug];
  }

  const { uri } = await createRecord(session, 'site.standard.document', record);
  console.log(`  Created: ${slug} → ${uri}`);
  return uri;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  const identifier = process.env.ATPROTO_IDENTIFIER;
  const password = process.env.ATPROTO_APP_PASSWORD;

  if (!identifier || !password) {
    console.error(
      'ATPROTO_IDENTIFIER and ATPROTO_APP_PASSWORD environment variables are required.'
    );
    process.exit(1);
  }

  const session = await createSession(identifier, password);
  console.log(`Authenticated as ${identifier}`);

  const data = loadAtprotoData();

  console.log('\nSyncing publication...');
  const publicationUri = await syncPublication(session, data);
  data.publicationUri = publicationUri;

  console.log('\nSyncing posts...');
  const posts = readContentDirectory('src/data/posts');
  for (const fm of posts) {
    data.documents[fm.slug] = await syncDocument(
      session,
      data,
      publicationUri,
      fm.slug,
      `/posts/${fm.slug}`,
      fm
    );
  }

  console.log('\nSyncing newsletters...');
  const newsletters = readContentDirectory('src/data/newsletters');
  for (const fm of newsletters) {
    data.documents[fm.slug] = await syncDocument(
      session,
      data,
      publicationUri,
      fm.slug,
      `/newsletter/${fm.slug}`,
      fm
    );
  }

  saveAtprotoData(data);
  writeWellKnown(publicationUri);

  console.log(
    `\nDone. ${posts.length} posts and ${newsletters.length} newsletters synced.`
  );
  console.log(
    'Commit src/data/generated/atproto-documents.json and public/.well-known/site.standard.publication to apply changes on next build.'
  );
}

main().catch((err: unknown) => {
  console.error('sync-atproto failed:', err);
  process.exit(1);
});
