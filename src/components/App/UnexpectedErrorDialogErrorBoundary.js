import React from 'react';

/**
 * The AppErrorBoundary will show the UnexpectedErrorDialog.
 * But UnexpectedErrorDialog might also throw an error during render (theoretically).
 * So this is a dead simple fallback in case the dialog fails to render, so the user
 * sees at least something instead of a white screen.
 */
class UnexpectedErrorDialogErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <>
          <h1>
            Something went wrong. Please report the problem or refresh the
            browser tab.
          </h1>
        </>
      );
    }

    return this.props.children;
  }
}

export default UnexpectedErrorDialogErrorBoundary;
