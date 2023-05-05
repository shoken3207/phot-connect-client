import React, { memo } from 'react';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import CommonListItem from '../../src/components/CommonListItem';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import TwoColumnBox from '../../src/components/TwoColumnBox';
import { useUserData } from '../provider/UserDataProvider';
import styled from 'styled-components';
import { Button } from '@mui/material';
const PersonList = memo(
  ({
    listData,
    setListData,
    pagePath,
    onClick,
    participants,
    friendAdd,
    withActionButton,
    participantsAction,
    reactorAction,
    chat,
  }) => {
    const { userData } = useUserData();
    const isFriend = (userId) => {
      const friend = userData.friends.find((x) => x._id === userId);
      return !!friend;
    };
    const isParticipated = (userId) => {
      const participant = participants.find((x) => x._id === userId);
      return !!participant;
    };
    return (
      <SCommonList>
        <Box sx={{ width: '100%', maxWidth: 550, bgcolor: 'background.paper' }}>
          <List>
            {listData.map((itemData) =>
              withActionButton ? (
                <TwoColumnBox
                  key={itemData.id}
                  isDisabled={
                    friendAdd &&
                    (isFriend(itemData.id) || itemData.id === userData._id)
                      ? true
                      : false
                  }
                >
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
                  {friendAdd ? (
                    <Button onClick={(e) => onClick(e, itemData.id)}>
                      <PersonAddIcon />
                    </Button>
                  ) : participantsAction ? (
                    isParticipated(itemData.id) ? (
                      <Button
                        color='error'
                        variant='contained'
                        onClick={(e) => onClick(e, itemData.id)}
                      >
                        <PersonAddIcon />
                      </Button>
                    ) : (
                      <Button
                        color='error'
                        variant='contained'
                        onClick={(e) => onClick(e, itemData.id)}
                      >
                        <PersonAddIcon />
                      </Button>
                    )
                  ) : (
                    reactorAction && (
                      <Button
                        color='secondary'
                        variant='contained'
                        onClick={(e) => onClick(e, itemData.id)}
                      >
                        <PersonAddIcon />
                      </Button>
                    )
                  )}
                </TwoColumnBox>
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
  max-height: 85vh;
  height: auto;
  overflow-y: scroll;
`;

export default PersonList;
