import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import { ControlsHelpComponent } from 'components/ControlsHelp/ControlsHelpComponent';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer'; // Notes tree view
import { TopBarComponent } from 'components/TopBar/TopBarComponent';
import { UploadStatusButton } from 'components/Uploads/UploadStatusButton';
// import { UploadButton } from 'components/Uploads/UploadButton';
import BottomBarComponent from 'components/BottomBar/BottomBarComponent';

export class NotesPageComponent extends Component {
  render() {
    // const { isHelpViewed, closeHelp } = this.props;

    return (
      <>
        <TopBarComponent />
        <NotesMindMapContainer />
        {/* {!isHelpViewed && <ControlsHelpComponent onClose={closeHelp} />} */}
        <UploadStatusButton />
        {/* <UploadButton /> */}
        <BottomBarComponent />
      </>
    );
  }
}

NotesPageComponent.propTypes = {
  isHelpViewed: PropTypes.bool.isRequired,
  closeHelp: PropTypes.func.isRequired,
};
