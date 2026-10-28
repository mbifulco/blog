import Link from '@components/Link';

const PODCAST_EMBED_URL =
  'https://share.transistor.fm/e/tiny-improvements/playlist?color=F90476';

const PodcastSidebar: React.FC = () => {
  return (
    <section
      aria-labelledby="podcast-heading"
      className="border-riso-blue grid gap-6 border-t-2 pt-6 md:grid-cols-[1fr_1.6fr] md:gap-12"
    >
      <div className="flex flex-col gap-3">
        <h2
          id="podcast-heading"
          className="text-riso-blue m-0 text-balance font-futura text-2xl font-bold leading-tight"
        >
          Tiny Improvements, out loud
        </h2>
        <Link
          href="/podcast"
          className="text-riso-pink font-futura text-sm font-bold"
        >
          All episodes →
        </Link>
      </div>
      <iframe
        width="100%"
        height="200"
        src={PODCAST_EMBED_URL}
        title="Tiny Improvements podcast player"
        loading="lazy"
      />
    </section>
  );
};

export default PodcastSidebar;
