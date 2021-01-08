import { useTranslation } from 'lib';
import React, { createContext, useContext, useState } from 'react';
import { NotificationsContextType } from 'types';

// @ts-ignore: Initialize context with empty object rather than populating it with placeholder values.
const NotificationsContext = createContext<NotificationsContextType>({});

export const useNotificationsContext = (): NotificationsContextType =>
  useContext(NotificationsContext);

export const NotificationsContextProvider: React.FC = ({ children }) => {
  const { t } = useTranslation();
  const [notification, setNotification] = useState<string | null>(null);
  const toggleNotification = (payload: string | null): void => setNotification(payload);
  const unexpectedError = (): void => toggleNotification(t('notifications:unexpectedError'));

  const value = {
    notification,
    toggleNotification,
    unexpectedError,
  };

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
