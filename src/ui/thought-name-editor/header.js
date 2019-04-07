import React from 'react';
import PropTypes from 'prop-types';

const wrapperStyles = {
  position: 'absolute',
  top: '0',
  zIndex: '3',
  height: '1.5em',
  width: '100%',
  backgroundColor: '#aac',
  padding: '0.25em',
  color: 'black',
  textTransform: 'uppercase',
};

const buttonsContainerStyles = {
  position: 'absolute',
  top: '0',
  right: '0',
  textAlign: 'right',
};

export const HeaderComponent = ({onDeleteClick, onUploadFileClick}) => (
  <div style={wrapperStyles}>
    Edit note name
    <div className="btn-group" style={buttonsContainerStyles}>
      <button className="btn btn-danger" onClick={onDeleteClick}>Delete</button>
      <button className="btn btn-default" onClick={onUploadFileClick}>Upload files</button>
    </div>
  </div>
);

HeaderComponent.propTypes = {
  onDeleteClick: PropTypes.func.isRequired,
  onUploadFileClick: PropTypes.func.isRequired
};
