import { Image } from '../components/Image';
import SEO from '../components/seo';

import SoldOut from '../components/soldOut';
import type { NextPage } from 'next';

const Shop: NextPage = () => (
  <>
    <SEO
      title="Shop - stickers, design files, digital downloads, and other stuff I've made"
      description="I occasionally design and sell things in small runs - stickers, design files, whitepapers, digital downloads, and other stuff I've made."
    />
    <main className={'w-full max-w-3xl text-left p-5 mx-auto mb-5'}>
      <h1 className="justify-center">Shop</h1>

      <article className={'relative max-w-[45%] bg-gray-50 rounded p-2'}>
        <SoldOut />
        <h2 className="m-0" id="angry-little-egg">
          Angry little egg
        </h2>
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
