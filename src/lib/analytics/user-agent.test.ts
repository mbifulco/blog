import { describe, expect, it } from 'vitest';

import { classifyUserAgent } from './user-agent';

describe('classifyUserAgent', () => {
  it('recognises AI crawlers and in-chat fetchers', () => {
    const agents = [
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; ClaudeBot/1.0; +claudebot@anthropic.com)',
      'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot)',
      'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)',
      'Mozilla/5.0 (compatible; OAI-SearchBot/1.0; +https://openai.com/searchbot)',
      'Mozilla/5.0 (compatible; CCBot/2.0; +https://commoncrawl.org/faq/)',
      'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)',
    ];

    for (const agent of agents) {
      expect(classifyUserAgent(agent), agent).toBe('ai-agent');
    }
  });

  it('separates generic automation from AI agents', () => {
    expect(classifyUserAgent('curl/8.7.1')).toBe('bot');
    expect(classifyUserAgent('python-requests/2.32.3')).toBe('bot');
    expect(
      classifyUserAgent(
        'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
      )
    ).toBe('bot');
  });

  it('recognises real browsers', () => {
    expect(
      classifyUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15'
      )
    ).toBe('browser');
  });

  it('falls back to unknown for missing or unrecognisable agents', () => {
    expect(classifyUserAgent(null)).toBe('unknown');
    expect(classifyUserAgent('')).toBe('unknown');
    expect(classifyUserAgent('something-bespoke/1.0')).toBe('unknown');
  });
});
