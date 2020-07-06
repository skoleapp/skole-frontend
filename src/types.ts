import { ContainerProps, DrawerProps, TablePaginationProps } from '@material-ui/core';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient, { ApolloError } from 'apollo-client';
import { Formik, FormikActions } from 'formik';
import Maybe from 'graphql/tsutils/Maybe';
import { IncomingMessage, ServerResponse } from 'http';
import { NextPageContext } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { Dispatch, MutableRefObject, SetStateAction, SyntheticEvent } from 'react';
import { UrlObject } from 'url';

import { CommentObjectType, ErrorType, SchoolObjectType, UserObjectType } from '../generated/graphql';

export interface I18nProps {
    namespacesRequired: string[];
}

export interface SEOProps {
    title?: string;
    description?: string;
}

export interface TopNavbarProps {
    header?: string;
    dynamicBackUrl?: boolean;
    staticBackUrl?: {
        href: string | UrlObject;
        as?: string | UrlObject;
    };
    disableSearch?: boolean;
    headerRight?: JSX.Element | boolean;
    headerRightSecondary?: JSX.Element;
    headerLeft?: JSX.Element;
}

export interface LayoutProps {
    seoProps?: SEOProps;
    topNavbarProps?: TopNavbarProps;
    containerProps?: ContainerProps;
    customTopNavbar?: JSX.Element;
    customBottomNavbar?: JSX.Element;
}

export interface CommentTarget {
    [key: string]: number;
}

export interface TopLevelCommentThreadProps {
    comments: CommentObjectType[];
    target: CommentTarget;
    formKey: string;
    placeholderText?: string;
}

export type MuiColor = 'inherit' | 'default' | 'primary' | 'secondary' | undefined;

export interface UseDrawer extends DrawerProps {
    handleOpen: (e: SyntheticEvent) => void;
    onClose: (e: SyntheticEvent) => void;
    renderHeader: JSX.Element;
}

export type TextVariant =
    | 'subtitle1'
    | 'inherit'
    | 'button'
    | 'caption'
    | 'h1'
    | 'h2'
    | 'h3'
    | 'h4'
    | 'h5'
    | 'h6'
    | 'subtitle2'
    | 'body1'
    | 'body2'
    | 'overline'
    | 'srOnly'
    | undefined;

export type TextColor =
    | 'initial'
    | 'primary'
    | 'secondary'
    | 'error'
    | 'textPrimary'
    | 'textSecondary'
    | 'inherit'
    | undefined;

export type ButtonColor = 'inherit' | 'primary' | 'secondary' | 'default';
export type ButtonVariant = 'text' | 'outlined' | 'contained' | undefined;

export type MutationFormError = Pick<ErrorType, 'field' | 'messages'>;
export type MutationErrors = Maybe<{ __typename?: 'ErrorType' | undefined } & MutationFormError>[];

// This is a custom type for field values. Add more options when needed.
export type FieldValue = string | File | File[] | SchoolObjectType | null;

export interface UseForm<T> {
    ref: MutableRefObject<Formik<T> | null>;
    handleMutationErrors: (err: MutationErrors) => void;
    onError: (err: ApolloError) => void;
    setSubmitting: (val: boolean) => void;
    resetForm: () => void;
    submitForm: () => Promise<void> | null;
    setFieldValue: (fieldName: string, val: FieldValue) => void;
    setFieldError: (fieldName: string, val: string) => void;
    unexpectedError: () => void;
}

export interface UseFilters<T> extends UseForm<T> {
    submitButtonText: string;
    renderDesktopClearFiltersButton?: JSX.Element | false;
    handleSubmit: (filteredValues: T, actions: FormikActions<T>) => Promise<void>;
    handleClearFilters: (e: SyntheticEvent) => Promise<void>;
    drawerProps: Omit<UseDrawer, 'renderHeader'>;
}

export type CustomTablePaginationProps = Pick<
    TablePaginationProps,
    'page' | 'count' | 'rowsPerPage' | 'onChangePage' | 'onChangeRowsPerPage'
>;

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

export type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

interface CustomApolloClient extends ApolloClient<NormalizedCacheObject> {
    toJSON: () => void;
}

export interface ApolloContext extends NextPageContext {
    apolloClient: CustomApolloClient;
    apolloState: {};
}

// Types for SSR context used with Next.js data fetching methods.
// Ignore: previewData is typed as any in next.js source as well.
export interface SSRContext {
    req: IncomingMessage;
    res: ServerResponse;
    params?: ParsedUrlQuery;
    query: ParsedUrlQuery;
    preview?: boolean;
    previewData?: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

export interface LTWH {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface PDFTranslation {
    x: number;
    y: number;
}
