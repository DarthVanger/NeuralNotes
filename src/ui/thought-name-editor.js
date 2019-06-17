import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { HeaderComponent } from 'ui/thought-name-editor/header';

const wrapperStyles = {
  position: 'fixed',
  top: '0',
  height: '4em',
  width: '100%',
  paddingTop: '1.5em',
  zIndex: '2',
  backgroundColor: 'black',
  color: 'white'
};

const textAreaStyles = {
  width: '100%',
  height: '100%',
  padding: '0.5em',
  backgroundColor: 'black',
};

export class ThoughtNameEditor extends Component {
  state = { name: '', propName: '' };

  ref = React.createRef();

  debouncedOnChange = _.debounce(name => this.props.onChange(name), 1500);

  render() {
    const { onDeleteClick, onUploadFileClick } = this.props;

    return (
      <div id="thought-name-editor" style={wrapperStyles}>
        <HeaderComponent onDeleteClick={onDeleteClick} onUploadFileClick={onUploadFileClick}/>
        <textarea ref={this.ref} onChange={this.onChange} style={textAreaStyles} value={this.state.name}/>
      </div>
    );
  }

  static getDerivedStateFromProps({ thought: { name } }, state) {
    if (name !== state.propName) {
      console.log(name);
      return { name, propName: name };
    }
    return null;
  }

  onChange = () => {
    const name = this.ref.current.value;
    this.debouncedOnChange(name);
    this.setState({ name })
  }
}

ThoughtNameEditor.propTypes = {
  thought: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onUploadFileClick: PropTypes.func.isRequired
};
