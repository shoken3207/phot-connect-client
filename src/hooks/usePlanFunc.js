import axios from 'axios';
import { useCallback } from 'react';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';

const usePlanFunc = () => {
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const createPlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/create`, option);
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

  const closePlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/close`, option);
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
  }, []);

  const resumePlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/resume`, option);
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
  }, []);

  const updatePlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/update`, option);
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

  const participationPlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(
        `${BASE_API_URL}/plan/participation`,
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

  const leavePlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/leave`, option);
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

  const exceptPlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/except`, option);
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

  const acceptPlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/accept`, option);
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

  const invitationPlanFunc = useCallback(async (option) => {
    try {
      if (option.invitee_ids.length === 0) {
        setSnackbarInfo({ text: '選択されていません。', severity: 'warning' });
        setSnackbarIsShow(true);
        return { success: false };
      }
      const response = await axios.post(
        `${BASE_API_URL}/plan/invitation`,
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

  const cancelInvitationPlanFunc = useCallback(async (option) => {
    try {
      if (option.invitee_ids.length === 0) {
        setSnackbarInfo({ text: '選択されていません。', severity: 'warning' });
        setSnackbarIsShow(true);
        return { success: false };
      }
      const response = await axios.post(
        `${BASE_API_URL}/plan/cancelInvitation`,
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

  const likePlanFunc = useCallback(async (option) => {
    try {
      const response = await axios.post(`${BASE_API_URL}/plan/like`, option);
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

  const deletePlanFunc = useCallback(async (option) => {
    const { plan_id, user_id } = option;
    try {
      const response = await axios.delete(
        `${BASE_API_URL}/plan/delete/${plan_id}/${user_id}`,
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
    createPlanFunc,
    closePlanFunc,
    resumePlanFunc,
    invitationPlanFunc,
    cancelInvitationPlanFunc,
    updatePlanFunc,
    participationPlanFunc,
    leavePlanFunc,
    exceptPlanFunc,
    acceptPlanFunc,
    likePlanFunc,
    deletePlanFunc,
  };
};

export default usePlanFunc;
