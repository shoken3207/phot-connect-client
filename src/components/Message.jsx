import React, { forwardRef, memo } from 'react';
import LinkWrap from './LinkWrap';
import styled from 'styled-components';
import { getChatDate } from '../utils/dateUtils';

const Message = memo(
  forwardRef(
    (
      { senderIconImage, senderId, message, image, isSender, createdAt },
      ref
    ) => {
      return (
        <SMessageWrap isSender={isSender} ref={ref}>
          <SMessageIcon isSender={isSender} senderIconImage={senderIconImage}>
            <LinkWrap href={`/Profile/${senderId}`}>
              <img
                src={senderIconImage || '/images/noAvatar.png'}
                alt='avatarImage'
              />
            </LinkWrap>
          </SMessageIcon>
          <SMessageContent isSender={isSender} image={image}>
            <SMessage
              message={message}
              isSender={isSender}
              dangerouslySetInnerHTML={{ __html: message }}
            ></SMessage>
            <SImage image={image}>
              <img src={image} />
            </SImage>
            <SSendAt isSender={isSender}>{getChatDate(createdAt)}</SSendAt>
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
  height: auto;
  column-gap: 1rem;
  flex-direction: ${(props) => (props.isSender ? 'row-reverse' : 'row')};
  justify-content: flex-start;
`;

const SMessageIcon = styled.div`
  display: ${(props) => (props.isSender ? 'none' : 'block')};
  opacity: ${(props) => (props.senderIconImage === '' ? '0' : '1')};
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
  width: ${(props) => (props.image === '' ? 'fit-content' : '55%')};
  max-width: 450px;
  position: relative;
  align-items: ${(props) => (props.isSender ? 'flex-end' : 'flex-start')};
`;

const SMessage = styled.div`
  width: fit-content;
  min-width: 3.5rem;
  font-size: 0.9rem;
  border-radius: 15px;
  padding: 0.5rem 0.8rem;
  height: auto;
  word-break: break-word;
  display: ${(props) => (props.message ? 'block' : 'none')};
  background-color: ${(props) => (props.isSender ? '#9a979c' : '#ad45de')};
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
    props.isSender ? 'translateX(-120%)' : 'translateX(120%)'};
`;
