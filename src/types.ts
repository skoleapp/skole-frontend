import { ContainerProps } from '@material-ui/core';
import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextComponentType, NextPageContext } from 'next';
import { Store } from 'redux';

import { CommentObjectType, UserObjectType } from '../generated/graphql';
import { Auth, UI } from './reducers';

export interface SkoleContext extends NextPageContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
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
}

export interface CommentTarget {
    [key: string]: number;
}

export interface DiscussionBoxProps {
    commentThread?: CommentObjectType | null;
    comments: CommentObjectType[];
    isThread?: boolean;
    target: CommentTarget;
}
