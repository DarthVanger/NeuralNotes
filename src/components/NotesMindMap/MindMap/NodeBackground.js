import React from 'react';

const NodeBackground = ({ height, width, padding }) => {
  const borderPath = `
    M 0 ${(height * 2) / 3}
    v -${(height * 2) / 3 - height / 6}
    l ${height / 6} -${height / 6}
    h ${width - (height * 2) / 3}
    m ${height / 3} ${height / 3}
    v ${(height * 2) / 3 - height / 6}
    l -${height / 6} ${height / 6}
    h -${width - (height * 2) / 3}
    m -${height / 3} -${height / 3}
  `;

  // Replacing 'm' (move) with 'l' (line) makes the border a closed loop,
  // in order to let the fill color cover everything inside.
  // This allows to create a white background behind the text,
  // which covers the lines joining the notes on the mind map.
  // Change stroke from "none" to "red" for this path to see how it looks like.
  const backgroundPath = borderPath.replaceAll(/m/g, 'l');

  return (
    <g transform={`translate(0, -${height})`}>
      <path d={backgroundPath} stroke="none" fill="white" />
      <path d={borderPath} stroke="#3C78C8" fill="transparent" />
    </g>
  );
};

export default NodeBackground;
