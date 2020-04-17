import { CommentObjectType, UserObjectType } from 'generated/graphql';
import React, { createContext, useState } from 'react';
import { useContext } from 'react';

import {
    AttachmentViewer,
    AuthContext,
    CommentThread,
    DeviceInfo,
    LanguageSelector,
    Notifications,
    PDFPage,
    PDFViewer,
    Settings,
    SkoleContextType,
} from './types';

const SkolePageContext = createContext<SkoleContextType>({
    auth: {
        user: null,
        setUser: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    attachmentViewer: {
        attachment: null,
        toggleAttachmentViewer: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    commentThread: {
        topComment: null,
        toggleCommentThread: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    languageSelector: {
        languageSelectorOpen: false,
        toggleLanguageSelector: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    notifications: {
        notification: null,
        toggleNotification: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    settings: {
        settingsOpen: false,
        toggleSettings: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    pdfViewer: {
        pages: [],
        currentPage: 0,
        effect: '',
        resetEffect: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        setCenter: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        prevPage: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        nextPage: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        setPages: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        setCurrentPage: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    device: {
        isMobile: null,
        setMobile: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
});

const useSkoleContext = (): SkoleContextType => useContext(SkolePageContext);
export const useAuthContext = (): AuthContext => useSkoleContext().auth;
export const useAttachmentViewerContext = (): AttachmentViewer => useSkoleContext().attachmentViewer;
export const useCommentThreadContext = (): CommentThread => useSkoleContext().commentThread;
export const useLanguageSelectorContext = (): LanguageSelector => useSkoleContext().languageSelector;
export const useNotificationsContext = (): Notifications => useSkoleContext().notifications;
export const useSettingsContext = (): Settings => useSkoleContext().settings;
export const usePDFViewerContext = (): PDFViewer => useSkoleContext().pdfViewer;
export const useDeviceContext = (): DeviceInfo => useSkoleContext().device;

interface Props {
    user: UserObjectType | null;
    isMobileGuess: boolean | null;
}

export const ContextProvider: React.FC<Props> = ({ children, user: initialUser, isMobileGuess }) => {
    const [user, setUser] = useState(initialUser);

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

    const [pdf, setPdf] = useState<Pick<PDFViewer, 'pages' | 'currentPage' | 'effect'>>({
        pages: [],
        currentPage: 0,
        effect: '',
    });

    const [isMobile, setMobile] = useState<boolean | null>(isMobileGuess);

    const resetEffect = (): void => setPdf({ ...pdf, effect: '' });
    const setCenter = (): void => setPdf({ ...pdf, effect: 'SET_CENTER' });
    const prevPage = (): void => setPdf({ ...pdf, effect: 'PREV_PAGE' });
    const nextPage = (): void => setPdf({ ...pdf, effect: 'NEXT_PAGE' });
    const setPages = (pages: PDFPage[]): void => setPdf({ ...pdf, pages });
    const setCurrentPage = (currentPage: number): void => setPdf({ ...pdf, currentPage });

    const contextValue = {
        auth: {
            user,
            setUser,
        },
        attachmentViewer: {
            attachment,
            toggleAttachmentViewer,
        },
        commentThread: {
            topComment,
            toggleCommentThread,
        },
        languageSelector: {
            languageSelectorOpen,
            toggleLanguageSelector,
        },
        notifications: {
            notification,
            toggleNotification,
        },
        settings: {
            settingsOpen,
            toggleSettings,
        },
        pdfViewer: {
            ...pdf,
            resetEffect,
            setCenter,
            prevPage,
            nextPage,
            setPages,
            setCurrentPage,
        },
        device: {
            isMobile,
            setMobile,
        },
    };

    return <SkolePageContext.Provider value={contextValue}>{children}</SkolePageContext.Provider>;
};
