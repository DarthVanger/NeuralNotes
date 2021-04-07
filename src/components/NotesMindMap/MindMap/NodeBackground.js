import React from 'react';

const NodeBackground = ({ height, width, padding, ...attrs }) => {
  /**
   * Svg path for the left and top border, which is then rotated by 180 degrees
   * to get the bottom and right border.
   */
  const BorderTopAndLeft = props => (
    <path
      d={`
        M 0 ${(height * 2) / 3}
        v -${(height * 2) / 3 - height / 6}
        l ${height / 6} -${height / 6}
        h ${width - (height * 2) / 3}
      `}
      stroke="#3C78C8"
      fill="transparent"
      {...props}
    />
  );

  return (
    <g transform={`translate(-${padding}, -${height - padding})`}>
      <BorderTopAndLeft />
      <BorderTopAndLeft
        transform={`rotate(180) translate(${-width}, -${height})`}
      />
    </g>
  );
};

export default NodeBackground;
