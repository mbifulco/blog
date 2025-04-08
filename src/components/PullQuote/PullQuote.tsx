import type React from "react"

type PullQuoteProps = {
  author?: string
  children: React.ReactNode
  className?: string
}

const PullQuote: React.FC<PullQuoteProps> = ({ author, children, className = "" }) => {
  return (
    <blockquote
      className={`my-8 border-l-4 border-slate-700 dark:border-slate-300 bg-slate-50 dark:bg-slate-800/50 p-6 rounded-r-lg shadow-sm ${className}`}
    >
      <div className="text-lg font-serif italic text-slate-700 dark:text-slate-200">{children}</div>

      {author && (
        <footer className="mt-4">
          <cite className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-400 not-italic">
            <span className="w-5 h-px bg-slate-500 dark:bg-slate-400 mr-2"></span>
            {author}
          </cite>
        </footer>
      )}
    </blockquote>
  )
}


export default PullQuote;
