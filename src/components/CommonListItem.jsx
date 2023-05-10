import * as React from 'react';
import { useState, useEffect } from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { memo } from 'react';
import { Badge, ListItem, Typography } from '@mui/material';
import CommonMenu from './CommonMenu';
import { useRouter } from 'next/router';
import useChatFunc from '../hooks/useChatFunc';
import { useUserData } from '../provider/UserDataProvider';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import GroupIcon from '@mui/icons-material/Group';
import { convertList } from '../utils/convertData';
import ConfirmDialog from './ConfirmDialog';
import CommonDialog from './CommonDialog';
import PersonList from './CommonList';
import useFetchData from '../hooks/useFetchData';

const PersonListItem = memo(
  ({
    id,
    listData,
    setListData,
    iconImage,
    primaryText,
    secondaryText,
    href,
    badgeContent = 0,
    isPlanTalkRoom,
    isGroupTalkRoom,
    talkRoomMembers,
    chat,
    actionButton,
  }) => {
    const { readTalksFunc } = useChatFunc();
    const { userData, setUserData } = useUserData();
    const [menuList, setMenuList] = useState([]);
    const [talkRoomMembersArray, setTalkRoomMembersArray] = useState([]);
    const [talkRoomMemberListIsOpen, setTalkRoomMemberListIsOpen] =
      useState(false);
    const [leaveConfirmDialogIsOpen, setLeaveConfirmDialogIsOpen] =
      useState(false);
    const { leaveTalkRoomFunc } = useChatFunc();
    const { fetchUserByIdFunc } = useFetchData();
    const router = useRouter();

    useEffect(() => {
      const menuArray = [
        {
          text: 'トークルームのメンバーを表示',
          icon: <GroupIcon />,
          onClickFunc: (e) => dispTalkRoomMembers(e),
        },
      ];

      if (chat && !isPlanTalkRoom) {
        if (isGroupTalkRoom) {
          menuArray.push({
            text: 'トークルームから抜ける',
            icon: <GroupRemoveIcon />,
            onClickFunc: () => setLeaveConfirmDialogIsOpen(true),
          });
        } else {
          menuArray.push({
            text: '友達から抜ける',
            icon: <PersonRemoveIcon />,
            onClickFunc: () => setLeaveConfirmDialogIsOpen(true),
          });
        }
      }

      setMenuList(menuArray);
    }, [listData]);

    const dispTalkRoomMembers = (e) => {
      e.preventDefault();
      const response = convertList(talkRoomMembers);
      setTalkRoomMembersArray(response);
      setTalkRoomMemberListIsOpen(true);
    };

    const leaveTalkRoom = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const { success } = await leaveTalkRoomFunc({
        talk_room_id: id,
        user_id: userData._id,
      });

      if (success) {
        const copyListData = [...listData];
        const listItemIndex = copyListData.findIndex((x) => x.id === id);
        copyListData.splice(listItemIndex, 1);
        setListData(copyListData);
        const user = await fetchUserByIdFunc(userData._id);
        setUserData(user);
      }
    };

    const transitionTalkRoom = async (e) => {
      e.preventDefault();
      e.stopPropagation();
      await readTalksFunc({ talk_room_id: id, reader_id: userData._id });
      router.push(href);
    };
    return (
      <div className='person-list-item'>
        <ListItem
          secondaryAction={
            !!actionButton
              ? actionButton
              : chat && <CommonMenu menuArray={menuList} />
          }
        >
          <ListItemButton onClick={(e) => transitionTalkRoom(e)}>
            <ListItemAvatar>
              <Avatar
                alt='Cindy Baker'
                src={iconImage || '/images/noAvatar.png'}
              />
            </ListItemAvatar>
            {badgeContent ? (
              <Badge
                color='primary'
                badgeContent={badgeContent > 0 && badgeContent}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <ListItemText
                  primary={
                    <Typography noWrap>{primaryText || 'unknown'}</Typography>
                  }
                  secondary={
                    <Typography variant='body2' noWrap>
                      {secondaryText.split('\n').map((line, index) => (
                        <React.Fragment key={index}>
                          {line}
                          <br />
                        </React.Fragment>
                      ))}
                    </Typography>
                  }
                />
              </Badge>
            ) : (
              <ListItemText
                primary={
                  <Typography noWrap>{primaryText || 'unknown'}</Typography>
                }
                secondary={
                  <Typography variant='body2' noWrap>
                    {secondaryText.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))}
                  </Typography>
                }
              />
            )}
          </ListItemButton>
        </ListItem>
        <CommonDialog
          dialogTitle='トークルームのメンバーを表示'
          isOpen={talkRoomMemberListIsOpen}
          setIsOpen={setTalkRoomMemberListIsOpen}
        >
          <PersonList listData={talkRoomMembersArray} pagePath='/Profile' />
        </CommonDialog>
        <ConfirmDialog
          isOpen={leaveConfirmDialogIsOpen}
          setIsOpen={setLeaveConfirmDialogIsOpen}
          primaryText='本当にこのトークルームから抜けますか？'
          secondaryText='トークルームから抜けると、会話が出来なくなり、友達から抜けると、友達が作成したプランがホーム画面に表示されなくなります。'
          onClick={(e) => leaveTalkRoom(e)}
        />
        <Divider variant='inset' component='li' />
      </div>
    );
  }
);

export default PersonListItem;
