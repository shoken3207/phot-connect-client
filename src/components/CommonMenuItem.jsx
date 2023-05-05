import React from 'react';
import { ListItemIcon, ListItemText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const CommonMenuItem = ({ icon, text, onClickFunc, setAnchorEl }) => {
  const onClick = (e) => {
    onClickFunc(e);
    setAnchorEl(null);
  };
  return (
    <MenuItem onClick={(e) => onClick(e)}>
      <ListItemIcon>{icon}</ListItemIcon>
      <ListItemText>{text}</ListItemText>
    </MenuItem>
  );
};

export default CommonMenuItem;
