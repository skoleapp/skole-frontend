import { CommentObjectType } from 'generated/graphql';
import React, { createContext, useContext, useState } from 'react';

import { SkoleContextType } from './types';

export const SkoleContext = createContext<SkoleContextType>({
    attachment: null,
    toggleAttachmentViewer: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    topComment: null,
    toggleCommentThread: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    languageSelectorOpen: false,
    toggleLanguageSelector: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    notification: null,
    toggleNotification: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    settingsOpen: false,
    toggleSettings: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const ContextProvider: React.FC = ({ children }) => {
    const [attachment, setAttachment] = useState<string | null>(null);
    const toggleAttachmentViewer = (payload: string | null): void => setAttachment(payload);

    const [topComment, setTopComment] = useState<CommentObjectType | null>(null);
    const toggleCommentThread = (payload: CommentObjectType | null): void => setTopComment(payload);

    const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
    const toggleLanguageSelector = (open: boolean): void => setLanguageSelectorOpen(open);

    const [notification, setNotification] = useState<string | null>(null);
    const toggleNotification = (payload: string | null): void => setNotification(payload);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = (open: boolean): void => setSettingsOpen(open);

    const contextValue = {
        attachment,
        toggleAttachmentViewer,
        topComment,
        toggleCommentThread,
        languageSelectorOpen,
        toggleLanguageSelector,
        notification,
        toggleNotification,
        settingsOpen,
        toggleSettings,
    };

    return <SkoleContext.Provider value={contextValue}>{children}</SkoleContext.Provider>;
};

export const useSkoleContext = (): SkoleContextType => useContext(SkoleContext);
