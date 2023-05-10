import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import LoadingProgress from './LoadingProgress';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction='up' ref={ref} {...props} />;
});

export default function CommonFullScreenDialog({
  isOpenFullScreenDialog,
  setIsOpenFullScreenDialog,
  children,
  title,
  icon,
}) {
  const appBarRef = React.useRef(null);
  const handleClose = () => {
    setIsOpenFullScreenDialog(false);
    sessionStorage.removeItem('isOpenFullScreenDialog');
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={isOpenFullScreenDialog}
        onClose={handleClose}
        TransitionComponent={Transition}
        style={{ paddingTop: appBarRef.current?.clientHeight }}
      >
        <AppBar ref={appBarRef} sx={{ position: 'fixed' }}>
          <Toolbar>
            {icon}
            <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
              {title}
            </Typography>
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleClose}
              aria-label='close'
            >
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        {children}
        <LoadingProgress />
      </Dialog>
    </div>
  );
}
