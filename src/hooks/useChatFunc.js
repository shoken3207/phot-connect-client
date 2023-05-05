import axios from 'axios';
import { useCallback } from 'react';
import { BASE_API_URL } from '../const';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';

const useChatFunc = () => {
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();

  const leaveTalkRoomFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/chat/leaveTalkRoom`,
        option
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  const createTalkFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/chat/createMessage`,
        option
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  const deleteTalkFunc = useCallback(async (option) => {
    const { talk_id, user_id } = option;
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/chat/deleteMessage/${talk_id}/${user_id}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  const readTalksFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/chat/readMessages`,
        option
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  const reactionTalkFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/chat/reactionMessage`,
        option
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  const removeTalkReactionFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/chat/removeMessageReaction`,
        option
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  return {
    leaveTalkRoomFunc,
    createTalkFunc,
    deleteTalkFunc,
    readTalksFunc,
    reactionTalkFunc,
    removeTalkReactionFunc,
  };
};

export default useChatFunc;
