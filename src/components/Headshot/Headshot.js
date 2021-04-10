import React from 'react';
import PropTypes from 'prop-types';
import { graphql, useStaticQuery } from 'gatsby';
import { GatsbyImage } from "gatsby-plugin-image";

const Headshot = ({ className }) => {
  const data = useStaticQuery(graphql`{
  file(relativePath: {eq: "mike-headshot-square.png"}) {
    id
    childImageSharp {
      gatsbyImageData(width: 50, height: 50, layout: FIXED)
    }
  }
}
`);
  return (
    <GatsbyImage
      image={data.file.childImageSharp.gatsbyImageData}
      style={{ borderRadius: '12px' }}
      className={`headshot ${className}`} />
  );
};

Headshot.propTypes = {
  className: PropTypes.string,
};

export default Headshot;
