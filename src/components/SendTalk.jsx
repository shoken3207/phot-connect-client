import React, { memo, useRef, useState } from 'react';
import Button from '@mui/material/Button';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SendIcon from '@mui/icons-material/Send';
import { TextField } from '@mui/material';
import axios from 'axios';
import useUploadImage from '../hooks/useUploadImage';
import SelectImage from './SelectImage';
import styled from 'styled-components';
import { useSocket } from '../provider/SocketProvider';
import { getSendMessageCompereDate } from '../utils/dateUtils';
import io from 'socket.io-client';

const SendTalk = memo(({ userId, iconImage, talkRoomId, fetchAllTalkData }) => {
  const [image, setImage] = useState();
  const [lastSendAt, setLastSendAt] = useState('');
  const [message, setMessage] = useState('');
  // const { socket } = useSocket();
  const socket = io('http://localhost:5000');
  const { uploadImage } = useUploadImage();
  const sendTalk = async (e) => {
    e.preventDefault();
    console.log('socket: ', socket);
    if (!(!!image || !!message)) {
      return;
    }
    const convertMessage = message.replace(/\n/g, '<br>');
    const option = {
      talkRoomId,
      senderId: userId,
      senderIconImage: iconImage,
      message: convertMessage,
    };
    if (image) {
      const imageName = await uploadImage(image);
      option.image = imageName;
    }
    const nowDate = new Date();
    if (lastSendAt && lastSendAt === getSendMessageCompereDate(nowDate)) {
      option.senderIconImage = '';
    }
    setLastSendAt(getSendMessageCompereDate(nowDate));
    await axios.post('http://localhost:5000/api/talk/create', option);
    await axios.put(`http://localhost:5000/api/talkRoom/${talkRoomId}`, {
      lastMessage: message,
    });
    setMessage('');
    setImage('');
    socket.emit('send_message', { talkRoomId });
  };

  return (
    <SSendTalk>
      <div>
        <SelectImage
          multiple={false}
          fullWidth={true}
          startIcon={<InsertPhotoIcon />}
          setImage={setImage}
        />
      </div>
      <div>
        <TextField
          fullWidth
          multiline
          variant='standard'
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
      <div>
        <Button variant='contained' onClick={(e) => sendTalk(e)}>
          <SendIcon />
        </Button>
      </div>
    </SSendTalk>
  );
});

export default SendTalk;

const SSendTalk = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  padding: 1rem;
  background-color: white;

  > div {
    &:nth-of-type(2) {
      width: 75%;
    }
  }
`;
