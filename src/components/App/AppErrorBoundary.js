import React from 'react';
import { connect } from 'react-redux';
import { unexpectedErrorAction } from 'components/App/AppActions';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { error };
  }

  render() {
    if (this.state.error) {
      this.props.dispatchUnexpectedError(this.state.error);
      return (
        <h1 style={{ marginTop: 0, padding: '0.5em' }}>
          Something went wrong. Please report the problem or refresh the browser
          tab.
        </h1>
      );
    }

    return this.props.children;
  }
}

const mapDispatchToProps = dispatch => ({
  dispatchUnexpectedError: data => dispatch(unexpectedErrorAction(data)),
});

export default connect(null, mapDispatchToProps)(AppErrorBoundary);
