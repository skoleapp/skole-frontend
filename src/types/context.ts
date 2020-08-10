import { CommentObjectType, UserObjectType } from 'generated';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import SwipeableViews from 'react-swipeable-views';

export interface AuthContextType {
    userMe: UserObjectType | null;
    setUserMe: Dispatch<SetStateAction<UserObjectType | null>>;
    authNetworkError: boolean;
    setAuthNetworkError: Dispatch<SetStateAction<boolean>>;
}

export interface LanguageSelectorContextType {
    languageSelectorOpen: boolean;
    toggleLanguageSelector: (payload: boolean) => void;
}

export interface NotificationsContextType {
    notification: string | null;
    toggleNotification: (payload: string | null) => void;
}

export interface SettingsContextType {
    settingsOpen: boolean;
    toggleSettings: (payload: boolean) => void;
}

export interface PDFViewerContextType {
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
    swipingDisabled: boolean;
    setSwipingDisabled: Dispatch<SetStateAction<boolean>>;
    swipeableViewsRef: MutableRefObject<SwipeableViews | null> | null;
}

export interface DiscussionContextType {
    commentModalOpen: boolean;
    toggleCommentModal: (payload: boolean) => void;
    topLevelComments: CommentObjectType[];
    setTopLevelComments: (comments: CommentObjectType[]) => void;
    topComment: CommentObjectType | null;
    toggleTopComment: (payload: CommentObjectType | null) => void;
    attachment: string | null;
    toggleAttachmentViewer: (payload: string | null) => void;
}
