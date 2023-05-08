import axios from 'axios';
import { useCallback } from 'react';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';

const useUserFunc = () => {
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const registerUserFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/user/register`,
        option
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return { success: true, ...response.data };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { success: false };
    }
  });

  const updateUserFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/user/update`, option);
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

  const deleteUserFunc = useCallback(async (option) => {
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/user/delete`,
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

  const addFriendFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/user/addFriend`,
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
    registerUserFunc,
    updateUserFunc,
    deleteUserFunc,
    addFriendFunc,
  };
};

export default useUserFunc;
