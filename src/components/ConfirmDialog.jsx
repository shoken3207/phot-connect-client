import React from 'react';
import CommonDialog from './CommonDialog';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

const ConfirmDialog = ({
  isOpen,
  setIsOpen,
  primaryText,
  secondaryText,
  onClick,
}) => {
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleExecute = (e) => {
    onClick(e);
    handleClose();
  };
  return (
    <CommonDialog
      dialogTitle={primaryText}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <DialogContent>
        <DialogContentText>{secondaryText}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button color='error' onClick={() => handleClose()}>
          いいえ
        </Button>
        <Button color='primary' onClick={(e) => handleExecute(e)} autoFocus>
          はい
        </Button>
      </DialogActions>
    </CommonDialog>
  );
};

export default ConfirmDialog;
