// @flow
import React from 'react';
import logoImage from '../../../resources/logo.svg';

export default ({width, height, color, padding, margin}) => (
  <img
    src={logoImage}
    height={height}
    width={width}
    alt=""
    className="logoIcon"
  />
);
