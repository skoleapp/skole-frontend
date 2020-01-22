import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextComponentType, NextPageContext } from 'next';
import { Store } from 'redux';

import { UserType } from '../generated/graphql';
import { Auth, Notification, Settings } from './reducers';

export interface SkoleContext extends NextPageContext {
    apolloClient: ApolloClient<NormalizedCacheObject>;
    reduxStore: Store;
    userMe: UserType;
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
    notification: Notification;
    settings: Settings;
}

export interface LayoutProps {
    title?: string;
    heading?: string;
    backUrl?: boolean;
    renderCardContent?: JSX.Element;
    renderAlert?: JSX.Element;
    renderDialog?: JSX.Element;
    disableSearch?: boolean;
}
