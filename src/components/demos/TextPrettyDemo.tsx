'use client';

import { useEffect, useRef, useState } from 'react';

const paragraphs = [
  '"What giants?" said Sancho Panza.',
  '"Those thou seest there," answered his master, "with the long arms, and some have them nearly two leagues long."',
  '"Look, your worship," said Sancho, "what we see there are not giants but windmills, and what seem to be their arms are the sails that turned by the wind make the millstone go."',
  'And so saying, he gave the spur to his steed Rocinante, heedless of the cries his squire Sancho sent after him, warning him that most certainly they were windmills and not giants he was going to attack. He, however, was so positive they were giants that he neither heard the cries of Sancho, nor perceived, near as he was, what they were.',
];

const paraClass =
  'hyphens-auto font-serif text-base leading-relaxed text-slate-800 mb-4 last:mb-0';

export const TextPrettyDemo = () => {
  const [width, setWidth] = useState(65);
  const [isDesktop, setIsDesktop] = useState(false);
  const [prettyEnabled, setPrettyEnabled] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setPanelVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const textWrapValue = prettyEnabled ? 'pretty' : 'wrap';

  return (
    <div className="not-prose my-6">
      {/* Desktop: side-by-side panels with width slider above */}
      <div className="hidden md:flex md:flex-col md:gap-4">
        <div className="flex items-center gap-4">
          <label
            htmlFor="width-slider"
            className="shrink-0 text-sm font-medium text-slate-600"
          >
            Column width: {width}%
          </label>
          <input
            id="width-slider"
            type="range"
            min={30}
            max={100}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="flex-1"
          />
        </div>

        <div
          className="grid grid-cols-2 gap-4"
          style={{ width: isDesktop ? `${width}%` : '100%' }}
        >
          <div className="rounded-sm border border-slate-200 bg-white p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">
              Default
            </p>
            {paragraphs.map((text, i) => (
              <p key={i} className={paraClass} lang="en" style={{ textWrap: 'wrap' }}>
                {text}
              </p>
            ))}
          </div>

          <div className="rounded-sm border border-pink-200 bg-pink-50 p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-widest text-pink-400">
              text-wrap: pretty
            </p>
            {paragraphs.map((text, i) => (
              <p key={i} className={paraClass} lang="en" style={{ textWrap: 'pretty' }}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: single panel with sticky controls bar */}
      <div className="md:hidden">
        <div
          ref={panelRef}
          className={`rounded-sm border pb-24 pt-4 transition-all ${
            prettyEnabled
              ? 'border-pink-200 bg-pink-50'
              : 'border-slate-200 bg-white'
          }`}
          style={{ paddingLeft: `${(100 - width) / 2}%`, paddingRight: `${(100 - width) / 2}%` }}
        >
          <p
            className={`mb-3 text-xs font-bold uppercase tracking-widest ${
              prettyEnabled ? 'text-pink-400' : 'text-slate-400'
            }`}
          >
            {prettyEnabled ? 'text-wrap: pretty' : 'Default'}
          </p>
          {paragraphs.map((text, i) => (
            <p
              key={i}
              className={paraClass}
              lang="en"
              style={{ textWrap: textWrapValue }}
            >
              {text}
            </p>
          ))}
        </div>

        {/* Sticky bottom control bar — only shown while the demo panel is in view */}
        <div className={`fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-sm transition-transform duration-200 ${panelVisible ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <span className="shrink-0 text-xs font-medium text-slate-500">
                Width: {width}%
              </span>
              <input
                type="range"
                min={30}
                max={100}
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="flex-1"
              />
            </div>
            <button
              onClick={() => setPrettyEnabled((v) => !v)}
              className={`w-full rounded-sm py-2 text-sm font-semibold transition-colors ${
                prettyEnabled
                  ? 'bg-pink-500 text-white'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {prettyEnabled ? 'text-wrap: pretty ✓' : 'text-wrap: pretty — tap to enable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextPrettyDemo;
