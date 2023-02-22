import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { auth } from '../firebase/main';
import { useUserData } from '../provider/UserDataProvider';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import EditIcon from '@mui/icons-material/Edit';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import LinkWrap from './LinkWrap';

export default function MobileMenu({ isOpen, setIsOpen }) {
  const { setUserData } = useUserData();
  const mobileMenuArray = [
    { text: 'ホーム', icon: <HomeIcon />, path: '/Home' },
    { text: 'ログアウト', icon: <LogoutIcon />, path: '' },
    {
      text: 'プロフィール編集',
      icon: <EditIcon />,
      path: '/EditProfile',
    },
    { text: '友達追加', icon: <PersonAddIcon />, path: '/addFriend' },
    { text: 'プランを作成', icon: <DriveEtaIcon />, path: '/CreatePlan' },
    { text: 'トークルーム', icon: <DriveEtaIcon />, path: '/TalkRoom' },
    { text: 'チャット', icon: <DriveEtaIcon />, path: '/Chat' },
    { text: 'プロフィール', icon: <DriveEtaIcon />, path: '/Profile/1' },
    { text: 'テスト', icon: <DriveEtaIcon />, path: '/test' },
    { text: '検索', icon: <DriveEtaIcon />, path: '/Search' },
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

  const logout = () => {
    auth.signOut();
    setUserData('');
    sessionStorage.removeItem('user');
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
