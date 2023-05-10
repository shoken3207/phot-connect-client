import React, { memo, useEffect } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const IsOpenFullScreenDialogContext = createContext({});
export const IsOpenFullScreenDialogProvider = memo(({ children }) => {
  const [isOpenFullScreenDialog, setIsOpenFullScreenDialog] = useState(false);
  useEffect(() => {
    sessionStorage.setItem(
      'isOpenFullScreenDialog',
      JSON.stringify(isOpenFullScreenDialog)
    );
  }, [isOpenFullScreenDialog]);
  useEffect(() => {
    setIsOpenFullScreenDialog(
      JSON.parse(sessionStorage.getItem('isOpenFullScreenDialog'))
    );
  }, []);
  return (
    <IsOpenFullScreenDialogContext.Provider
      value={{ isOpenFullScreenDialog, setIsOpenFullScreenDialog }}
    >
      {children}
    </IsOpenFullScreenDialogContext.Provider>
  );
});
export const useIsOpenFullScreenDialog = () =>
  useContext(IsOpenFullScreenDialogContext);
IsOpenFullScreenDialogProvider.displayName = 'IsOpenFullScreenDialogProvider';
