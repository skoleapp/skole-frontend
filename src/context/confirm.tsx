import React, { createContext, useContext, useState } from 'react';
import { ConfirmationDialog } from 'components';
import { ConfirmContextType, ConfirmOptions } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const ConfirmContext = createContext<ConfirmContextType>({});
export const useConfirmContext = (): ConfirmContextType => useContext(ConfirmContext);

export const ConfirmContextProvider: React.FC = ({ children }) => {
  const [confirmOptions, setConfirmOptions] = useState({ title: '', description: '' });
  const [resolveReject, setResolveReject] = useState<(() => void)[]>([]);
  const [resolve, reject] = resolveReject;
  const handleClose = () => setResolveReject([]);

  const confirm = (confirmOptions: ConfirmOptions): Promise<void> =>
    new Promise((resolve, reject) => {
      setResolveReject([resolve, reject]);
      setConfirmOptions(confirmOptions);
    });

  const handleConfirm = () => {
    resolve();
    handleClose();
  };
  const handleCancel = () => {
    reject();
    handleClose();
  };

  const renderConfirmationDialog = (
    <ConfirmationDialog
      dialogOpen={!!resolveReject.length}
      handleConfirm={handleConfirm}
      handleCancel={handleCancel}
      {...confirmOptions}
    />
  );

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {renderConfirmationDialog}
    </ConfirmContext.Provider>
  );
};
