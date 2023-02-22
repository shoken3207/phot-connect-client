import React, { memo } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const SnackbarInfoContext = createContext({});
export const SnackbarInfoProvider = memo(({ children }) => {
  const [snackbarInfo, setSnackbarInfo] = useState({});
  return (
    <SnackbarInfoContext.Provider value={{ snackbarInfo, setSnackbarInfo }}>
      {children}
    </SnackbarInfoContext.Provider>
  );
});
export const useSnackbarInfo = () => useContext(SnackbarInfoContext);
