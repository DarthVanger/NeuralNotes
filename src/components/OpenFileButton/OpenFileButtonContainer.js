import { connect } from 'react-redux';

import { OpenFileButtonComponent } from 'components/OpenFileButton/OpenFileButtonComponent';

const mapStateToProps = ({ notesMindMap: { selectedNote } }) => {
  return {
    selectedNote,
  };
};

export const OpenFileButtonContainer = connect(mapStateToProps)(
  OpenFileButtonComponent,
);
