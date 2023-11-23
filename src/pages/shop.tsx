import type { NextPage } from 'next';

import { Heading } from '../components/Heading';
import { Image } from '../components/Image';
import SEO from '../components/seo';
import SoldOut from '../components/soldOut';

const Shop: NextPage = () => (
  <>
    <SEO
      title="Shop - stickers, design files, digital downloads, and other stuff I've made"
      description="I occasionally design and sell things in small runs - stickers, design files, whitepapers, digital downloads, and other stuff I've made."
    />
    <main className={'mx-auto mb-5 w-full max-w-3xl p-5 text-left'}>
      <h1 className="justify-center">Shop</h1>

      <article className={'relative max-w-[45%] rounded bg-gray-50 p-2'}>
        <SoldOut />
        <Heading as="h2" className="m-0" id="angry-little-egg">
          Angry little egg
        </Heading>
        <p className="m-0">
          If you came here for{' '}
          <a href="https://mikebifulco.com/posts/egg-them-all">eggs</a>, we got
          eggs.
        </p>

        <Image publicId="egg-em" alt="egg sticker" className="mx-0 my-8" />
      </article>
    </main>
  </>
);

export default Shop;
