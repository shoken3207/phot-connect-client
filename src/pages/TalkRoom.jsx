import React, { memo, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserData } from '../provider/UserDataProvider';
import Message from '../components/Message';
import MessageList from '../components/MessageList';
import axios from 'axios';
import SendTalk from '../components/SendTalk';

const TalkRoom = memo(() => {
  const router = useRouter();
  const talkRoomId = router.query.talkRoomId;
  const { userData } = useUserData();
  const [talkRoomMembers, setTalkRoomMembers] = useState([]);
  const [allTalkData, setAllTalkData] = useState([]);

  //   トークルーム内のメンバーを取得
  const fetchTalkRoomMembers = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/talkRoom/${talkRoomId}/members`
    );
    setTalkRoomMembers(response.data);
  };
  // トークルーム内の全てのトークを取得
  const fetchAllTalkData = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/talk/${talkRoomId}/all`
    );
    console.log('response: ', response.data);
    setAllTalkData(response.data);
  };
  useEffect(() => {
    fetchTalkRoomMembers();
    fetchAllTalkData();
  }, []);

  return (
    <div>
      <MessageList allTalkData={allTalkData} />
      {/* <Message
        senderIconImage='https://source.unsplash.com/random'
        image='https://source.unsplash.com/random'
        message='おはよう'
        createdAt='2023-02-23'
        isSender={false}
      />
      <Message
        senderIconImage='https://source.unsplash.com/random'
        image='https://source.unsplash.com/random'
        message='こんにちは'
        createdAt='2023-02-23'
        isSender={true}
      />
      <Message
        senderIconImage='https://source.unsplash.com/random'
        image='https://source.unsplash.com/random'
        message='こんばんは'
        createdAt='2023-02-23'
        isSender={false}
      /> */}
      <SendTalk
        userId={userData._id}
        talkRoomId={talkRoomId}
        iconImage={userData.iconImage}
        fetchAllTalkData={fetchAllTalkData}
      />
    </div>
  );
});

export default TalkRoom;
