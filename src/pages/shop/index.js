import React from 'react';
import Image from 'next/image';

import { DefaultLayout as Layout } from '../../components/Layouts';
import SEO from '../../components/seo';

import * as classes from '../../styles/shop.module.scss';
import SoldOut from '../../components/soldOut';

const Shop = () => (
  <Layout>
    <SEO title="Shop" />
    <main className={classes.content}>
      <h1>Shop</h1>

      <article className={classes.article}>
        <SoldOut />
        <h2 id="angry-little-egg">Angry little egg</h2>
        <p>
          If you came here for{' '}
          <a href="https://mikebifulco.com/egg-them-all">eggs</a>, we got eggs.
        </p>

        {/* eslint-disable max-len */}
        <Image
          src="https://res.cloudinary.com/mikebifulco-com/image/upload/v1632750265/egg-em.png"
          layout="fill"
          alt="egg sticker"
        />
        {/* eslint-enable max-len */}
      </article>
    </main>
  </Layout>
);

export default Shop;
