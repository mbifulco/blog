import { useEffect, useRef } from 'react';
import posthog from 'posthog-js';

import Link from '@components/Link';
import { Headshot } from '../Headshot';
import { SubscriptionForm } from '../SubscriptionForm';
import SubscriberCount from './SubscriberCount';

type PostSignoffProps = {
  source: 'post-signoff' | 'newsletter-signoff';
  slug: string;
  latestIssue: { slug: string; title: string } | null;
};

const PostSignoff: React.FC<PostSignoffProps> = ({
  source,
  slug,
  latestIssue,
}) => {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    let recorded = false;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries.some((e) => e.isIntersecting && e.intersectionRatio >= 0.5)
        )
          return;
        if (recorded) return;
        recorded = true;
        posthog.capture('newsletter/signoff_viewed', { source, slug });
        observer.disconnect();
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [source, slug]);

  return (
    <section
      ref={ref}
      data-pagefind-ignore
      aria-label="Subscribe to Tiny Improvements"
      className="border-riso-pink mt-12 flex flex-col gap-4 border-t-2 pt-8"
    >
      <div className="flex items-start gap-4">
        <Headshot size={56} className="h-14 w-14 shrink-0 object-cover" />
        <p className="m-0 text-pretty font-serif text-lg leading-snug">
          If this was useful, I write one of these every week. Tiny Improvements
          goes to{' '}
          <strong className="text-riso-pink font-futura">
            <SubscriberCount /> builders
          </strong>
          .
        </p>
      </div>
      <div className="bg-tint-pink p-4 sm:p-6">
        <SubscriptionForm source={source} showFirstName={false} />
      </div>
      <p className="text-ink-muted m-0 font-serif text-sm">
        {latestIssue ? (
          <Link href={`/newsletter/${latestIssue.slug}`}>
            Read last week&apos;s issue: {latestIssue.title}
          </Link>
        ) : (
          <Link href="/newsletter">Browse past issues</Link>
        )}
      </p>
    </section>
  );
};

export default PostSignoff;
