import React, { createContext, useContext, useState } from 'react';
import { NotificationsContextType } from 'types';

const NotificationsContext = createContext<NotificationsContextType>({});
export const useNotificationsContext = (): NotificationsContextType => useContext(NotificationsContext);

export const NotificationsContextProvider: React.FC = ({ children }) => {
    const [notification, setNotification] = useState<string | null>(null);
    const toggleNotification = (payload: string | null): void => setNotification(payload);

    const value = {
        notification,
        toggleNotification,
    };

    return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>;
};
