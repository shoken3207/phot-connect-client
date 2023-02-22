import React from 'react';
import { List, ListItemText, ListSubheader, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ListItem from '@mui/material/ListItem';

const ChipList = ({ chipTexts, setChipTexts }) => {
  const removeChipText = (e, i) => {
    e.preventDefault();
    console.log(i);
    const copyChipTexts = [...chipTexts];
    copyChipTexts.splice(i, 1);
    setChipTexts(copyChipTexts);
  };
  return (
    <List
      sx={{ width: '100%' }}
      subheader={
        <ListSubheader component='div'>チップテキストリスト</ListSubheader>
      }
    >
      {chipTexts.map((chipText, i) => (
        <ListItem
          key={chipText + i}
          secondaryAction={
            <IconButton edge='end' onClick={(e) => removeChipText(e, i)}>
              <DeleteIcon />
            </IconButton>
          }
        >
          <ListItemText primary={chipText} />
        </ListItem>
      ))}
    </List>
  );
};

export default ChipList;
