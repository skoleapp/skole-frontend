import { ContainerProps } from '@material-ui/core';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient, { ApolloQueryResult } from 'apollo-client';
import { NextComponentType, NextPageContext } from 'next';
import { Store } from 'redux';

import { CommentObjectType, UserObjectType } from '../generated/graphql';
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
    backUrl?: boolean;
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
export type Anchor = 'bottom' | 'left' | 'top' | 'right' | undefined;

interface OptionProps {
    className: string;
    anchor: Anchor;
    open: boolean;
    onClose: () => void;
}

export interface UseOptions {
    renderShareOption: JSX.Element;
    renderReportOption: JSX.Element;
    renderOptionsHeader: JSX.Element;
    openOptions: () => void;
    closeOptions: () => void;
    mobileDrawerProps: OptionProps;
    desktopDrawerProps: OptionProps;
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
