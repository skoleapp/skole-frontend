import { CommentObjectType, UserObjectType } from 'generated';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

export interface AuthContext {
    user: UserObjectType | null;
    setUser: (user: UserObjectType | null) => void;
}

export interface AttachmentViewerContext {
    attachment: string | null;
    toggleAttachmentViewer: (payload: string | null) => void;
}

export interface CommentModalContext {
    commentModalOpen: boolean;
    toggleCommentModal: (payload: boolean) => void;
}

export interface LanguageSelectorContext {
    languageSelectorOpen: boolean;
    toggleLanguageSelector: (payload: boolean) => void;
}

export interface NotificationsContext {
    notification: string | null;
    toggleNotification: (payload: string | null) => void;
}

export interface SettingsContext {
    settingsOpen: boolean;
    toggleSettings: (payload: boolean) => void;
}

export interface PDFViewerContext {
    documentRef: MutableRefObject<Document | null> | null;
    pageNumberInputRef: MutableRefObject<HTMLInputElement | null> | null;
    drawMode: boolean;
    setDrawMode: Dispatch<SetStateAction<boolean>>;
    screenshot: string | null;
    setScreenshot: Dispatch<SetStateAction<string | null>>;
    rotate: number;
    setRotate: Dispatch<SetStateAction<number>>;
    numPages: number;
    setNumPages: Dispatch<SetStateAction<number>>;
    pageNumber: number;
    setPageNumber: Dispatch<SetStateAction<number>>;
    controlsDisabled: boolean;
    setControlsDisabled: Dispatch<SetStateAction<boolean>>;
}

export interface DiscussionContext {
    topLevelComments: CommentObjectType[];
    setTopLevelComments: (comments: CommentObjectType[]) => void;
    topComment: CommentObjectType | null;
    toggleTopComment: (payload: CommentObjectType | null) => void;
}

export interface SkoleContextType {
    auth: AuthContext;
    attachmentViewer: AttachmentViewerContext;
    commentModal: CommentModalContext;
    languageSelector: LanguageSelectorContext;
    notifications: NotificationsContext;
    settings: SettingsContext;
    pdfViewer: PDFViewerContext;
    isMobileGuess: boolean | null;
    discussion: DiscussionContext;
}
