import { NormalizedCacheObject } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import { NextComponentType, NextPageContext } from 'next';
import { Store } from 'redux';

import { UserObjectType } from '../generated/graphql';
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

export interface LayoutProps {
    title?: string;
    heading?: string;
    backUrl?: boolean;
    renderCardContent?: JSX.Element;
    renderAlert?: JSX.Element;
    renderDialog?: JSX.Element;
    disableSearch?: boolean;
}
