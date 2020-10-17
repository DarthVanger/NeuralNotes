import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ControlsHelpComponent } from 'components/ControlsHelp/ControlsHelpComponent';
// import { NotesContentEditorContainer } from 'components/NotesContentEditor/NotesContentEditorContainer';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer'; // Notes tree view
import { LogoutButtonContainer } from 'components/LogoutButton/LogoutButtonContainer';
import { SearchPanelContainer } from 'components/SearchPanel/SearchPanelContainer';
import { TopBarComponent } from 'components/TopBar/TopBarComponent';
import { UploadStatusButton } from 'components/Uploads/UploadStatusButton';
import { UploadButton } from 'components/Uploads/UploadButton';
// import { OpenFileButtonComponent } from 'components/OpenFileButton/OpenFileButtonComponent';

export class NotesPageComponent extends Component {
  render() {
    const { isHelpViewed, closeHelp } = this.props;

    return (
      <>
        <TopBarComponent />
        {/* <OpenFileButtonComponent /> */}
        <NotesMindMapContainer />
        {/* <NotesContentEditorContainer /> */}
        {!isHelpViewed && <ControlsHelpComponent onClose={closeHelp} />}
        <SearchPanelContainer />
        <LogoutButtonContainer />
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
