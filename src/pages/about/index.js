import React from 'react';

import { Heading } from '@chakra-ui/react';

import Image from 'next/image';
import Metalmorphosis from './cover.png'

import { DefaultLayout as Layout } from '../../components/Layouts';
import { NewsletterSignup } from '../../components/NewsletterSignup';

const AboutPage = () => (
  <Layout>
    <Image src={Metalmorphosis} alt="Metalmorphisis, an amazing sculpture in my hometown of Charlotte, NC" />
    <Heading as="h1">
      Hey there
    </Heading>
    <p>
      {
        "I'm Mike Bifulco. I'm a technologist, a designer, and a creator of things. I started this as a place to put together my thoughts on things that I think deserve a bigger voice than twitter or GitHub."
      }
    </p>
    <p>
      {
        "My beliefs are always changing - but here's some things that are important to me:"
      }
    </p>

    <ul>
      <li>
        I believe in the power of critical thought, and the scientific process.
      </li>
      <li>
        {' '}
        I believe all people deserve fair and equitable access to all things. 🏳️‍🌈
      </li>
      <li>
        {' '}
        I know that my knowledge is imperfect, and I can be blind to my
        privilege. {"I'm"} always willing to listen.
      </li>
      <li>
        {' '}
        There is opportunity for design and technology to impact and benefit all
        facets of our life.
      </li>
      <li>
        {' '}
        Humor is a good thing. Let it in. <em>Let it in!</em>
      </li>
    </ul>

    <p>{"I'd love to hear your thoughts on my thoughts - don't be shy!"}</p>

    <NewsletterSignup />
  </Layout>
);

export default AboutPage;
