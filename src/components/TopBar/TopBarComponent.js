import React, { Component } from 'react';
import UploadIcon from 'components/TopBar/images/icon-uploads.svg';
import SearchIcon from 'components/TopBar/images/icon-search.svg';
import MenuIcon from 'components/TopBar/images/icon-menu.svg';
import {
  StyledHeader,
  StyledLogo,
  StyledControls,
  StyledIcon,
  StyledBottomLine,
} from 'components/TopBar/TopBarStyles';

export class TopBarComponent extends Component {
  render() {
    return (
      <StyledHeader>
        <StyledLogo>NeuralNotes</StyledLogo>
        <StyledControls>
          <StyledIcon src={UploadIcon} />
          <StyledIcon src={SearchIcon} />
          <StyledIcon src={MenuIcon} />
        </StyledControls>
        <StyledBottomLine />
      </StyledHeader>
    );
  }
}
