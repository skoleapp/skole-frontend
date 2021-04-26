import React, { createContext, useCallback, useContext, useState } from 'react';
import { DragContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const DragContext = createContext<DragContextType>({});
export const useDragContext = (): DragContextType => useContext(DragContext);

export const DragContextProvider: React.FC = ({ children }) => {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragOver(false), []);

  const value = {
    dragOver,
    setDragOver,
    handleDragOver,
    handleDragLeave,
  };

  return <DragContext.Provider value={value}>{children}</DragContext.Provider>;
};
