'use client';
import React, { memo, useEffect } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const UserDataContext = createContext({});
export const UserDataProvider = memo(({ children }) => {
  const [userData, setUserData] = useState({
    _id: '',
    username: '',
    desc: '',
    birthday: '',
    prefecture: '',
    iconImage: '',
    homeImage: '',
  });
  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(userData));
  }, [userData]);
  useEffect(() => {
    setUserData(JSON.parse(sessionStorage.getItem('user')));
  }, []);
  return (
    <UserDataContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserDataContext.Provider>
  );
});

export const useUserData = () => {
  const { userData, setUserData } = useContext(UserDataContext);
  return { userData, setUserData };
};
UserDataProvider.displayName = 'UserDataProvider';
