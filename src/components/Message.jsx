import React, { forwardRef, memo, useEffect } from 'react';
import LinkWrap from './LinkWrap';
import styled from 'styled-components';
import { convertToDispDate } from '../utils/dateUtils';
// import { format } from 'timeago.js';

const Message = memo(
  forwardRef(
    (
      { senderIconImage, senderId, message, image, isSender, createdAt },
      ref
    ) => {
      // const nowDate = new Date();
      // const convertedCreatedAt = convertToDispDate(nowDate.toISOString());
      // console.log('convertedCreatedAt: ', convertedCreatedAt);
      console.log('ref: ', ref);
      return (
        <SMessageWrap isSender={isSender} ref={ref}>
          <SMessageIcon isSender={isSender}>
            <LinkWrap href='/profile'>
              <img
                src={senderIconImage || '/images/noAvatar.png'}
                alt='avatarImage'
              />
            </LinkWrap>
          </SMessageIcon>
          <SMessageContent>
            <SMessage
              message={message}
              isSender={isSender}
              dangerouslySetInnerHTML={{ __html: message }}
            ></SMessage>
            <SImage image={image}>
              <img src={image} />
            </SImage>
            <SSendAt isSender={isSender}>{createdAt}</SSendAt>
          </SMessageContent>
        </SMessageWrap>
      );
    }
  )
);

export default Message;

const SMessageWrap = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  /* overflow: hidden; */
  height: auto;
  column-gap: 1rem;
  flex-direction: ${(props) => (props.isSender ? 'row-reverse' : 'row')};
  justify-content: flex-start;
`;

const SMessageIcon = styled.div`
  display: ${(props) => (props.isSender ? 'none' : 'block')};
  > a img {
    width: 2.3rem;
    height: 2.3rem;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const SMessageContent = styled.div`
  display: flex;
  flex-direction: column;
  row-gap: 0.5rem;
  width: fit-content;
  max-width: 500px;
  position: relative;
`;

const SMessage = styled.div`
  width: 100%;
  min-width: 3.5rem;
  font-size: 0.9rem;
  border-radius: 15px;
  padding: 0.5rem 0.8rem;
  height: auto;
  word-break: break-word;
  display: ${(props) => (props.message ? 'block' : 'none')};
  background-color: ${(props) => (props.isSender ? 'gray' : 'purple')};
  color: ${(props) => (props.isSender ? 'black' : 'white')};
`;

const SImage = styled.div`
  display: ${(props) => (props.image ? 'block' : 'none')};
  width: 100%;
  img {
    width: 100%;
    height: 100%;
  }
`;

const SSendAt = styled.p`
  font-size: 0.7rem;
  color: gray;
  position: absolute;
  bottom: 0;
  left: ${(props) => props.isSender && 0};
  right: ${(props) => !props.isSender && 0};
  transform: ${(props) =>
    props.isSender ? 'translateX(-110%)' : 'translateX(110%)'};
`;
