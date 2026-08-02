/**
 * Coarse classification of who asked for a file. The point of the markdown
 * twins is to be read by models, so "how much of this traffic is an AI agent
 * rather than a person" is the number worth breaking these requests down by.
 *
 * Deliberately coarse: user agents are self-reported, and a finer taxonomy
 * would rot faster than it earns its keep.
 */
export type AgentCategory = 'ai-agent' | 'bot' | 'browser' | 'unknown';

/**
 * Crawlers and fetchers that serve LLM training, retrieval or in-chat browsing.
 * Matched as lowercase substrings.
 */
const AI_AGENTS = [
  'amazonbot',
  'anthropic-ai',
  'applebot-extended',
  'bytespider',
  'ccbot',
  'chatgpt-user',
  'claude-searchbot',
  'claude-user',
  'claude-web',
  'claudebot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'diffbot',
  'duckassistbot',
  'facebookbot',
  'firecrawl',
  'gptbot',
  'google-cloudvertexbot',
  'google-extended',
  'iaskbot',
  'img2dataset',
  'meta-externalagent',
  'meta-externalfetcher',
  'mistralai-user',
  'oai-searchbot',
  'omgili',
  'perplexity-user',
  'perplexitybot',
  'petalbot',
  'timpibot',
  'youbot',
];

/** Generic automation: search crawlers, scripts, link previewers. */
const BOT_HINTS = [
  'bot',
  'crawl',
  'spider',
  'curl',
  'wget',
  'headless',
  'python-requests',
  'python-urllib',
  'node-fetch',
  'axios',
  'go-http-client',
  'httpie',
  'java/',
  'libwww',
  'okhttp',
  'scrapy',
  'slurp',
  'feedfetcher',
  'monitor',
  'preview',
];

/** Real browser engines, checked only after the automation lists. */
const BROWSER_HINTS = ['mozilla/', 'applewebkit', 'gecko/', 'opera'];

export const classifyUserAgent = (
  userAgent: string | null | undefined
): AgentCategory => {
  if (!userAgent) return 'unknown';

  const ua = userAgent.toLowerCase();

  // AI agents first: several of them ("ClaudeBot", "GPTBot") would otherwise be
  // swallowed by the generic "bot" hint below.
  if (AI_AGENTS.some((agent) => ua.includes(agent))) return 'ai-agent';
  if (BOT_HINTS.some((hint) => ua.includes(hint))) return 'bot';
  // Headless crawlers spoof browser strings, so this is the last check, not the
  // first — anything reaching here claims to be a browser and nothing else.
  if (BROWSER_HINTS.some((hint) => ua.includes(hint))) return 'browser';

  return 'unknown';
};
