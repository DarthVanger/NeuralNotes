import React, { Component } from 'react';
import { StyledLogoutButton } from 'components/LogoutButton/LogoutButtonStyles';

export class LogoutButtonComponent extends Component {
  render() {
    return (
      <StyledLogoutButton onClick={this.props.logout}>
        Logout
      </StyledLogoutButton>
    );
  }
}
