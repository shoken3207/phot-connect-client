import React, { useState } from 'react';
import { Button, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import CommonMenuItem from './CommonMenuItem';

const CommonMenu = ({ iconSize = 'medium', menuArray, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const onClickFunc = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  return (
    <div>
      {children ? (
        <Button onClick={(e) => onClickFunc(e)}>{children}</Button>
      ) : (
        <IconButton
          size={iconSize}
          color='inherit'
          onClick={(e) => onClickFunc(e)}
        >
          <MoreVertIcon fontSize={iconSize} />
        </IconButton>
      )}

      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {menuArray.map((menuItem) => (
          <CommonMenuItem
            icon={menuItem.icon}
            text={menuItem.text}
            onClickFunc={menuItem.onClickFunc}
            setAnchorEl={setAnchorEl}
            key={menuItem.text}
          />
        ))}
      </Menu>
    </div>
  );
};

export default CommonMenu;
