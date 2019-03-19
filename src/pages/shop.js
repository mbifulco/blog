import React from 'react'
import PropTypes from 'prop-types'

import Layout from '../components/layout'
import SEO from '../components/seo'

import classes from '../styles/shop.module.css'

const Shop = ({ location }) => {
  return (
    <Layout>
      <SEO title="Shop" location={location} />
      <main className={classes.content}>
        <h1>Shop</h1>

        <article>
          <h2 id="angry-little-egg">Angry little egg</h2>
          <p>
            If you came here for{' '}
            <a href="https://mike.biful.co/egg-them-all">eggs</a>, we got eggs.
          </p>

          {/* eslint-disable max-len */}
          <img
            src="https://images.takeshape.io/f515f67b-e56f-4df6-9601-80eeb65f2f83/dev/fca91feb-ee45-4c92-a7e3-ce625f7ce7ae/egg-em.png"
            alt="egg sticker"
          />
          {/* eslint-enable max-len */}

          <form
            action="https://www.paypal.com/cgi-bin/webscr"
            method="post"
            target="_top"
          >
            <input type="hidden" name="cmd" value="_s-xclick" />
            <input
              type="hidden"
              name="hosted_button_id"
              value="C7ZNF5ZAGTP3W"
            />
            <input
              type="image"
              src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif"
              border="0"
              name="submit"
              alt="PayPal - The safer, easier way to pay online!"
            />
            <img
              className={classes.pixel}
              alt=""
              border="0"
              src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif"
              width="1"
              height="1"
            />
          </form>
        </article>
      </main>
    </Layout>
  )
}

Shop.propTypes = {
  location: PropTypes.shape({}),
}

export default Shop
