import { ContainerProps, DrawerProps, TablePaginationProps } from '@material-ui/core';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient, { ApolloError } from 'apollo-client';
import { Formik, FormikActions } from 'formik';
import Maybe from 'graphql/tsutils/Maybe';
import { NextPageContext } from 'next';
import { Extent } from 'ol/extent';
import { Group } from 'ol/layer';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { MutableRefObject, SyntheticEvent } from 'react';
import { UrlObject } from 'url';

import { CommentObjectType, ErrorType, SchoolObjectType, UserObjectType } from '../generated/graphql';

export interface SkolePageContext extends NextPageContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: NormalizedCacheObject;
}

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

export interface DiscussionBoxProps {
    topComment?: CommentObjectType | null;
    comments: CommentObjectType[];
    isThread?: boolean;
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

export interface PDFPage {
    layer: Group;
    imageExtent: Extent;
}

export interface AuthContext {
    user: UserObjectType | null;
    setUser: (user: UserObjectType | null) => void;
}

export interface AttachmentViewerContext {
    attachment: string | null;
    toggleAttachmentViewer: (payload: string | null) => void;
}

export interface CommentThreadContext {
    topComment: CommentObjectType | null;
    toggleCommentThread: (payload: CommentObjectType | null) => void;
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
    pages: PDFPage[];
    currentPage: number;
    effect: string;
    setCenter: () => void;
    prevPage: () => void;
    nextPage: () => void;
    setPages: (pages: PDFPage[]) => void;
    setCurrentPage: (currentPage: number) => void;
}

export interface DiscussionBoxContext {
    comments: CommentObjectType[] | null;
    setComments: (comments: CommentObjectType[]) => void;
}

export interface SkoleContextType {
    auth: AuthContext;
    attachmentViewer: AttachmentViewerContext;
    commentThread: CommentThreadContext;
    commentModal: CommentModalContext;
    languageSelector: LanguageSelectorContext;
    notifications: NotificationsContext;
    settings: SettingsContext;
    pdfViewer: PDFViewerContext;
    isMobileGuess: boolean | null;
    discussionBox: DiscussionBoxContext;
}

export type MaxWidth = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;

interface CustomApolloClient extends ApolloClient<NormalizedCacheObject> {
    toJSON: () => void;
}

export interface ApolloContext extends NextPageContext {
    apolloClient: CustomApolloClient;
    apolloState: {};
}

export interface LTWH {
    left: number;
    top: number;
    width: number;
    height: number;
}

export interface WH {
    width: number;
    height: number;
}

export interface Scaled {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    width: number;
    height: number;
}

export interface Position {
    boundingRect: LTWH;
    rects: LTWH[];
    pageNumber: number;
}

export interface ScaledPosition {
    boundingRect: Scaled;
    rects: Scaled[];
    pageNumber: number;
    usePdfCoordinates?: boolean;
}

export interface HighlightContent {
    text?: string;
    image?: string;
}

export interface HighlightComment {
    text: string;
    emoji: string;
}

export interface Highlight {
    id: string;
    position: ScaledPosition;
    content: HighlightContent;
    comment: HighlightComment;
}

export type ViewportHighlight = Highlight & {
    position: Position;
};

export interface ViewPort {
    convertToPdfPoint: (x: number, y: number) => number[];
    convertToViewportRectangle: (pdfRectangle: number[]) => number[];
    width: number;
    height: number;
}

export interface PDFJSViewer {
    container: HTMLDivElement;
    viewer: HTMLDivElement;
    getPageView: (
        page: number,
    ) => {
        textLayer: { textLayerDiv: HTMLDivElement };
        viewport: ViewPort;
        div: HTMLDivElement;
        canvas: HTMLCanvasElement;
    };
    setDocument: (document: PDFDocumentProxy) => Promise<void>;
    scrollPageIntoView: (options: { pageNumber: number; destArray: unknown[] }) => void;
    currentScaleValue: string;
}

export type PDFJSLinkService = {
    setDocument: (document: PDFDocumentProxy) => void;
    setViewer: (viewer: PDFJSViewer) => void;
};

export interface PDFJS {
    TextLayerBuilder: {
        prototype: {
            _bindMouse: () => void;
        };
    };
    PDFViewer: (options: Record<string, {}>) => PDFJSViewer;
    PDFLinkService: () => PDFJSLinkService;
    getDocument: (url: string) => Promise<PDFDocumentProxy>;
    disableWorker: boolean;
}
