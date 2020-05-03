import React from 'react';
import { graphql, useStaticQuery } from 'gatsby';
import Img from 'gatsby-image';

const Headshot = ({ className }) => {
  const data = useStaticQuery(graphql`
    query {
      file(relativePath: { eq: "mike-headshot-square.png" }) {
        id
        childImageSharp {
          fixed(width: 50, height: 50) {
            ...GatsbyImageSharpFixed
          }
        }
      }
    }
  `);
  return (
    <Img
      className={`headshot ${className}`}
      fixed={data.file.childImageSharp.fixed}
    />
  );
};

export default Headshot;
