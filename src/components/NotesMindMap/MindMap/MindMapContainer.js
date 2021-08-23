import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.svg`
  height: 100%;
  width: 100%;
`;

/**
 * Svg zoom and pan adopted from
 * https://stackoverflow.com/questions/52576376/how-to-zoom-in-on-a-complex-svg-structure
 */
const MindMapContainer = ({ children, focusPosition, ...attrs }) => {
  useEffect(() => {
    const svgElementRect = svgElementRef.current.getBoundingClientRect();

    svgSizeRef.current = {
      w: svgElementRect.width,
      h: svgElementRect.height,
    };

    setViewBox({
      ...viewBox,
      w: svgElementRect.width,
      h: svgElementRect.height,
    });
  }, []);

  useEffect(() => {
    const updatedViewBox = {
      w: svgSizeRef.current.w / scaleRef.current,
      h: svgSizeRef.current.h / scaleRef.current,
      x: focusPosition.x - svgSizeRef.current.w / 2,
      y: focusPosition.y - svgSizeRef.current.h / 2,
    };
    setViewBox(updatedViewBox);
  }, [focusPosition]);

  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  // If viewBox has a NaN value the app breaks, but no error is thrown
  // for some reason. So do it manually.
  Object.values(viewBox).forEach(value => {
    if (isNaN(value)) {
      throw new Error('MindMap svg viewBox has a NaN value');
    }
  });

  const svgSizeRef = useRef(null);
  const svgElementRef = useRef(null);
  const isPanningRef = useRef(false);
  const panStartPointRef = useRef();
  const panEndPointRef = useRef();
  const viewBoxOnPanStartRef = useRef();
  const scaleRef = useRef(1);

  const onWheel = e => {
    const w = viewBox.w;
    const h = viewBox.h;
    const mx = e.nativeEvent.offsetX;
    const my = e.nativeEvent.offsetY;
    const dw = w * Math.sign(e.deltaY) * 0.05;
    const dh = h * Math.sign(e.deltaY) * 0.05;
    const dx = (dw * mx) / svgSizeRef.current.w;
    const dy = (dh * my) / svgSizeRef.current.h;

    scaleRef.current = svgSizeRef.current.w / viewBox.w;

    setViewBox({
      x: viewBox.x + dx,
      y: viewBox.y + dy,
      w: viewBox.w - dw,
      h: viewBox.h - dh,
    });

    return false;
  };

  const onMouseDown = e => {
    isPanningRef.current = true;
    panStartPointRef.current = { x: e.nativeEvent.x, y: e.nativeEvent.y };
    viewBoxOnPanStartRef.current = viewBox;
  };

  const onMouseMove = e => {
    if (isPanningRef.current) {
      panEndPointRef.current = { x: e.nativeEvent.x, y: e.nativeEvent.y };
      const dx =
        (panStartPointRef.current.x - panEndPointRef.current.x) /
        scaleRef.current;
      const dy =
        (panStartPointRef.current.y - panEndPointRef.current.y) /
        scaleRef.current;
      setViewBox({
        x: viewBoxOnPanStartRef.current.x + dx,
        y: viewBoxOnPanStartRef.current.y + dy,
        w: viewBoxOnPanStartRef.current.w,
        h: viewBoxOnPanStartRef.current.h,
      });
    }
  };

  const onMouseUp = e => {
    if (isPanningRef.current) {
      panEndPointRef.current = { x: e.nativeEvent.x, y: e.nativeEvent.y };
      const dx =
        (panStartPointRef.current.x - panEndPointRef.current.x) /
        scaleRef.current;
      const dy =
        (panStartPointRef.current.y - panEndPointRef.current.y) /
        scaleRef.current;

      setViewBox({
        x: viewBoxOnPanStartRef.current.x + dx,
        y: viewBoxOnPanStartRef.current.y + dy,
        w: viewBoxOnPanStartRef.current.w,
        h: viewBoxOnPanStartRef.current.h,
      });
      isPanningRef.current = false;
    }
  };

  const onMouseLeave = () => {
    isPanningRef.current = false;
  };

  return (
    <StyledContainer
      {...attrs}
      ref={svgElementRef}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={isPanningRef.current ? { cursor: 'grab' } : {}}>
      {children}
    </StyledContainer>
  );
};

export default MindMapContainer;
