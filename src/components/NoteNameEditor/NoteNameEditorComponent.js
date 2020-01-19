import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'underscore';

import { HeaderComponent } from 'components/NoteNameEditor/HeaderComponent/HeaderComponent';
import {
  StyledNoteEditorTextArea,
  StyledNoteNameEditor,
} from 'components/NoteNameEditor/NoteNameEditorStyles';

export class NoteNameEditorComponent extends Component {
  state = { name: '', propName: '' };

  ref = React.createRef();

  debouncedOnChange = _.debounce(name => this.props.onChange(name), 1500);

  render() {
    const {
      onChangeParentClick,
      onDeleteClick,
      onUploadFileClick,
      isChangeParentModeActive,
    } = this.props;

    return (
      <StyledNoteNameEditor>
        <HeaderComponent
          onChangeParentClick={onChangeParentClick}
          onDeleteClick={onDeleteClick}
          onUploadFileClick={onUploadFileClick}
          isChangeParentModeActive={isChangeParentModeActive}
        />
        <StyledNoteEditorTextArea
          ref={this.ref}
          onChange={this.onChange}
          value={this.state.name}
        />
      </StyledNoteNameEditor>
    );
  }

  static getDerivedStateFromProps({ note }, state) {
    const { name } = note;
    if (name !== state.propName) {
      return { name, propName: name };
    }
    return null;
  }

  onChange = () => {
    const name = this.ref.current.value;
    this.debouncedOnChange(name);
    this.setState({ name });
  };
}

NoteNameEditorComponent.propTypes = {
  note: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onChangeParentClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  onUploadFileClick: PropTypes.func.isRequired,
  isChangeParentModeActive: PropTypes.bool.isRequired,
};
