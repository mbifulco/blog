import Script from 'next/script';

type ThreadsEmbedProps = {
  url: string;
};

// Make sure to have TailwindCSS properly set up in your project
const ThreadsEmbed: React.FC<ThreadsEmbedProps> = ({ url }) => {
  return (
    <>
      <Script async defer src="https://www.threads.net/embed.js" />
      <blockquote
        className="text-post-media"
        data-text-post-permalink={url}
        data-text-post-version="0"
      ></blockquote>
    </>
  );
};

export default ThreadsEmbed;
