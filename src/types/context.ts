import { CommentObjectType, UserObjectType } from 'generated';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';
import { Document } from 'react-pdf';

export interface AuthContextType {
  userMe: UserObjectType | null;
  setUserMe: Dispatch<SetStateAction<UserObjectType | null>>;
  authNetworkError: boolean;
  setAuthNetworkError: Dispatch<SetStateAction<boolean>>;
}

export interface LanguageContextType {
  languageSelectorOpen: boolean;
  handleOpenLanguageMenu: () => void;
  handleCloseLanguageMenu: () => void;
}

export interface NotificationsContextType {
  notification: string | null;
  toggleNotification: (payload: string | null) => void;
  toggleUnexpectedErrorNotification: () => void;
}

export interface SettingsContextType {
  settingsDialogOpen: boolean;
  handleOpenSettingsDialog: () => void;
  handleCloseSettingsDialog: () => void;
}

export interface PdfViewerContextType {
  documentRef: MutableRefObject<Document>;
  pageNumberInputRef: MutableRefObject<HTMLInputElement>;
  drawingMode: boolean;
  setDrawingMode: Dispatch<SetStateAction<boolean>>;
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
  fullscreen: boolean;
  setFullscreen: Dispatch<SetStateAction<boolean>>;
  getMapContainerNode: () => HTMLDivElement;
  centerHorizontalScroll: () => void;
}

export interface DiscussionContextType {
  commentDialogOpen: boolean;
  toggleCommentDialog: (payload: boolean) => void;
  topLevelComments: CommentObjectType[];
  setTopLevelComments: (comments: CommentObjectType[]) => void;
  topComment: CommentObjectType | null;
  setTopComment: Dispatch<SetStateAction<CommentObjectType | null>>;
  attachmentViewerValue: string | null;
  setAttachmentViewerValue: Dispatch<SetStateAction<string | null>>;
  commentAttachment: string | ArrayBuffer | null;
  setCommentAttachment: Dispatch<SetStateAction<string | ArrayBuffer | null>>;
}

export interface ConfirmOptions {
  title: string;
  description: string;
}

export interface ConfirmContextType {
  dialogOpen: boolean;
  confirm: (confirmOptions: ConfirmOptions) => Promise<void>;
  confirmOptions: ConfirmOptions;
  handleConfirm: () => void;
  handleCancel: () => void;
}

export interface ShareParams {
  shareHeader?: string;
  shareTitle?: string;
  shareText?: string;
  linkSuffix?: string;
  customLink?: string;
}

export interface ShareContextType {
  shareDialogOpen: boolean;
  handleOpenShareDialog: (shareParams: ShareParams) => void;
  handleCloseShareDialog: () => void;
  shareParams: ShareParams;
}

export interface HistoryContextType {
  history: string[];
}
