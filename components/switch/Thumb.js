import React from 'react';
import PropTypes from 'prop-types';

const factory = (ripple) => {
  const Thumb = ({theme, ...other }) => (
    <span className={theme.thumb} {...other} />
  );

  Thumb.propTypes = {
    children: PropTypes.node,
    onMouseDown: PropTypes.func,
    theme: PropTypes.shape({
      ripple: PropTypes.string,
      thumb: PropTypes.string,
    }),
  };

  return ripple(Thumb);
};

export default factory;
