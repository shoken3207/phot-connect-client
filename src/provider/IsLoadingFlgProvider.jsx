import React, { memo } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const IsLoadingFlgContext = createContext({});
export const IsLoadingFlgProvider = memo(({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <IsLoadingFlgContext.Provider value={{ isLoading, setIsLoading }}>
      {children}
    </IsLoadingFlgContext.Provider>
  );
});
export const useIsLoadingFlg = () => useContext(IsLoadingFlgContext);
