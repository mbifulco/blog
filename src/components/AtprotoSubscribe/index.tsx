'use client';

import { useState } from 'react';

import atprotoData from '@data/atproto-documents.json';

const publicationUri = (atprotoData as { publicationUri: string }).publicationUri;

const AtprotoSubscribe: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(publicationUri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-row flex-wrap items-center gap-2 text-xs text-gray-500">
      <span className="font-medium">AT Protocol:</span>
      <code className="max-w-[240px] truncate rounded bg-gray-100 px-2 py-0.5 text-gray-600">
        {publicationUri}
      </code>
      <button
        onClick={handleCopy}
        className="rounded border border-gray-300 px-2 py-0.5 text-gray-500 transition-colors hover:bg-gray-100"
        aria-label="Copy AT Protocol publication URI"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

export default AtprotoSubscribe;
