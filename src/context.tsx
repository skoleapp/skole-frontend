import { CommentObjectType, UserObjectType } from 'generated';
import * as R from 'ramda';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { breakpointsNum } from 'styles';
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
} from 'types';

// Ignore: All functions below are ignored as they are only mock functions for the context.
const SkolePageContext = createContext<SkoleContextType>({
    auth: {
        userMe: null,
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
        documentRef: null,
        pageNumberInputRef: null,
        controlsDisabled: false,
        setControlsDisabled: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        drawMode: false,
        setDrawMode: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        screenshot: null,
        setScreenshot: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        rotate: 0,
        setRotate: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        numPages: 0,
        setNumPages: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
        pageNumber: 0,
        setPageNumber: (): void => {}, // eslint-disable-line @typescript-eslint/no-empty-function,
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
    const { userMe, setUserMe } = useSkoleContext().auth;
    const verified = R.propOr(null, 'verified', userMe) as boolean | null;
    const verificationRequiredTooltip = verified === false && t('tooltips:verificationRequired');
    return { userMe, setUserMe, verified, verificationRequiredTooltip };
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
    userMe: UserObjectType | null;
    isMobileGuess: boolean | null;
}

export const ContextProvider: React.FC<Props> = ({ children, userMe: initialUserMe, isMobileGuess }) => {
    // Auth context.
    const [userMe, setUserMe] = useState(initialUserMe);

    // Attachment viewer context.
    const [attachment, setAttachment] = useState<string | null>(null);
    const toggleAttachmentViewer = (payload: string | null): void => setAttachment(payload);

    // Comment modal context.
    const [commentModalOpen, setCommentModalOpen] = useState(false);
    const toggleCommentModal = (payload: boolean): void => setCommentModalOpen(payload);

    // Language selector context.
    const [languageSelectorOpen, setLanguageSelectorOpen] = useState(false);
    const toggleLanguageSelector = (open: boolean): void => setLanguageSelectorOpen(open);

    // Notifications context.
    const [notification, setNotification] = useState<string | null>(null);
    const toggleNotification = (payload: string | null): void => setNotification(payload);

    // Settings context.
    const [settingsOpen, setSettingsOpen] = useState(false);
    const toggleSettings = (open: boolean): void => setSettingsOpen(open);

    // PDF viewer context.
    const documentRef = useRef<Document>(null);
    const pageNumberInputRef = useRef<HTMLInputElement>(null);
    const [controlsDisabled, setControlsDisabled] = useState(true);
    const [drawMode, setDrawMode] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [rotate, setRotate] = useState(0);
    const [numPages, setNumPages] = useState(0);
    const [pageNumber, setPageNumber] = useState(0);

    // Comment thread context.
    const [topLevelComments, setTopLevelComments] = useState<CommentObjectType[]>([]);
    const [topComment, setTopComment] = useState<CommentObjectType | null>(null);
    const toggleTopComment = (payload: CommentObjectType | null): void => setTopComment(payload);

    const contextValue = {
        auth: {
            userMe,
            setUserMe,
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
            documentRef,
            pageNumberInputRef,
            controlsDisabled,
            setControlsDisabled,
            drawMode,
            setDrawMode,
            screenshot,
            setScreenshot,
            rotate,
            setRotate,
            numPages,
            setNumPages,
            pageNumber,
            setPageNumber,
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
