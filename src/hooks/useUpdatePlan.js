import axios from 'axios';

const useUpdatePlan = () => {
  const participation = async (planId, talkRoomId, userId) => {
    await axios.put(`http://localhost:5000/api/plan/${planId}/participation`, {
      userId,
    });
    await axios.put(`http://localhost:5000/api/talkRoom/${talkRoomId}/add`, {
      userId,
    });
  };

  const except = async (planId, talkRoomId, userId) => {
    await axios.put(`http://localhost:5000/api/plan/${planId}/except`, {
      userId,
    });
    await axios.put(`http://localhost:5000/api/talkRoom/${talkRoomId}/except`, {
      userId,
    });
  };

  return { participation, except };
};

export default useUpdatePlan;
