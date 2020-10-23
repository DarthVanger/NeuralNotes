import React, { Component } from 'react';
// import { StyledLogoutButton } from 'components/LogoutButton/LogoutButtonStyles';
import Button from '@material-ui/core/Button';

export class LogoutButtonComponent extends Component {
  render() {
    return (
      <Button
        style={{ color: '#E4E3E4', margin: '1rem' }}
        onClick={this.props.logout}>
        Logout
      </Button>
    );
  }
}
