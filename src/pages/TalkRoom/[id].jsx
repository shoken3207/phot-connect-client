import React, { memo, useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/router';
import { useUserData } from '../../provider/UserDataProvider';
import MessageList from '../../components/MessageList';
import SendTalk from '../../components/SendTalk';
import useFetchData from '../../hooks/useFetchData';
import styled from 'styled-components';
import io from 'socket.io-client';
import useChatFunc from '../../hooks/useChatFunc';
import { MAX_LOAD_TALK_COUNT } from '../../const';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/main';

const TalkRoom = memo(() => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const talkRoomId = router.query.id;
  const { userData } = useUserData();
  const [talkRoom, setTalkRoom] = useState({});
  const [talks, setTalks] = useState([]);
  const [talkCount, setTalkCount] = useState(0);
  const [talksLoadCount, setTalksLoadCount] = useState(0);
  const { fetchTalksFunc, fetchTalkRoomFunc } = useFetchData();
  const { readTalksFunc } = useChatFunc();
  const socketRef = useRef(null);

  //   トークルーム内のメンバーを取得
  const fetchTalkRoom = useCallback(async () => {
    const response = await fetchTalkRoomFunc(userData._id, talkRoomId);
    setTalkRoom(response);
  }, []);
  // トークルーム内の全てのトークを取得
  const fetchTalks = useCallback(async (talkRoomId, start, limit) => {
    const { talks: addTalks, talkCount } = await fetchTalksFunc(
      talkRoomId,
      start,
      limit
    );
    if (start === 0) {
      setTalks(addTalks);
    } else {
      setTalks((prevTalks) => [...addTalks, ...prevTalks]);
    }
    setTalkCount(talkCount);
  }, []);
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    }
  }, [user]);
  useEffect(() => {
    fetchTalkRoom();
    socketRef.current = io(process.env.NEXT_PUBLIC_SERVER_URL);
    socketRef.current.on('connect', () => {
      console.log('WebSocket connected');
    });

    socketRef.current.on('received_message', async (data) => {
      if (
        router.pathname.split('/')[1] === 'TalkRoom' &&
        router.query.id === data.talkRoomId
      ) {
        await readTalksFunc({
          talk_room_id: data.talkRoomId,
          reader_id: userData._id,
        });
        await fetchTalks(data.talkRoomId, 0, MAX_LOAD_TALK_COUNT);
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (talksLoadCount === 0 || talks.length < talkCount) {
      fetchTalks(
        talkRoomId,
        talksLoadCount * MAX_LOAD_TALK_COUNT,
        MAX_LOAD_TALK_COUNT
      );
    }
  }, [talksLoadCount]);

  return (
    <SChat>
      <MessageList
        talks={talks}
        setTalksLoadCount={setTalksLoadCount}
        setTalks={setTalks}
        talkRoom={talkRoom}
        fetchTalks={fetchTalks}
      />
      <SendTalk
        userId={userData._id}
        talkRoomId={talkRoomId}
        setTalksLoadCount={setTalksLoadCount}
        iconImage={userData.icon_image}
      />
    </SChat>
  );
});

export default TalkRoom;

const SChat = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;
TalkRoom.displayName = 'TalkRoom';
