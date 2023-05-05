import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useUserData } from '../provider/UserDataProvider';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import ChatIcon from '@mui/icons-material/Chat';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import PersonIcon from '@mui/icons-material/Person';
import LinkWrap from './LinkWrap';

export default function MobileMenu({ isOpen, setIsOpen }) {
  const mobileMenuArray = [
    { text: 'ホーム', icon: <HomeIcon />, path: '/Home' },
    {
      text: 'プロフィール編集',
      icon: <PersonIcon />,
      path: '/EditProfile',
    },
    { text: 'プランを作成', icon: <EditIcon />, path: '/CreatePlan' },
    { text: 'チャット', icon: <ChatIcon />, path: '/Chat' },
    { text: '検索', icon: <SearchIcon />, path: '/Search' },
    { text: 'サインアップ', icon: <AppRegistrationIcon />, path: '/SignUp' },
    { text: 'サインイン', icon: <LoginIcon />, path: '/SignIn' },
    { text: 'テスト', icon: <DriveEtaIcon />, path: '/test' },
  ];
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }
    setIsOpen(open);
  };

  const list = () => (
    <Box
      sx={{ width: 250 }}
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        {mobileMenuArray.map((mobileMenuItem) => (
          <LinkWrap href={mobileMenuItem.path} key={mobileMenuItem.text}>
            <ListItem
              // key={mobileMenuItem.text}
              disablePadding
              onClick={() => mobileMenuItem.text === 'ログアウト' && logout()}
            >
              <ListItemButton>
                <ListItemIcon>{mobileMenuItem.icon}</ListItemIcon>
                <ListItemText primary={mobileMenuItem.text} />
              </ListItemButton>
            </ListItem>
          </LinkWrap>
        ))}
      </List>
    </Box>
  );

  return (
    <Drawer anchor='left' open={isOpen} onClose={toggleDrawer(false)}>
      {list()}
    </Drawer>
  );
}
