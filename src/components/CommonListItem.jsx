import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { memo } from 'react';
import LinkWrap from './LinkWrap';

const PersonListItem = memo(
  ({ iconImage, primaryText, secondaryText, href }) => {
    return (
      <div className='person-list-item'>
        <LinkWrap href={href}>
          <ListItemButton>
            <ListItemAvatar>
              <Avatar
                alt='Cindy Baker'
                src={iconImage || '/images/noAvatar.png'}
              />
            </ListItemAvatar>
            <ListItemText primary={primaryText} secondary={secondaryText} />
          </ListItemButton>
        </LinkWrap>
        <Divider variant='inset' component='li' />
      </div>
    );
  }
);

export default PersonListItem;
