import React, { createContext, useContext, useState } from 'react';
import { ActionsContextType, ActionsDialogParams } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ActionsContext = createContext<ActionsContextType>({});

export const useActionsContext = (): ActionsContextType => useContext(ActionsContext);

const initialActionsDialogParams: ActionsDialogParams = {
  shareText: '',
  shareDialogParams: {},
  deleteActionParams: {},
  renderCustomActions: [],
  hideShareAction: false,
  hideDeleteAction: false,
  hideReportAction: false,
};

export const ActionsContextProvider: React.FC = ({ children }) => {
  const [actionsDialogOpen, setActionsDialogOpen] = useState(false);
  const [actionsDialogParams, setActionsDialogParams] = useState(initialActionsDialogParams);

  const handleOpenActionsDialog = (newActionsDialogParams: ActionsDialogParams) => {
    setActionsDialogParams(newActionsDialogParams);
    setActionsDialogOpen(true);
  };

  const handleCloseActionsDialog = () => {
    setActionsDialogParams(initialActionsDialogParams);
    setActionsDialogOpen(false);
  };

  const value = {
    actionsDialogOpen,
    handleOpenActionsDialog,
    handleCloseActionsDialog,
    actionsDialogParams,
  };

  return <ActionsContext.Provider value={value}>{children}</ActionsContext.Provider>;
};
