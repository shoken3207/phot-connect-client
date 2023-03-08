import React, { memo, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useUserData } from '../provider/UserDataProvider';
import { getChatCompereDate, getChatDispDate } from '../utils/dateUtils';
import Message from './Message';
const MessageBox = memo(({ allTalkData }) => {
  const { userData } = useUserData();
  const lastMessageRef = useRef(null);
  const isLastMessage = (index) => {
    return index + 1 === allTalkData.length;
  };

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef?.current?.scrollIntoView('smooth');
    }, 300);
  }, [allTalkData]);

  return (
    <SMessageList>
      {allTalkData.map((talkData, index) => (
        <div key={talkData._id}>
          {index === 0 && (
            <SDispDate>
              <div>{getChatDispDate(talkData.createdAt)}</div>
            </SDispDate>
          )}
          {index === 0 ||
            (Number(getChatCompereDate(talkData.createdAt)) >
              Number(getChatCompereDate(allTalkData[index - 1].createdAt)) && (
              <SDispDate>
                <div>{getChatDispDate(talkData.createdAt)}</div>
              </SDispDate>
            ))}
          {userData._id === talkData.senderId ? (
            <Message
              key={talkData._id}
              senderId={talkData.senderId}
              message={talkData.message}
              image={talkData.image}
              createdAt={talkData.createdAt}
              beforeMessageCreatedAt={allTalkData[index - 1]}
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
          )}
        </div>
      ))}
    </SMessageList>
  );
});

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
