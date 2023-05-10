import React, { memo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useUserData } from '../provider/UserDataProvider';
import { getChatCompereDate, getChatDispDate } from '../utils/dateUtils';
import Message from './Message';
import { MAX_LOAD_TALK_COUNT } from '../const';
const MessageBox = memo(
  ({ talks, setTalksLoadCount, setTalks, talkRoom, fetchTalks }) => {
    const { userData } = useUserData();
    const lastMessageRef = useRef(null);
    const topMessageRef = useRef(null);
    const chatContainerRef = useRef(null);
    const isLastMessage = (index) => {
      return index + 1 === talks.length;
    };

    const isFunc = (index) => {
      if (talks.length <= MAX_LOAD_TALK_COUNT) return false;
      const loadCount = Math.ceil(talks.length / MAX_LOAD_TALK_COUNT);
      return index + 1 === talks.length - (loadCount - 1) * MAX_LOAD_TALK_COUNT;
    };

    useEffect(() => {
      if (talks.length > MAX_LOAD_TALK_COUNT && topMessageRef.current) {
        topMessageRef?.current?.scrollIntoView();
      } else {
        setTimeout(() => {
          lastMessageRef?.current?.scrollIntoView('smooth');
        }, 300);
      }
    }, [talks]);

    const handleScroll = () => {
      if (chatContainerRef.current.scrollTop === 0) {
        setTalksLoadCount((prev) => prev + 1);
        chatContainerRef.current.removeEventListener('scroll', this);
      }
    };

    useEffect(() => {
      chatContainerRef.current.addEventListener('scroll', handleScroll);
    }, []);
    return (
      <SMessageList ref={chatContainerRef}>
        {talks.map((talkData, index) => (
          <div key={talkData._id}>
            {index === 0 && (
              <SDispDate>
                <div>{getChatDispDate(talkData.createdAt)}</div>
              </SDispDate>
            )}
            {index === 0 ||
              (Number(getChatCompereDate(talkData.createdAt)) >
                Number(getChatCompereDate(talks[index - 1].createdAt)) && (
                <SDispDate>
                  <div>{getChatDispDate(talkData.createdAt)}</div>
                </SDispDate>
              ))}
            {userData._id === talkData.sender_id ? (
              <Message
                key={talkData._id}
                talkId={talkData._id}
                senderId={talkData.sender_id}
                message={talkData.message}
                image={talkData.image}
                createdAt={talkData.createdAt}
                beforeMessageCreatedAt={talks[index - 1]}
                senderIconImage={talkData.sender_icon_image}
                isSender={true}
                readCount={talkData.read_count}
                reactors={talkData.reactors}
                isGroupTalkRoom={talkRoom.is_group_talk_room}
                fetchTalks={fetchTalks}
                talks={talks}
                setTalks={setTalks}
                chatContainerRef={chatContainerRef}
                {...(isLastMessage(index) && { ref: lastMessageRef })}
                {...(isFunc(index) && { ref: topMessageRef })}
              />
            ) : (
              <Message
                key={talkData._id}
                talkId={talkData._id}
                message={talkData.message}
                image={talkData.image}
                createdAt={talkData.createdAt}
                senderIconImage={talkData.sender_icon_image}
                senderId={talkData.sender_id}
                isSender={false}
                readCount={talkData.read_count}
                reactors={talkData.reactors}
                isGroupTalkRoom={talkRoom.is_group_talk_room}
                fetchTalks={fetchTalks}
                talks={talks}
                setTalks={setTalks}
                chatContainerRef={chatContainerRef}
                {...(isLastMessage(index) && { ref: lastMessageRef })}
                {...(isFunc(index) && { ref: topMessageRef })}
              />
            )}
          </div>
        ))}
      </SMessageList>
    );
  }
);

export default MessageBox;

const SMessageList = styled.div`
  height: 80vh;
  width: 100%;
  margin: 0 auto;
  overflow-y: scroll;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  row-gap: 0.9rem;
  padding: 0.2rem;
  /* border: 1px solid black; */
  &::-webkit-scrollbar {
    display: none;
  }
`;

const SDispDate = styled.div`
  width: 100%;
  margin: 1rem 0;

  > div {
    width: 150px;
    padding: 0.2rem 1rem;
    font-size: 0.8rem;
    line-height: 1.3rem;
    letter-spacing: 0.15rem;
    border-radius: 20px;
    background-color: #646060;
    opacity: 0.7;
    margin: 0 auto;
    color: white;
    text-align: center;
  }
`;
