import React from 'react';

import { Image } from '../components/Image';
import SEO from '../components/SEO';

import * as classes from '../styles/shop.module.scss';
import SoldOut from '../components/soldOut';

const Shop = () => (
  <>
    <SEO title="Shop" />
    <main className={classes.content}>
      <h1>Shop</h1>

      <article className={classes.article}>
        <SoldOut />
        <h2 id="angry-little-egg">Angry little egg</h2>
        <p>
          If you came here for{' '}
          <a href="https://mikebifulco.com/posts/egg-them-all">eggs</a>, we got
          eggs.
        </p>

        {/* eslint-disable max-len */}
        <Image publicId="egg-em" alt="egg sticker" />
        {/* eslint-enable max-len */}
      </article>
    </main>
  </>
);

export default Shop;
