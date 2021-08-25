import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';
import throttle from 'lodash.throttle';

const StyledContainer = styled.svg`
  height: 100%;
  width: 100%;
  touch-action: none;
`;

/**
 * Svg zoom and pan adopted from: https://stackoverflow.com/a/52640900/1657101
 * And pinch on mobile from: https://stackoverflow.com/a/11183333/1657101
 */
const MindMapContainer = ({ children, focusPosition, ...attrs }) => {
  const fps = 30;

  const [viewBox, setViewBox] = useState({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  });

  const [isPanning, setIsPanning] = useState(false);

  /**
   * Move the svg drawing around when user moves mouse/finger around, holding it down.
   */
  const handlePanning = e => {
    const ex = e.clientX;
    const ey = e.clientY;
    panEndPointRef.current = { x: ex, y: ey };
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
  };

  const handleZoom = ({ x, y, delta }) => {
    const w = viewBoxRef.current.w;
    const h = viewBoxRef.current.h;
    const mx = x;
    const my = y;
    const dw = w * delta;
    const dh = h * delta;
    const dx = (dw * mx) / svgSizeRef.current.w;
    const dy = (dh * my) / svgSizeRef.current.h;

    scaleRef.current = svgSizeRef.current.w / viewBoxRef.current.w;

    setViewBox({
      x: viewBoxRef.current.x + dx,
      y: viewBoxRef.current.y + dy,
      w: viewBoxRef.current.w - dw,
      h: viewBoxRef.current.h - dh,
    });
  };

  const svgSizeRef = useRef(null);
  const svgElementRef = useRef(null);
  const panStartPointRef = useRef();
  const panEndPointRef = useRef();
  const viewBoxOnPanStartRef = useRef();
  const scaleRef = useRef(1);
  const pinchDistanceBetweenFingersRef = useRef();
  const throttledHandlePanningRef = useRef(throttle(handlePanning, 1000 / fps));
  const throttledHandleZoomRef = useRef(throttle(handleZoom, 1000 / fps));

  // Keep a copy of the state value in ref, so it can be used in the scroll event listener
  // added in useEffect. Otherwise the listener remembers only the very first value.
  const viewBoxRef = useRef(viewBox);
  viewBoxRef.current = viewBox;

  // If viewBox has a NaN value the app breaks, but no error is thrown
  // for some reason. So do it manually.
  Object.values(viewBox).forEach(value => {
    if (isNaN(value)) {
      throw new Error('MindMap svg viewBox has a NaN value');
    }
  });

  const getPinchDistanceBetweenTwoFingers = e => {
    return Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY,
    );
  };

  // Save the svg element size after it was rendered
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

  // Add mousewheel listener manually, because when it's added in JSX, it will be passive,
  // meaning that event.preventDefault() won't work.
  // We need preventDefault() for Macbook trackpad to prevent default website zoom on pinch
  // gesture: we want to zoom the svg, not the whole website.
  // See https://stackoverflow.com/a/58464810/1657101
  useEffect(() => {
    svgElementRef.current.addEventListener('mousewheel', onWheel, {
      passive: false,
    });
    return () => {
      svgElementRef.current.removeEventListener('mousewheel', onWheel);
    };
  }, []);

  // Update viewBox when focusPosition prop changes
  useEffect(() => {
    const w = svgSizeRef.current.w / scaleRef.current;
    const h = svgSizeRef.current.h / scaleRef.current;
    const updatedViewBox = {
      w,
      h,
      x: focusPosition.x - w / 2,
      y: focusPosition.y - h / 2,
    };
    setViewBox(updatedViewBox);
  }, [focusPosition]);

  const onWheel = e => {
    e.preventDefault();

    // When using the pinch gesture on Macbook trackpad, sensitivity of zoom is very
    // different from when using a mousewheel, so we have to detect it and adjust.
    // See https://kenneth.io/post/detecting-multi-touch-trackpad-gestures-in-javascript
    const isMacbookTrackpadPinchZoom = e.ctrlKey;
    const scrollZoomFactor = isMacbookTrackpadPinchZoom ? 100 : 1000;

    throttledHandleZoomRef.current({
      x: e.offsetX,
      y: e.offsetY,
      delta: -e.deltaY / scrollZoomFactor,
    });
  };

  const handleTouchStart = e => {
    if (e.touches.length === 2) {
      pinchDistanceBetweenFingersRef.current = getPinchDistanceBetweenTwoFingers(
        e,
      );
      // prevents jump when user lets one finger go earlier than the other
      setIsPanning(false);
    } else {
      onMouseDown(e.touches[0]);
    }
  };

  const handleTouchMove = e => {
    if (e.touches.length === 2) {
      const newPinchDistance = getPinchDistanceBetweenTwoFingers(e);
      const pinchDelta =
        newPinchDistance - pinchDistanceBetweenFingersRef.current;
      const centerBetweenTwoFingers = {
        x: (e.touches[0].pageX + e.touches[1].pageX) / 2,
        y: (e.touches[0].pageY + e.touches[1].pageY) / 2,
      };

      throttledHandleZoomRef.current({
        x: centerBetweenTwoFingers.x,
        y: centerBetweenTwoFingers.y,
        delta: pinchDelta / 100,
      });
      pinchDistanceBetweenFingersRef.current = newPinchDistance;
    } else {
      if (isPanning) {
        e.persist();
        throttledHandlePanningRef.current(e.touches[0]);
      }
    }
  };

  const onMouseDown = e => {
    const ex = e.clientX;
    const ey = e.clientY;
    setIsPanning(true);
    panStartPointRef.current = { x: ex, y: ey };
    viewBoxOnPanStartRef.current = viewBox;
  };

  const onMouseMove = e => {
    if (isPanning) {
      e.persist();
      e.preventDefault();
      throttledHandlePanningRef.current(e);
    }
  };

  const onMouseUp = () => {
    setIsPanning(false);
  };

  const onMouseLeave = () => {
    setIsPanning(false);
  };

  return (
    <StyledContainer
      {...attrs}
      ref={svgElementRef}
      viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
      onMouseDown={onMouseDown}
      onTouchStart={handleTouchStart}
      onMouseUp={onMouseUp}
      onMouseMove={onMouseMove}
      onTouchMove={handleTouchMove}
      onMouseLeave={onMouseLeave}
      style={isPanning ? { cursor: 'grab' } : {}}>
      {children}
    </StyledContainer>
  );
};

export default MindMapContainer;
