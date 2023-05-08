import React, { memo } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import CommonListItem from '../../src/components/CommonListItem';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import { useUserData } from '../provider/UserDataProvider';
import styled from 'styled-components';
import { Button, Checkbox } from '@mui/material';
const PersonList = memo(
  ({
    listData,
    setListData,
    pagePath,
    onChange,
    onClick,
    friendAdd,
    withActionButton,
    except,
    accept,
    removeReaction,
    selectUsers,
    invitees,
    participants,
    chat,
  }) => {
    const { userData } = useUserData();
    const isFriend = (userId) => {
      const friend = userData.friends.find((x) => x._id === userId);
      return !!friend;
    };
    const isInvitee = (userId) => {
      const invitee = invitees.find((x) => x._id === userId);
      return !!invitee;
    };
    const isParticipant = (userId) => {
      const participant = participants.find((x) => x._id === userId);
      return !!participant;
    };

    return (
      <SCommonList>
        <Box sx={{ width: '100%', maxWidth: 550, bgcolor: 'background.paper' }}>
          <List>
            {listData.map((itemData) =>
              withActionButton ? (
                <CommonListItem
                  id={itemData.id}
                  listData={listData}
                  setListData={setListData}
                  iconImage={itemData.iconImage}
                  primaryText={itemData.primaryText}
                  secondaryText={itemData.secondaryText}
                  badgeContent={itemData.badgeContent}
                  isPlanTalkRoom={itemData.isPlanTalkRoom}
                  isGroupTalkRoom={itemData.isGroupTalkRoom}
                  talkRoomMembers={itemData.talkRoomMembers}
                  actionButton={
                    friendAdd ? (
                      <Button
                        size='large'
                        variant='contained'
                        disabled={
                          friendAdd &&
                          (isFriend(itemData.id) ||
                            itemData.id === userData._id)
                            ? true
                            : false
                        }
                        onClick={(e) => onClick(e, itemData.id)}
                      >
                        <GroupAddIcon />
                      </Button>
                    ) : except || accept ? (
                      <Button
                        size='large'
                        variant='contained'
                        color={except ? 'error' : 'primary'}
                        onClick={(e) => onClick(e, itemData.id)}
                      >
                        <GroupRemoveIcon />
                      </Button>
                    ) : removeReaction ? (
                      itemData.id === userData._id && (
                        <Button
                          size='large'
                          variant='contained'
                          color='error'
                          onClick={(e) => onClick(e, itemData.id)}
                        >
                          <DeleteIcon />
                        </Button>
                      )
                    ) : (
                      selectUsers && (
                        <Checkbox
                          disabled={
                            (participants && isParticipant(itemData.id)) ||
                            (invitees && isInvitee(itemData.id))
                          }
                          checked={selectUsers.includes(itemData.id)}
                          onChange={(e) => onChange(itemData.id)}
                        />
                      )
                    )
                  }
                  chat={chat}
                  href={`${pagePath}/${itemData.id}`}
                  key={itemData.id}
                />
              ) : (
                <CommonListItem
                  id={itemData.id}
                  listData={listData}
                  setListData={setListData}
                  iconImage={itemData.iconImage}
                  primaryText={itemData.primaryText}
                  secondaryText={itemData.secondaryText}
                  badgeContent={itemData.badgeContent}
                  isPlanTalkRoom={itemData.isPlanTalkRoom}
                  isGroupTalkRoom={itemData.isGroupTalkRoom}
                  talkRoomMembers={itemData.talkRoomMembers}
                  chat={chat}
                  href={`${pagePath}/${itemData.id}`}
                  key={itemData.id}
                />
              )
            )}
          </List>
        </Box>
      </SCommonList>
    );
  }
);

const SCommonList = styled.div`
  /* max-height: 88vh;
  height: auto;
  overflow-y: scroll; */
`;

export default PersonList;
