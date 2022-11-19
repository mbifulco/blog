import { getAllPosts } from '../../lib/blog';
import Link from './Link';

const HomePage = async () => {
  const posts = await getAllPosts();
  return (
    <>
      <h1 className="text-3xl font-bold underline text-pink-500">
        Hello world!
      </h1>
      <Link href="/sponsor">Sponsor</Link>
    </>
  );
};

export default HomePage;
