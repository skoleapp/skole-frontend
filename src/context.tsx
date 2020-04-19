import { CommentObjectType, UserObjectType } from 'generated/graphql';
import React, { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';

import { breakpointsNum } from './styles';
import {
    AttachmentViewer,
    AuthContext,
    CommentModal,
    CommentThread,
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
    commentModal: {
        commentModalOpen: false,
        toggleCommentModal: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
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
    isMobileGuess: null,
});

const useSkoleContext = (): SkoleContextType => useContext(SkolePageContext);
export const useAuthContext = (): AuthContext => useSkoleContext().auth;
export const useAttachmentViewerContext = (): AttachmentViewer => useSkoleContext().attachmentViewer;
export const useCommentThreadContext = (): CommentThread => useSkoleContext().commentThread;
export const useCommentModalContext = (): CommentModal => useSkoleContext().commentModal;
export const useLanguageSelectorContext = (): LanguageSelector => useSkoleContext().languageSelector;
export const useNotificationsContext = (): Notifications => useSkoleContext().notifications;
export const useSettingsContext = (): Settings => useSkoleContext().settings;
export const usePDFViewerContext = (): PDFViewer => useSkoleContext().pdfViewer;

// Allow using custom breakpoints, use MD as default.
export const useDeviceContext = (breakpoint: number = breakpointsNum.MD): boolean => {
    const { isMobileGuess } = useSkoleContext();
    const [isMobile, setIsMobile] = useState(isMobileGuess);

    useEffect(() => {
        setIsMobile(window.innerWidth < breakpoint); // Make sure correct value is applied on client side.

        const resizeFunctionRef = (): void => {
            setIsMobile(window.innerWidth < breakpoint);
        };

        // Listen for changes and update the state accordingly.
        window.addEventListener('resize', resizeFunctionRef);
        return (): void => window.removeEventListener('resize', resizeFunctionRef);
    }, []);

    // If guess value is null resolve value into mobile.
    return isMobile === null ? true : !!isMobile;
};

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

    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const toggleCommentModal = (payload: boolean): void => setCommentModalOpen(payload);

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

    const resetEffect = (): void => setPdf({ ...pdf, effect: '' });
    const setCenter = (): void => setPdf({ ...pdf, effect: 'SET_CENTER' });
    const prevPage = (): void => setPdf({ ...pdf, currentPage: pdf.currentPage - 1, effect: 'PREV_PAGE' });
    const nextPage = (): void => setPdf({ ...pdf, currentPage: pdf.currentPage + 1, effect: 'NEXT_PAGE' });
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
        commentModal: {
            commentModalOpen,
            toggleCommentModal,
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
        isMobileGuess,
    };

    return <SkolePageContext.Provider value={contextValue}>{children}</SkolePageContext.Provider>;
};
