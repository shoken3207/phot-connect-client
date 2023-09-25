import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import EditIcon from '@mui/icons-material/Edit';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import LinkWrap from './LinkWrap';

export default function MobileMenu({ isOpen, setIsOpen }) {
  const mobileMenuArray = [
    { text: 'ホーム', icon: <HomeIcon />, path: '/Home' },
    { text: 'プランを作成', icon: <EditIcon />, path: '/CreatePlan' },
    { text: 'チャット', icon: <ChatIcon />, path: '/Chat' },
    { text: '検索', icon: <SearchIcon />, path: '/Search' },
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
