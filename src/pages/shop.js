import React from 'react';
import PropTypes from 'prop-types';

import { DefaultLayout as Layout } from '../components/Layouts';
import SEO from '../components/seo';

import classes from '../styles/shop.module.css';
import SoldOut from '../components/soldOut';

const Shop = ({ location }) => {
  return (
    <Layout>
      <SEO title="Shop" location={location} />
      <main className={classes.content}>
        <h1>Shop</h1>

        <article>
          <SoldOut />
          <h2 id="angry-little-egg">Angry little egg</h2>
          <p>
            If you came here for{' '}
            <a href="https://mikebifulco.com/egg-them-all">eggs</a>, we got
            eggs.
          </p>

          {/* eslint-disable max-len */}
          <img
            src="https://images.takeshape.io/f515f67b-e56f-4df6-9601-80eeb65f2f83/dev/fca91feb-ee45-4c92-a7e3-ce625f7ce7ae/egg-em.png"
            alt="egg sticker"
          />
          {/* eslint-enable max-len */}
        </article>
      </main>
    </Layout>
  );
};

Shop.propTypes = {
  location: PropTypes.shape({}),
};

export default Shop;
