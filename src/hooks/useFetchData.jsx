import axios from 'axios';
import React, { useCallback, useState } from 'react';

const useFetchData = () => {
  const fetchUserData = async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/user/${userId}`
    );
    console.log('response: ', response.data);
    return response.data;
  };

  const fetchAllTalkData = useCallback(async (talkRoomId) => {
    const response = await axios.get(
      `http://localhost:5000/api/talk/${talkRoomId}/all`
    );
    return response.data;
  }, []);

  const fetchHomePlans = async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/plan/${userId}/home`
    );
    console.log('response: ', response.data);
    return response.data;
  };

  const fetchCreatePlans = async (userId) => {
    const response = await axios.get(
      `http://localhost:5000/api/plan/${userId}/create`
    );
    console.log('response: ', response.data);
    return response.data;
  };

  const fetchPrefecturePlans = async (prefecture) => {
    const response = await axios.get(
      `http://localhost:5000/api/plan/${prefecture}/prefecture`
    );
    console.log('response: ', response.data);
    return response.data;
  };

  return {
    fetchUserData,
    fetchAllTalkData,
    fetchHomePlans,
    fetchCreatePlans,
    fetchPrefecturePlans,
  };
};

export default useFetchData;
