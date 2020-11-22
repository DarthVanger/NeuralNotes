import React, { Component } from 'react';

import PropTypes from 'prop-types';

import {
  StyledCrossButton,
  StyledTutorial,
} from 'components/ControlsHelp/ControlsHelpStyles';

export class ControlsHelpComponent extends Component {
  render() {
    return (
      <StyledTutorial>
        <StyledCrossButton onClick={this.props.onClose}>X</StyledCrossButton>
        {'Controls:'}
        <br />
        {'Double-click: add a child note'}
        <br />
        {"Hold: edit note's name"}
      </StyledTutorial>
    );
  }
}

ControlsHelpComponent.propTypes = {
  onClose: PropTypes.func,
};
