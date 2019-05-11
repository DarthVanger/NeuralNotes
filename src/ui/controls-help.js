import React, { Component } from 'react';
import PropTypes from 'prop-types';

export class ControlsHelp extends Component {

  render() {
    const { onClick } = this.props;

    const styles = {
      position: 'absolute',
      bottom: 0,
      left: 0,
      height: '5em',
      padding: '.5em',
      backgroundColor: 'yellow',
    };

    return (
      <div id="tutorial" style={styles} onClick={onClick}>
        <span style={{ float: 'right', cursor: 'pointer' }}>X</span>
        {'Controls:'}<br/>
        {'Double-click: add a child note'}<br/>
        {'Hold: edit note\'s name'}
      </div>
    );
  }
}

ControlsHelp.propTypes = {
  onClick: PropTypes.func
};
