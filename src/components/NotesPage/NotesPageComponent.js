import React, { Component } from 'react';

import PropTypes from 'prop-types';

// import { ControlsHelpComponent } from 'components/ControlsHelp/ControlsHelpComponent';
import { BottomBar } from 'components/BottomBar/BottomBar';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer'; // Notes tree view
import { TopBar } from 'components/TopBar/TopBar';

// import { UploadButton } from 'components/Uploads/UploadButton';

export class NotesPageComponent extends Component {
  render() {
    // const { isHelpViewed, closeHelp } = this.props;

    return (
      <>
        <TopBar />
        <NotesMindMapContainer />
        {/* {!isHelpViewed && <ControlsHelpComponent onClose={closeHelp} />} */}
        {/* <UploadButton /> */}
        <BottomBar />
      </>
    );
  }
}

NotesPageComponent.propTypes = {
  isHelpViewed: PropTypes.bool.isRequired,
  closeHelp: PropTypes.func.isRequired,
};
