import React, { memo, useEffect } from 'react';
import { useState } from 'react';
import { createContext, useContext } from 'react';

export const PanelValueContext = createContext({});
export const PanelValueProvider = memo(function PanelValueProvider({
  children,
}) {
  const [panelValue, setPanelValue] = useState(0);

  useEffect(() => {
    sessionStorage.setItem('panelValue', JSON.stringify(panelValue));
  }, [panelValue]);
  useEffect(() => {
    setPanelValue(JSON.parse(sessionStorage.getItem('panelValue')));
  }, []);
  return (
    <PanelValueContext.Provider value={{ panelValue, setPanelValue }}>
      {children}
    </PanelValueContext.Provider>
  );
});

export const usePanelValue = () => useContext(PanelValueContext);
