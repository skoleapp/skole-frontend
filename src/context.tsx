import { CommentObjectType, UserObjectType } from 'generated/graphql';
import * as R from 'ramda';
import React, { createContext, useEffect, useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

import { breakpointsNum } from './styles';
import {
    AttachmentViewerContext,
    AuthContext,
    CommentModalContext,
    CommentThreadContext,
    DiscussionBoxContext,
    LanguageSelectorContext,
    NotificationsContext,
    PDFPage,
    PDFViewerContext,
    SettingsContext,
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
        numPages: 0,
        currentPage: 0,
        areaSelected: false,
        setNumPages: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        setCurrentPage: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        setAreaSelected: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    isMobileGuess: null,
    discussionBox: {
        comments: null,
        setComments: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
});

const useSkoleContext = (): SkoleContextType => useContext(SkolePageContext);

interface UseAuthContext extends AuthContext {
    verified: boolean | null;
    notVerifiedTooltip: string | false;
}

export const useAuthContext = (): UseAuthContext => {
    const { t } = useTranslation();
    const { user, setUser } = useSkoleContext().auth;
    const verified = R.propOr(null, 'verified', user) as boolean | null;
    const notVerifiedTooltip = verified === false && t('common:notVerifiedTooltip');
    return { user, setUser, verified, notVerifiedTooltip };
};

export const useAttachmentViewerContext = (): AttachmentViewerContext => useSkoleContext().attachmentViewer;
export const useCommentThreadContext = (): CommentThreadContext => useSkoleContext().commentThread;
export const useCommentModalContext = (): CommentModalContext => useSkoleContext().commentModal;
export const useLanguageSelectorContext = (): LanguageSelectorContext => useSkoleContext().languageSelector;
export const useNotificationsContext = (): NotificationsContext => useSkoleContext().notifications;
export const useSettingsContext = (): SettingsContext => useSkoleContext().settings;
export const usePDFViewerContext = (): PDFViewerContext => useSkoleContext().pdfViewer;

interface UseDiscussionBoxContext extends Pick<DiscussionBoxContext, 'setComments'> {
    comments: CommentObjectType[];
}

export const useDiscussionBoxContext = (initialComments: CommentObjectType[]): UseDiscussionBoxContext => {
    const { comments, setComments } = useSkoleContext().discussionBox;
    return { comments: comments || initialComments, setComments };
};

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

    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const [rotate, setRotate] = useState(0);
    const [drawing, setDrawing] = useState(false);
    const [screenshot, setScreenshot] = useState(null);
    const [scale, setScale] = useState(1.0);
    const handleRotate = (): void => (rotate === 270 ? setRotate(0) : setRotate(rotate + 90));

    const [comments, setComments] = useState<CommentObjectType[] | null>(null);

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
            numPages,
            setNumPages,
            pageNumber,
            setPageNumber,
            rotate,
            drawing,
            setDrawing,
            screenshot,
            setScreenshot,
            scale,
            setScale,
            handleRotate,
        },
        isMobileGuess,
        discussionBox: {
            comments,
            setComments,
        },
    };

    return <SkolePageContext.Provider value={contextValue}>{children}</SkolePageContext.Provider>;
};
