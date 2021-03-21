import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { HeaderComponent } from 'components/NoteNameEditor/HeaderComponent/HeaderComponent';
import {
  StyledNoteEditorTextArea,
  StyledNoteNameEditor,
} from 'components/NoteNameEditor/NoteNameEditorStyles';

import { debounce } from '../../helpers/debounce';

export class NoteNameEditorComponent extends Component {
  state = { name: '', propName: '' };

  ref = React.createRef();

  debouncedOnChange = debounce(name => this.props.onChange(name), 1500);

  render() {
    const {
      onChangeParentClick,
      onDeleteClick,
      isChangeParentModeActive,
    } = this.props;

    return (
      <StyledNoteNameEditor>
        <HeaderComponent
          onChangeParentClick={onChangeParentClick}
          onDeleteClick={onDeleteClick}
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
  isChangeParentModeActive: PropTypes.bool.isRequired,
};
