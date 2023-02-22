import React, { memo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useUserData } from '../provider/UserDataProvider';
import Message from './Message';
const MessageBox = memo(({ allTalkData }) => {
  const { userData } = useUserData();
  const lastMessageRef = useRef(null);
  const isLastMessage = (index) => {
    console.log(index + 1 === allTalkData.length);
    return index + 1 === allTalkData.length;
  };

  useEffect(() => {
    setTimeout(() => {
      console.log(lastMessageRef.current);
      lastMessageRef?.current?.scrollIntoView('smooth');
    }, 300);
  }, [allTalkData]);

  return (
    <SMessageList>
      {allTalkData.map((talkData, index) =>
        userData._id === talkData.senderId ? (
          <Message
            key={talkData._id}
            senderId={talkData.senderId}
            message={talkData.message}
            image={talkData.image}
            createdAt={talkData.createdAt}
            senderIconImage={talkData.senderIconImage}
            isSender={true}
            {...(isLastMessage(index) && { ref: lastMessageRef })}
          />
        ) : (
          <Message
            key={talkData._id}
            message={talkData.message}
            image={talkData.image}
            createdAt={talkData.createdAt}
            senderIconImage={talkData.senderIconImage}
            senderId={talkData.senderId}
            isSender={false}
            {...(isLastMessage(index) && { ref: lastMessageRef })}
          />
        )
      )}
    </SMessageList>
  );
});

export default MessageBox;

const SMessageList = styled.div`
  height: 80vh;
  width: 100%;
  overflow-y: scroll;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  row-gap: 0.9rem;
  padding: 0.2rem 0;
`;
