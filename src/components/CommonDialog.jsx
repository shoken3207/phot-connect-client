import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import React from 'react';

const CommonDialog = ({
  dialogTitle,
  isOpen,
  setIsOpen,
  children,
  setList,
}) => {
  const dialogCloseFunc = () => {
    setIsOpen(false);
    if (setList) {
      setList([]);
    }
  };
  return (
    <Dialog
      PaperProps={{
        style: {
          minWidth: 340,
        },
      }}
      maxWidth='sm'
      onClose={() => dialogCloseFunc()}
      open={isOpen}
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      {children}
    </Dialog>
  );
};

export default CommonDialog;
