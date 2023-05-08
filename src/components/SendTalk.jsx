import React, { memo, useState } from 'react';
import Button from '@mui/material/Button';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import SendIcon from '@mui/icons-material/Send';
import { TextField } from '@mui/material';
import useUploadImage from '../hooks/useUploadImage';
import useChatFunc from '../hooks/useChatFunc';
import SelectImage from './SelectImage';
import styled from 'styled-components';
import { getSendMessageCompereDate } from '../utils/dateUtils';
import io from 'socket.io-client';

const SendTalk = memo(
  ({ userId, iconImage, talkRoomId, setTalksLoadCount }) => {
    const [image, setImage] = useState();
    const [lastSendAt, setLastSendAt] = useState('');
    const [message, setMessage] = useState('');
    const socket = io(process.env.NEXT_PUBLIC_SERVER_URL);
    const { createTalkFunc } = useChatFunc();
    const { uploadImage } = useUploadImage();
    const sendTalk = async (e) => {
      e.preventDefault();
      if (!(!!image || !!message)) {
        return;
      }
      const convertMessage = message.replace(/\n/g, '<br>');
      const option = {
        talk_room_id: talkRoomId,
        sender_id: userId,
        sender_icon_image: iconImage,
        message: convertMessage,
      };
      if (image) {
        const imageName = await uploadImage(image, 'talk');
        option.image = imageName;
      }
      const nowDate = new Date();
      if (lastSendAt && lastSendAt === getSendMessageCompereDate(nowDate)) {
        option.sender_icon_image = '';
      }
      setLastSendAt(getSendMessageCompereDate(nowDate));
      await createTalkFunc(option);
      setTalksLoadCount(0);
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
  }
);

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
