import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';

export class LogoutMenuItemComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MenuItem onClick={this.props.logout}>
        <Typography variant="subtitle1">Logout</Typography>
      </MenuItem>
    );
  }
}
