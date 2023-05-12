import axios from 'axios';
import { useCallback } from 'react';
import { LOADING_TIME } from '../const';
import { useIsLoadingFlg } from '../provider/IsLoadingFlgProvider';
import { useSnackbarInfo } from '../provider/SnackbarInfoProvider';
import { useSnackbarShowFlg } from '../provider/SnackbarShowFlgProvider';
import { convertPlanImages } from '../utils/convertData';

const useFetchData = () => {
  const { setSnackbarInfo } = useSnackbarInfo();
  const { setSnackbarIsShow } = useSnackbarShowFlg();
  const { setIsLoading } = useIsLoadingFlg();
  const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

  const fetchUserByIdFunc = useCallback(async (userId) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/${userId}/id`);
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.user;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
    }
  }, []);

  const fetchUserByEmailFunc = useCallback(async (email) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/${email}/email`);
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.user;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
    }
  }, []);

  const fetchUsersByNameFunc = useCallback(async (name) => {
    try {
      const response = await axios.get(`${BASE_API_URL}/user/${name}/name`);
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.users;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return response.data.users;
    }
  }, []);

  const fetchFriendsFunc = useCallback(async (userId) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/user/${userId}/friends`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.users;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return response.data.users;
    }
  }, []);

  const fetchTalkRoomsFunc = useCallback(
    async (userId, start = 0, limit = 10) => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_API_URL}/chat/talkRooms/${userId}/${start}/${limit}`
        );
        if (response.data.message !== '') {
          setSnackbarInfo({ text: response.data.message, severity: 'success' });
          setSnackbarIsShow(true);
        }
        return response.data.talkRooms;
      } catch (err) {
        const { response } = err;
        setSnackbarInfo({ text: response.data.message, severity: 'warning' });
        setSnackbarIsShow(true);
        return response.data.talkRooms;
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, LOADING_TIME);
      }
    },
    []
  );

  const fetchTalkRoomFunc = useCallback(async (userId, talkRoomId) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/chat/talkRoom/${userId}/${talkRoomId}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.talkRoom;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
    }
  }, []);

  const fetchTalkRoomMembersFunc = useCallback(
    async (talkRoomId, start, limit) => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/chat/members/${talkRoomId}/${start}/${limit}`
        );
        if (response.data.message !== '') {
          setSnackbarInfo({ text: response.data.message, severity: 'success' });
          setSnackbarIsShow(true);
        }
        return response.data.talkRoomMembers;
      } catch (err) {
        const { response } = err;
        setSnackbarInfo({ text: response.data.message, severity: 'warning' });
        setSnackbarIsShow(true);
        return response.data.talkRoomMembers;
      }
    },
    []
  );

  const fetchTalkFunc = useCallback(async (talkId) => {
    try {
      const response = await axios.get(
        `${BASE_API_URL}/chat/message/${talkId}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.talk;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
    }
  }, []);

  const fetchTalksFunc = useCallback(
    async (talkRoomId, start = 0, limit = 20) => {
      try {
        const response = await axios.get(
          `${BASE_API_URL}/chat/messages/${talkRoomId}/${start}/${limit}`
        );
        if (response.data.message !== '') {
          setSnackbarInfo({ text: response.data.message, severity: 'success' });
          setSnackbarIsShow(true);
        }
        return {
          talks: response.data.talks,
          talkCount: response.data.talkCount,
        };
      } catch (err) {
        const { response } = err;
        setSnackbarInfo({ text: response.data.message, severity: 'warning' });
        setSnackbarIsShow(true);
        return response.data.talks;
      }
    },
    []
  );

  const fetchPlanFunc = useCallback(async (planId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_API_URL}/plan/${planId}/id`);
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      return response.data.plan;
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIME);
    }
  }, []);

  const fetchPlansByPrefectureFunc = useCallback(
    async (prefecture, start, limit) => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_API_URL}/plan/prefecture/${prefecture}/${start}/${limit}`
        );
        if (response.data.message !== '') {
          setSnackbarInfo({ text: response.data.message, severity: 'success' });
          setSnackbarIsShow(true);
        }
        const plans = await convertPlanImages(response.data.plans);
        return {
          plans,
          planCount: response.data.planCount,
        };
      } catch (err) {
        const { response } = err;
        setSnackbarInfo({ text: response.data.message, severity: 'warning' });
        setSnackbarIsShow(true);
        return { plans: response.data.plans };
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, LOADING_TIME);
      }
    },
    []
  );

  const fetchPlansByTagFunc = useCallback(async (tag, start, limit) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/plan/tag/${tag}/${start}/${limit}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      const plans = convertPlanImages(response.data.plans);
      return {
        plans,
        planCount: response.data.planCount,
      };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { plans: response.data.plans };
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIME);
    }
  }, []);

  const fetchLikedPlansFunc = useCallback(async (userId, start, limit) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/plan/liked/${userId}/${start}/${limit}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      const plans = convertPlanImages(response.data.plans);
      return {
        plans,
        planCount: response.data.planCount,
      };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { plans: response.data.plans };
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIME);
    }
  }, []);

  const fetchParticipatedPlansFunc = useCallback(
    async (userId, start, limit) => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${BASE_API_URL}/plan/participated/${userId}/${start}/${limit}`
        );
        if (response.data.message !== '') {
          setSnackbarInfo({ text: response.data.message, severity: 'success' });
          setSnackbarIsShow(true);
        }
        const plans = convertPlanImages(response.data.plans);
        return {
          plans,
          planCount: response.data.planCount,
        };
      } catch (err) {
        const { response } = err;
        setSnackbarInfo({ text: response.data.message, severity: 'warning' });
        setSnackbarIsShow(true);
        return { plans: response.data.plans };
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, LOADING_TIME);
      }
    },
    []
  );

  const fetchCreatedPlansFunc = useCallback(async (userId, start, limit) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/plan/created/${userId}/${start}/${limit}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }
      const plans = convertPlanImages(response.data.plans);
      return { plans, planCount: response.data.planCount };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { plans: response.data.plans };
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIME);
    }
  }, []);

  const fetchHomePlansFunc = useCallback(async (userId, start, limit) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${BASE_API_URL}/plan/home/${userId}/${start}/${limit}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }

      const plans = convertPlanImages(response.data.plans);
      return {
        plans,
        planCount: response.data.planCount,
      };
    } catch (err) {
      const { response } = err;
      setSnackbarInfo({ text: response.data.message, severity: 'warning' });
      setSnackbarIsShow(true);
      return { plans: response.data.plans };
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, LOADING_TIME);
    }
  }, []);

  const fetchNotificationsFunc = useCallback(async (userId, start, limit) => {
    try {
      if (start === 0) {
        setIsLoading(true);
      }
      const response = await axios.get(
        `${BASE_API_URL}/notification/${userId}/${start}/${limit}`
      );
      if (response.data.message !== '') {
        setSnackbarInfo({ text: response.data.message, severity: 'success' });
        setSnackbarIsShow(true);
      }

      return {
        notifications: response.data.notifications,
      };
    } catch (err) {
      const { response } = err;
      if (start === 0) {
        setSnackbarInfo({ text: response.data.message, severity: 'warning' });
        setSnackbarIsShow(true);
      }
      return { notifications: response.data.notifications };
    } finally {
      if (start === 0) {
        setTimeout(() => {
          setIsLoading(false);
        }, LOADING_TIME);
      }
    }
  }, []);

  const fetchNotificationCountFunc = useCallback(async (userId) => {
    const response = await axios.get(
      `${BASE_API_URL}/notification/count/${userId}`
    );
    return {
      notificationCount: response.data.notificationCount,
    };
  }, []);

  return {
    fetchUserByIdFunc,
    fetchUserByEmailFunc,
    fetchUsersByNameFunc,
    fetchFriendsFunc,
    fetchTalkRoomsFunc,
    fetchTalkRoomFunc,
    fetchTalkRoomMembersFunc,
    fetchTalkFunc,
    fetchTalksFunc,
    fetchPlanFunc,
    fetchPlansByPrefectureFunc,
    fetchPlansByTagFunc,
    fetchLikedPlansFunc,
    fetchParticipatedPlansFunc,
    fetchCreatedPlansFunc,
    fetchHomePlansFunc,
    fetchNotificationsFunc,
    fetchNotificationCountFunc,
  };
};

export default useFetchData;
