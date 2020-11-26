import React, { Component } from 'react';

import PropTypes from 'prop-types';

import { BottomBar } from 'components/BottomBar/BottomBar';
import { ControlsHelpComponent } from 'components/ControlsHelp/ControlsHelpComponent';
import { NotesMindMapContainer } from 'components/NotesMindMap/NotesMindMapContainer';
import { TopBar } from 'components/TopBar/TopBar';

export class NotesPageComponent extends Component {
  render() {
    const { isHelpViewed, closeHelp } = this.props;
    return (
      <>
        <TopBar />
        <NotesMindMapContainer />
        <BottomBar />
        {!isHelpViewed && <ControlsHelpComponent onClose={closeHelp} />}
      </>
    );
  }
}

NotesPageComponent.propTypes = {
  isHelpViewed: PropTypes.bool.isRequired,
  closeHelp: PropTypes.func.isRequired,
};
