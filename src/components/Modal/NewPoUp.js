import React from 'react';
import { ToastContainer } from 'react-toastify';
import styled, { keyframes } from 'styled-components';
import 'react-toastify/dist/ReactToastify.minimal.css';

import Transition from 'react-transition-group/Transition';

const FadeInAndOut = ({ children, position, nodeRef, ...props }) => {
  delete props.onExited;
  delete props.preventExitTransition;
  const node = nodeRef.current;

  console.log(props);

  const onEnter = () => {
    if (nodeRef.current) {
      nodeRef.current.classList.add('fadeIn');
    }
  };

  const onExit = () => {
    if (nodeRef.current) {
      nodeRef.current.classList.remove('fadeIn');
      nodeRef.current.classList.add('fadeOut');
    }
  };

  return (
    <Transition
      {...props}
      timeout={800}
      unmountOnExit
      onEnter={onEnter}
      onExit={onExit}>
      {children}
    </Transition>
  );
};

const fadeIn = keyframes`
  0% {
    opacity: 0.1;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0.1;
  }
`;

const StyledToast = styled(ToastContainer).attrs({
  className: 'toast-container',
  toastClassName: 'toast',
  bodyClassName: 'body',
  progressClassName: 'progress',
})`
  a {
    color: white;
  }

  p {
    text-transform: uppercase;
  }

  .close-button {
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    padding: 0;
    margin: 0;
    position: absolute;
    right: 8px;
    top: 8px;
  }

  .toast {
    align-items: center;
    background-color: blue;
    color: white;
    display: flex;
    justify-content: center;
    left: 0;
    margin: 0 auto;
    max-height: 48px;
    position: fixed;
    padding: 8px 0;
    right: 0;
    top: 0;
    width: 100%;
    z-index: 1;
  }

  .fadeIn {
    animation: ${fadeIn} 1s ease-in;
  }

  .fadeOut {
    animation: ${fadeOut} 1s ease-in;
  }

  .Toastify__toast--success {
    background-color: blue;
  }

  .Toastify__toast--warning {
    background-color: red;
  }
`;

const CloseButton = ({ closeToast }) => {
  return (
    <button className="close-button" onClick={closeToast} type="button">
      X
    </button>
  );
};

const Toast = () => {
  return (
    <StyledToast
      autoClose={false}
      closeButton={<CloseButton />}
      closeOnClick={false}
      draggable={false}
      pauseOnHover
      newestOnTop
      transition={FadeInAndOut}
    />
  );
};

export default Toast;
