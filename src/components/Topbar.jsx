import * as React from 'react';
import { memo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Avatar } from '@mui/material';
import { useUserData } from '../provider/UserDataProvider';
import LinkWrap from './LinkWrap';
const TopBar = memo(({ setIsOpen }) => {
  const { userData } = useUserData();
  return (
    <AppBar position='fixed' sx={{ bottom: 'auto', top: 0 }}>
      <Toolbar>
        <>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='menu'
            sx={{ mr: 2 }}
            onClick={() => setIsOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {userData.username}
          </Typography>
          <LinkWrap href={`/Profile/${userData._id}`}>
            <Avatar src={userData.iconImage} />
          </LinkWrap>
        </>
      </Toolbar>
    </AppBar>
  );
});

export default TopBar;
