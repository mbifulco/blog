import { BlogPost, Newsletter } from 'src/data/content-types';

export const SeriesNavigation = ({
  seriesName,
  posts,
  newsletters,
}: {
  seriesName: string;
  posts?: BlogPost[];
  newsletters?: Newsletter[];
}) => {
  const seriesLength = posts?.length ?? 0 + (newsletters?.length ?? 0);
  return (
    <nav className="flex flex-col gap-4 rounded-md border-2 border-gray-200 p-4">
      <header>
        <h2>{seriesName}</h2>
        <p>{seriesLength} posts</p>
      </header>
    </nav>
  );
};
