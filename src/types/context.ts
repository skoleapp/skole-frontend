import { FormikProps } from 'formik';
import { UserFieldsFragment } from 'generated';
import { Dispatch, MutableRefObject, SetStateAction } from 'react';

import { ActionsDialogParams, InfoDialogParams, ShareDialogParams } from './dialogs';
import { CreateCommentFormValues } from './forms';

export interface AuthContextType {
  userMe: UserFieldsFragment | null;
  setUserMe: Dispatch<SetStateAction<UserFieldsFragment | null>>;
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

export interface ActionsContextType {
  actionsDialogOpen: boolean;
  actionsDialogParams: ActionsDialogParams;
  handleOpenActionsDialog: (actionsDialogParams: ActionsDialogParams) => void;
  handleCloseActionsDialog: () => void;
}

export interface InfoContextType {
  infoDialogOpen: boolean;
  infoDialogParams: InfoDialogParams;
  handleOpenInfoDialog: (infoDialogParams: InfoDialogParams) => void;
  handleCloseInfoDialog: () => void;
}

export interface ThreadContextType {
  createCommentDialogOpen: boolean;
  setCreateCommentDialogOpen: Dispatch<SetStateAction<boolean>>;
  threadImageViewerValue: string | null;
  setThreadImageViewerValue: Dispatch<SetStateAction<string | null>>;
  commentImageViewerValue: string | null;
  setCommentImageViewerValue: Dispatch<SetStateAction<string | null>>;
  commentImage: string | ArrayBuffer | null;
  setCommentImage: Dispatch<SetStateAction<string | ArrayBuffer | null>>;
  commentFileName: string;
  setCommentFileName: Dispatch<SetStateAction<string>>;
  formRef: MutableRefObject<FormikProps<CreateCommentFormValues>>;
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

export interface ShareContextType {
  shareDialogOpen: boolean;
  handleOpenShareDialog: (shareDialogParams: ShareDialogParams) => void;
  handleCloseShareDialog: () => void;
  shareDialogParams: ShareDialogParams;
}

export interface HistoryContextType {
  history: string[];
}

export interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
  dynamicPrimaryColor: 'primary' | 'secondary';
}

export interface ThreadFormParams {
  title?: string;
  image?: File | null;
}

export interface ThreadFormContextType {
  threadFormOpen: boolean;
  handleOpenThreadForm: (params?: ThreadFormParams) => void;
  handleCloseThreadForm: () => void;
  threadFormParams: ThreadFormParams;
}

export interface SetOrderingParams {
  pathname: string;
  ordering: string;
}

export interface OrderingContextType {
  ordering: string;
  orderingLabel: string;
  setOrdering: (params: SetOrderingParams) => Promise<boolean>;
}

export interface VoteContextType {
  votePromptOpen: boolean;
  handleOpenVotePrompt: () => void;
  handleCloseVotePrompt: () => void;
}

export interface ScrollingContextType {
  scrollingDisabled: boolean;
  setScrollingDisabled: Dispatch<SetStateAction<boolean>>;
  zoomingDisabled: boolean;
  setZoomingDisabled: Dispatch<SetStateAction<boolean>>;
}

export interface DragContextType {
  dragOver: boolean;
  setDragOver: Dispatch<SetStateAction<boolean>>;
  handleDragOver: (e: DragEvent) => void;
  handleDragLeave: () => void;
}

export interface MediaQueryContextType {
  smDown: boolean;
  mdUp: boolean;
}
