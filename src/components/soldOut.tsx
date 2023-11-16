import * as classes from '../styles/soldout.module.scss';

const soldOut = () => (
  <figure className={classes['sold-out'] as string}>
    <div>Sold Out!</div>
  </figure>
);

export default soldOut;
