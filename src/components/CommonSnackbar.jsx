import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import { Slide } from '@mui/material';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const SlideTransition = (props) => {
  return <Slide {...props} direction='up' />;
};

const CommonSnackbar = () => {
  const { snackbarInfo } = useSnackbarInfo();
  const { snackbarIsShow, setSnackbarIsShow } = useSnackbarShowFlg();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarIsShow(false);
  };
  return (
    <Snackbar
      open={snackbarIsShow}
      autoHideDuration={3000}
      onClose={() => handleClose()}
      TransitionComponent={SlideTransition}
    >
      <Alert
        onClose={() => handleClose()}
        sx={{ width: '100%' }}
        severity={snackbarInfo.severity}
      >
        {snackbarInfo.text}
      </Alert>
    </Snackbar>
  );
};

export default CommonSnackbar;
