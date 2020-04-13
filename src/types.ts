import { ContainerProps, DrawerProps, TablePaginationProps } from '@material-ui/core';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient, { ApolloError, ApolloQueryResult } from 'apollo-client';
import { Formik, FormikActions } from 'formik';
import Maybe from 'graphql/tsutils/Maybe';
import { NextComponentType, NextPageContext } from 'next';
import { Extent } from 'ol/extent';
import { Group } from 'ol/layer';
import { MutableRefObject, SyntheticEvent } from 'react';

import { CommentObjectType, ErrorType } from '../generated/graphql';

export interface SkoleContext extends NextPageContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: ApolloQueryResult<{}>;
}

export type I18nPage<P = {}> = NextComponentType<
    SkoleContext,
    { namespacesRequired: string[] },
    P & { namespacesRequired: string[] }
>;

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
        href: string;
        as?: string;
    };
    disableSearch?: boolean;
    headerRight?: JSX.Element;
    headerLeft?: JSX.Element;
}

export interface LayoutProps {
    seoProps?: SEOProps;
    topNavbarProps?: TopNavbarProps;
    containerProps?: ContainerProps;
    disableBottomNavbar?: boolean;
    customBottomNavbar?: JSX.Element;
}

export interface CommentTarget {
    [key: string]: number;
}

export interface DiscussionBoxProps {
    topComment?: CommentObjectType | null;
    comments: CommentObjectType[];
    isThread?: boolean;
    target: CommentTarget;
    formKey: string;
}

export type MuiColor = 'inherit' | 'default' | 'primary' | 'secondary' | undefined;

export interface UseDrawer extends DrawerProps {
    handleOpen: (e: SyntheticEvent) => void;
    onClose: (e: SyntheticEvent) => void;
    renderHeader: JSX.Element;
}

export interface UseOptions {
    renderShareOption: JSX.Element;
    renderReportOption: JSX.Element;
    renderOptionsHeader: JSX.Element;
    drawerProps: Omit<UseDrawer, 'renderHeader'>;
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

export interface UseForm<T> {
    ref: MutableRefObject<Formik<T> | null>;
    handleMutationErrors: (err: MutationErrors) => void;
    onError: (err: ApolloError) => void;
    setSubmitting: (val: boolean) => void;
    resetForm: () => void;
    submitForm: () => Promise<void> | null;
    setFieldValue: (fieldName: string, val: string | File | File[] | null) => void;
    setFieldError: (fieldName: string, val: string) => void;
}

export interface UseFilters<T> extends UseForm<T> {
    submitButtonText: string;
    renderDesktopClearFiltersButton?: JSX.Element;
    handleSubmit: (filteredValues: T, actions: FormikActions<T>) => Promise<void>;
    handleClearFilters: (e: SyntheticEvent) => Promise<void>;
    drawerProps: UseDrawer;
}

export type CustomTablePaginationProps = Pick<
    TablePaginationProps,
    'page' | 'count' | 'rowsPerPage' | 'onChangePage' | 'onChangeRowsPerPage'
>;

export interface PDFPage {
    layer: Group;
    imageExtent: Extent;
}

export interface AttachmentViewer {
    attachment: string | null;
    toggleAttachmentViewer: (payload: string | null) => void;
}

export interface CommentThread {
    topComment: CommentObjectType | null;
    toggleCommentThread: (payload: CommentObjectType | null) => void;
}

export interface LanguageSelector {
    languageSelectorOpen: boolean;
    toggleLanguageSelector: (payload: boolean) => void;
}

export interface Notifications {
    notification: string | null;
    toggleNotification: (payload: string | null) => void;
}

export interface Settings {
    settingsOpen: boolean;
    toggleSettings: (payload: boolean) => void;
}

export interface PDFViewer {
    pages: PDFPage[];
    currentPage: number;
    effect: string;
    resetEffect: () => void;
    setCenter: () => void;
    prevPage: () => void;
    nextPage: () => void;
    setPages: (pages: PDFPage[]) => void;
    setCurrentPage: (currentPage: number) => void;
}
export interface DeviceInfo {
    isMobile: boolean | null;
    setMobile: (payload: boolean | null) => void;
}

export interface SkoleContextType {
    attachmentViewer: AttachmentViewer;
    commentThread: CommentThread;
    languageSelector: LanguageSelector;
    notifications: Notifications;
    settings: Settings;
    pdfViewer: PDFViewer;
    device: DeviceInfo;
}

export type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
