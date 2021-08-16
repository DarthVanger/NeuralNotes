import React from 'react';
import styled from 'styled-components';
import {
  colors,
  nodeBorderColor,
  mindMapBackground,
  selectedNodeShadow,
} from 'colors';

const NodeBackground = ({ height, width, isSelected, isLoading, debug }) => {
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

  const DebugRectangle = () => {
    const debugRectanglePath = `
     M -${width / 2} -${height / 2}
     h ${width}
     v ${height}
     h -${width}
     v -${height}
   `;

    return <path d={debugRectanglePath} stroke="#3C78C8" fill="transparent" />;
  };

  const debugCircle = (
    <circle r={width / 2} stroke="#3C78C8" fill="transparent" />
  );

  // Replacing 'm' (move) with 'l' (line) makes the border a closed loop,
  // in order to let the fill color cover everything inside.
  // This allows to create a white background behind the text,
  // which covers the lines joining the notes on the mind map.
  // Change stroke from "none" to "red" for this path to see how it looks like.
  const backgroundPath = borderPath.replaceAll(/m/g, 'l');

  if (debug) {
    return (
      <>
        {debugCircle}
        <DebugRectangle />
      </>
    );
  }

  const nodeStyle = {
    stroke: nodeBorderColor,
    fill: 'transparent',
  };

  const selectedNodeStyle = {
    ...nodeStyle,
    stroke: colors.primary,
    filter: selectedNodeShadow,
  };

  const backgroundStyle = {
    stroke: 'none',
    fill: mindMapBackground,
  };

  const BorderPath = () => {
    if (isLoading) {
      const LoadingPath = styled.path`
        @keyframes moving-dash {
          to {
            stroke-dashoffset: 1000;
          }
        }

        animation: moving-dash 15s linear infinite;
        animation-direction: reverse;
        stroke-dasharray: 20;
      `;

      return <LoadingPath d={borderPath} style={selectedNodeStyle} />;
    }

    return (
      <path d={borderPath} style={isSelected ? selectedNodeStyle : nodeStyle} />
    );
  };

  const addMarginToBackground = () => {
    const margin = 8;
    const xScaleFactor = (width + margin * 2) / width;
    const yScaleFactor = (height + margin * 2) / height;

    const transform = `
      scale(${xScaleFactor}, ${yScaleFactor})
      translate(-${(width / 2) * (xScaleFactor - 1)}, -${(height / 2) *
      (yScaleFactor - 1)})
    `;

    return transform;
  };

  const backgroundTransform = addMarginToBackground();

  return (
    <>
      <g transform={`translate(-${width / 2}, -${height / 2})`}>
        <path
          d={backgroundPath}
          style={backgroundStyle}
          transform={backgroundTransform}
        />
        <BorderPath />
      </g>
    </>
  );
};

export default NodeBackground;
