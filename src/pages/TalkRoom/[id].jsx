import React, { memo, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import { useUserData } from '../../provider/UserDataProvider';
import MessageList from '../../components/MessageList';
import axios from 'axios';
import SendTalk from '../../components/SendTalk';
import useFetchData from '../../hooks/useFetchData';
import styled from 'styled-components';
import io from 'socket.io-client';

const TalkRoom = memo(() => {
  const router = useRouter();
  const talkRoomId = router.query.id;
  const { userData } = useUserData();
  const [talkRoomMembers, setTalkRoomMembers] = useState([]);
  const [allTalkData, setAllTalkData] = useState([]);
  const { fetchAllTalkData } = useFetchData();
  const socket = io('http://localhost:5000');

  //   トークルーム内のメンバーを取得
  const fetchTalkRoomMembers = async () => {
    const response = await axios.get(
      `http://localhost:5000/api/talkRoom/${talkRoomId}/members`
    );
    setTalkRoomMembers(response.data);
  };
  // トークルーム内の全てのトークを取得
  const fetchAllTalk = useCallback(async (talkRoomId) => {
    const response = await fetchAllTalkData(talkRoomId);
    setAllTalkData(response);
  }, []);
  useEffect(() => {
    fetchTalkRoomMembers();
    fetchAllTalk(talkRoomId);

    socket.on('received_message', (data) => {
      fetchAllTalk(data.talkRoomId);
    });

    return () => {
      socket.close();
    };
  }, []);

  return (
    <SChat>
      <MessageList allTalkData={allTalkData} />
      <SendTalk
        userId={userData._id}
        talkRoomId={talkRoomId}
        iconImage={userData.iconImage}
        fetchAllTalkData={fetchAllTalkData}
      />
    </SChat>
  );
});

export default TalkRoom;

const SChat = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;
