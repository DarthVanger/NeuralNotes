import React, { useRef } from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  position: absolute;
  bottom: 0;
  height: calc(100% - 125px);
  width: 100%;
  overflow: scroll;
`;

const scrollByMouseDrag = (() => el => {
  console.log('111 el: ', el);
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
    onMouseUp: e => {
      isMouseDown = false;
      el.current.style.cursor = 'auto';
    },
  };
})();

const MindMapContainer = ({ children }) => {
  const containerRef = useRef(null);
  return (
    <StyledContainer ref={containerRef} {...scrollByMouseDrag(containerRef)}>
      {children}
    </StyledContainer>
  );
};

export default MindMapContainer;

//  componentDidUpdate(prevProps) {
//    if (prevProps.nodes.length !== this.props.nodes.length) {
//      const el = this.mindMapContainerRef.current;
//      const depth = getDepth(this.props.nodes, this.props.edges);
//
//      el && depth > 1 && el.scroll(el.scrollLeft + 250, el.scrollTop + 250);
//    }
//  }
