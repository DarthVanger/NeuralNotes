import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { deleteNoteAction } from 'components/BottomBar/BottomBarActions';
import { makeStyles } from '@material-ui/core';
import { colors } from '../../colors';

const useStyles = makeStyles(() => ({
  dialog: {
    color: 'white',
    backgroundColor: colors.mainGray,
  },
  title: {
    color: colors.white87,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ModalDeleteComponent({ handleClose, open }) {
  const selectedNote = useSelector(state => state.notesMindMap.selectedNote);
  const dispatch = useDispatch();
  const handleDeleteButtonClick = () => {
    dispatch(deleteNoteAction(selectedNote));
  };
  const classes = useStyles();
  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle className={classes.dialog} id="alert-dialog-slide-title">
          {'Delete None'}
        </DialogTitle>
        <DialogContent className={classes.dialog}>
          <DialogContentText
            className={classes.title}
            id="alert-dialog-slide-description">
            Are you sure you want to delete this note?
          </DialogContentText>
        </DialogContent>
        <DialogActions className={classes.dialog}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDeleteButtonClick(), handleClose();
            }}
            color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
