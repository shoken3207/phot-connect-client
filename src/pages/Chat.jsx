import React, { useEffect, memo, useState } from 'react';
import CommonList from '../../src/components/CommonList';
import { useUserData } from '../provider/UserDataProvider';
import axios from 'axios';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/main';
import { useRouter } from 'next/router';
const Chat = memo(() => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  const { userData } = useUserData();
  const [talkRoomListData, setTalkRoomListData] = useState([]);
  const fetchTalkRoomListData = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/talkRoom/${userData._id}/all`
    );
    const talkRoomArray = response.data.map((x) => {
      return {
        primaryText: x.talkRoomName,
        secondaryText: x.lastMessage,
        iconImage: x.talkRoomIconImage,
        id: x._id,
      };
    });
    setTalkRoomListData(talkRoomArray);
  };
  useEffect(() => {
    fetchTalkRoomListData();
  }, [userData]);
  return (
    <div>
      <CommonList listData={talkRoomListData} pagePath='/TalkRoom' />
    </div>
  );
});

export default Chat;
