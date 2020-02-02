import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ControlsHelpComponent } from 'components/ControlsHelp/ControlsHelpComponent';
import { NotesContentEditorContainer } from 'components/NotesContentEditor/NotesContentEditorContainer';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { SearchPanelContainer } from 'components/SearchPanel/SearchPanelContainer';
import { UploadStatusButton } from 'components/Uploads/UploadStatusButton';
import { UploadButton } from 'components/Uploads/UploadButton';

export class NotesPageComponent extends Component {
  render() {
    const { isHelpViewed, closeHelp } = this.props;

    return (
      <>
        <NotesMindMapContainer />
        <NotesContentEditorContainer />
        {!isHelpViewed && <ControlsHelpComponent onClose={closeHelp} />}
        <SearchPanelContainer />
        <UploadStatusButton />
        <UploadButton />
      </>
    );
  }
}

NotesPageComponent.propTypes = {
  isHelpViewed: PropTypes.bool.isRequired,
  closeHelp: PropTypes.func.isRequired,
};
