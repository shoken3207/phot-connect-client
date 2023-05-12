import React, { useEffect, memo, useState } from 'react';
import CommonList from '../../src/components/CommonList';
import { useUserData } from '../provider/UserDataProvider';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';
import { useRouter } from 'next/router';
import useFetchData from '../hooks/useFetchData';
import Head from 'next/head';
const Chat = memo(() => {
  const { fetchTalkRoomsFunc } = useFetchData();
  const router = useRouter();
  const [user] = useAuthState(auth);
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  const { userData } = useUserData();
  const [talkRoomListData, setTalkRoomListData] = useState([]);
  const fetchTalkRoomListData = async () => {
    const response = await fetchTalkRoomsFunc(userData._id);
    const talkRooms = response.map((x) => {
      return {
        primaryText: x.talk_room_name,
        secondaryText: x.last_message,
        iconImage: x.talk_room_icon_image,
        id: x._id,
        badgeContent: x.unread_talk_count,
        isPlanTalkRoom: x.is_plan_talk_room,
        isGroupTalkRoom: x.is_group_talk_room,
        talkRoomMembers: x.talk_room_members,
      };
    });
    setTalkRoomListData(talkRooms);
  };
  useEffect(() => {
    if (userData._id) {
      fetchTalkRoomListData();
    }
  }, [userData]);
  return (
    <div>
      <Head>
        <title>chat</title>
      </Head>
      <CommonList
        listData={talkRoomListData}
        setListData={setTalkRoomListData}
        pagePath='/TalkRoom'
        chat
      />
    </div>
  );
});

export default Chat;
Chat.displayName = 'Chat';
