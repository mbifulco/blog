import type React from 'react';

type PullQuoteProps = {
  author?: string;
  children: React.ReactNode;
  className?: string;
};

const PullQuote: React.FC<PullQuoteProps> = ({
  author,
  children,
  className = '',
}) => {
  return (
    <blockquote
      className={`my-8 rounded-r-lg border-l-4 border-slate-700 bg-slate-50 p-6 shadow-sm dark:border-slate-300 dark:bg-slate-800/50 ${className}`}
    >
      <div className="font-serif text-lg text-slate-700 italic dark:text-slate-200">
        {children}
      </div>

      {author && (
        <footer className="mt-4">
          <cite className="flex items-center text-sm font-medium text-slate-600 not-italic dark:text-slate-400">
            <span className="mr-2 h-px w-5 bg-slate-500 dark:bg-slate-400"></span>
            {author}
          </cite>
        </footer>
      )}
    </blockquote>
  );
};

export default PullQuote;
