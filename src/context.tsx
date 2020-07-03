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
    DiscussionContext,
    LanguageSelectorContext,
    NotificationsContext,
    PDFViewerContext,
    SettingsContext,
    SkoleContextType,
} from './types';
import { defaultScale, defaultTranslation } from './utils';

const SkolePageContext = createContext<SkoleContextType>({
    auth: {
        user: null,
        setUser: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
    attachmentViewer: {
        attachment: null,
        toggleAttachmentViewer: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
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
        drawMode: false,
        setDrawMode: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        screenshot: null,
        setScreenshot: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        rotate: 0,
        setRotate: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        fullscreen: false,
        setFullscreen: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        ctrlKey: false,
        setCtrlKey: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        scale: 1.0,
        setScale: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        translation: { x: 0, y: 0 },
        setTranslation: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
    },
    isMobileGuess: null,
    discussion: {
        topLevelComments: [],
        setTopLevelComments: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
        topComment: null,
        toggleTopComment: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function
    },
});

const useSkoleContext = (): SkoleContextType => useContext(SkolePageContext);

interface UseAuthContext extends AuthContext {
    verified: boolean | null;
    verificationRequiredTooltip: string | false;
}

export const useAuthContext = (): UseAuthContext => {
    const { t } = useTranslation();
    const { user, setUser } = useSkoleContext().auth;
    const verified = R.propOr(null, 'verified', user) as boolean | null;
    const verificationRequiredTooltip = verified === false && t('tooltips:verificationRequired');
    return { user, setUser, verified, verificationRequiredTooltip };
};

export const useAttachmentViewerContext = (): AttachmentViewerContext => useSkoleContext().attachmentViewer;
export const useCommentModalContext = (): CommentModalContext => useSkoleContext().commentModal;
export const useLanguageSelectorContext = (): LanguageSelectorContext => useSkoleContext().languageSelector;
export const useNotificationsContext = (): NotificationsContext => useSkoleContext().notifications;
export const useSettingsContext = (): SettingsContext => useSkoleContext().settings;
export const usePDFViewerContext = (): PDFViewerContext => useSkoleContext().pdfViewer;

interface UseDiscussionContext extends DiscussionContext {
    commentCount: number;
}

export const useDiscussionContext = (initialComments?: CommentObjectType[]): UseDiscussionContext => {
    const {
        topLevelComments: contextTopLevelComments,
        setTopLevelComments,
        ...discussionContext
    } = useSkoleContext().discussion;

    const topLevelComments: CommentObjectType[] = !!contextTopLevelComments.length
        ? contextTopLevelComments
        : initialComments || [];

    const commentCount =
        topLevelComments.length + topLevelComments.reduce((acc, cur) => acc + cur.replyComments.length, 0);

    return { topLevelComments, setTopLevelComments, commentCount, ...discussionContext };
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

    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const toggleCommentModal = (payload: boolean): void => setCommentModalOpen(payload);

    const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
    const toggleLanguageSelector = (open: boolean): void => setLanguageSelectorOpen(open);

    const [notification, setNotification] = useState<string | null>(null);
    const toggleNotification = (payload: string | null): void => setNotification(payload);

    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = (open: boolean): void => setSettingsOpen(open);

    const [drawMode, setDrawMode] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [rotate, setRotate] = useState(0);
    const [fullscreen, setFullscreen] = useState(false);
    const [ctrlKey, setCtrlKey] = useState(false);
    const [scale, setScale] = useState(defaultScale);
    const [translation, setTranslation] = useState(defaultTranslation);

    const [topLevelComments, setTopLevelComments] = useState<CommentObjectType[]>([]);
    const [topComment, setTopComment] = useState<CommentObjectType | null>(null);
    const toggleTopComment = (payload: CommentObjectType | null): void => setTopComment(payload);

    const contextValue = {
        auth: {
            user,
            setUser,
        },
        attachmentViewer: {
            attachment,
            toggleAttachmentViewer,
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
            drawMode,
            setDrawMode,
            screenshot,
            setScreenshot,
            rotate,
            setRotate,
            fullscreen,
            setFullscreen,
            ctrlKey,
            setCtrlKey,
            scale,
            setScale,
            translation,
            setTranslation,
        },
        isMobileGuess,
        discussion: {
            topLevelComments,
            setTopLevelComments,
            topComment,
            toggleTopComment,
        },
    };

    return <SkolePageContext.Provider value={contextValue}>{children}</SkolePageContext.Provider>;
};
