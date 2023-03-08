import React, { createContext, memo, useContext } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');
export const SocketContext = createContext({});

export const SocketProvider = memo(({ children }) => {
  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
});

export const useSocket = () => useContext(SocketContext);
