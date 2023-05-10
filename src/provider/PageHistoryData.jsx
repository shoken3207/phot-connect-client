import React, { memo, useEffect } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const PageHistoryDataContext = createContext({});
export const PageHistoryDataProvider = memo(({ children }) => {
  const [pageHistoryArray, setPageHistoryArray] = useState([]);

  useEffect(() => {
    sessionStorage.setItem('pageHistory', JSON.stringify(pageHistoryArray));
  }, [pageHistoryArray]);
  useEffect(() => {
    setPageHistoryArray(JSON.parse(sessionStorage.getItem('pageHistory')));
  }, []);

  return (
    <PageHistoryDataContext.Provider
      value={{ pageHistoryArray, setPageHistoryArray }}
    >
      {children}
    </PageHistoryDataContext.Provider>
  );
});

export const usePageHistory = () => useContext(PageHistoryDataContext);
PageHistoryDataProvider.displayName = 'PageHistoryDataProvider';
