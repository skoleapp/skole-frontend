import { ContainerProps, DrawerProps } from '@material-ui/core';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient, { ApolloError, ApolloQueryResult } from 'apollo-client';
import { Formik, FormikActions } from 'formik';
import Maybe from 'graphql/tsutils/Maybe';
import { NextComponentType, NextPageContext } from 'next';
import { MutableRefObject } from 'react';
import { Store } from 'redux';

import { CommentObjectType, ErrorType, UserObjectType } from '../generated/graphql';
import { Auth, ResourceState, UI } from './reducers';

export interface SkoleContext extends NextPageContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    apolloState: ApolloQueryResult<{}>;
    reduxStore: Store;
    userMe: UserObjectType;
}

export type I18nPage<P = {}> = NextComponentType<
    SkoleContext,
    { namespacesRequired: string[] },
    P & { namespacesRequired: string[] }
>;

export interface I18nProps {
    namespacesRequired: string[];
}

export interface State {
    auth: Auth;
    ui: UI;
    resource: ResourceState;
}

export interface LayoutProps extends ContainerProps {
    title?: string;
    heading?: string;
    dynamicBackUrl?: boolean;
    staticBackUrl?: {
        href: string;
        as?: string;
    };
    renderCardContent?: JSX.Element;
    renderAlert?: JSX.Element;
    disableSearch?: boolean;
    headerRight?: JSX.Element;
    headerLeft?: JSX.Element;
    disableBottomNavbar?: boolean;
    customBottomNavbar?: JSX.Element;
}

export interface CommentTarget {
    [key: string]: number;
}

export interface DiscussionBoxProps {
    commentThread?: CommentObjectType | null;
    comments: CommentObjectType[];
    isThread?: boolean;
    target: CommentTarget;
    formKey: string;
}

export type MuiColor = 'inherit' | 'default' | 'primary' | 'secondary' | undefined;

export interface UseDrawer extends DrawerProps {
    handleOpen: () => void;
    onClose: () => void;
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
    handleClearFilters: () => Promise<void>;
    drawerProps: UseDrawer;
}
