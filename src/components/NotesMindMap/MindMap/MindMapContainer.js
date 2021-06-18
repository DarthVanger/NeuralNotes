import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  position: absolute;
  bottom: 0;
  height: calc(100% - 125px);
  width: 100%;
  overflow: scroll;
`;

const scrollByMouseDrag = (() => el => {
  let isMouseDown = false;
  const clickPosition = {};
  const clickScroll = {};

  const scroll = e => {
    const dx = e.pageX - clickPosition.x;
    const dy = e.pageY - clickPosition.y;
    el.current.scroll(clickScroll.x - dx, clickScroll.y - dy);
  };

  const pauseEvent = e => {
    e.stopPropagation();
    e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  };

  return {
    onMouseMove: e => {
      pauseEvent(e);
      isMouseDown && scroll(e);
    },
    onMouseDown: e => {
      e.persist();
      pauseEvent(e);
      const isClickOnSvg = e.target == el.current.querySelector('svg');
      if (isClickOnSvg) {
        isMouseDown = true;
        clickScroll.y = el.current.scrollTop;
        clickScroll.x = el.current.scrollLeft;
        clickPosition.y = e.pageY;
        clickPosition.x = e.pageX;
        el.current.style.cursor = 'grab';
      }
    },
    onMouseUp: () => {
      isMouseDown = false;
      el.current.style.cursor = 'auto';
    },
  };
})();

const MindMapContainer = ({ children, initialFocusPosition }) => {
  const containerRef = useRef(null);
  useEffect(() => {
    if (initialFocusPosition) {
      const viewBoxWidth = containerRef.current.offsetWidth;
      const viewBoxHeight = containerRef.current.offsetHeight;
      containerRef.current.scrollLeft =
        initialFocusPosition.x - viewBoxWidth / 2;
      containerRef.current.scrollTop =
        initialFocusPosition.y - viewBoxHeight / 2;
    }
  });

  return (
    <StyledContainer ref={containerRef} {...scrollByMouseDrag(containerRef)}>
      {children}
    </StyledContainer>
  );
};

export default MindMapContainer;
