import Link from '@components/Link';
import { Heading } from '@components/Heading';
import { Headshot } from '@components/Headshot';
import config from '@/config';

type HomeHeroProps = {
  priorityImage?: boolean;
};

const HomeHero: React.FC<HomeHeroProps> = ({ priorityImage }) => {
  return (
    <div className="my-4 items-start gap-4 md:flex">
      <div className="mr-0 overflow-clip rounded-xl lg:mr-4">
        <Headshot size={250} priority={priorityImage} />
      </div>
      <div className="prose prose-xl max-w-[50ch]">
        <Heading as="h1" className="m-0 mb-2 text-4xl font-bold">
          Mike Bifulco
        </Heading>
        <p className="m-0 text-lg font-medium text-gray-600 dark:text-gray-400">
          Developer Advocate & Startup CTO
        </p>
        <p className="text-xl font-normal italic">
          I work as a {config.employer.role} at{' '}
          <Link
            href={config.employer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline"
          >
            {config.employer.name}
          </Link>{' '}
          &mdash; I&apos;m a founder &amp; product builder with background in
          design and development.
        </p>
        <p className="m-0 text-xl font-normal">
          Find me on Bluesky{' '}
          <Link
            href="https://bsky.app/profile/mikebifulco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline"
          >
            @mikebifulco.com
          </Link>
          {', '}Threads{' '}
          <Link
            href="https://threads.net/@irreverentmike"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline"
          >
            @irreverentmike
          </Link>{' '}
          or{' '}
          <Link
            className="text-pink-600 hover:underline"
            href="https://hachyderm.io/@irreverentmike"
          >
            Mastodon
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default HomeHero;
