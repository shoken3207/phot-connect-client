import React, { memo } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const SnackbarShowFlgContext = createContext({});
export const SnackbarShowFlgProvider = memo(({ children }) => {
  const [snackbarIsShow, setSnackbarIsShow] = useState(false);
  return (
    <SnackbarShowFlgContext.Provider
      value={{ snackbarIsShow, setSnackbarIsShow }}
    >
      {children}
    </SnackbarShowFlgContext.Provider>
  );
});
export const useSnackbarShowFlg = () => useContext(SnackbarShowFlgContext);
SnackbarShowFlgProvider.displayName = 'SnackbarShowFlgProvider';
