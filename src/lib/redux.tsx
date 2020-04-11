import App from 'next/app';
import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Store } from 'redux';
import { AnyAction } from 'redux';
import { toggleMobile } from 'src/actions';

import { I18nPage, I18nProps, SkoleContext, State } from '../types';
import { initStore } from './store';

const isServer = typeof window === 'undefined';

let reduxStore: Store;

const getOrInitStore = (initialState?: State): Store => {
    // Always make a new store if server, otherwise state is shared between requests
    if (isServer) {
        return initStore(initialState);
    }

    // Create store if unavailable on the client and set it on the window object
    if (!reduxStore) {
        reduxStore = initStore(initialState);
    }

    return reduxStore;
};

interface ReduxProps extends I18nProps {
    initialReduxState: State;
    isMobile: boolean;
}

interface WithReduxProps extends Omit<I18nProps, 'namespacesRequired'> {
    initialReduxState: State;
}

export const withRedux = (PageComponent: I18nPage, { ssr = true } = {}): JSX.Element => {
    const WithRedux = ({ initialReduxState, ...props }: ReduxProps): JSX.Element => {
        const { isMobile } = props;

        const { ui } = initialReduxState;
        const newUi = { ...ui, isMobile };

        const modifiedReduxStore = initialReduxState;
        modifiedReduxStore['ui'] = newUi;

        const store = getOrInitStore(modifiedReduxStore);

        useEffect(() => {
            store.dispatch((toggleMobile(isMobile) as unknown) as AnyAction);
        }, [isMobile]);

        return (
            <Provider store={store}>
                <PageComponent {...props} />
            </Provider>
        );
    };

    if (process.env.NODE_ENV !== 'production') {
        const isAppHoc = PageComponent === ((App as unknown) as I18nPage) || PageComponent.prototype instanceof App;

        if (isAppHoc) {
            throw new Error('The withRedux HOC only works with PageComponents');
        }
    }

    if (process.env.NODE_ENV !== 'production') {
        const displayName = PageComponent.displayName || PageComponent.name || 'Component';
        WithRedux.displayName = `withRedux(${displayName})`;
    }

    if (ssr || PageComponent.getInitialProps) {
        WithRedux.getInitialProps = async (context: SkoleContext): Promise<WithReduxProps> => {
            const reduxStore = getOrInitStore();
            context.reduxStore = reduxStore;

            const pageProps =
                typeof PageComponent.getInitialProps === 'function' ? await PageComponent.getInitialProps(context) : {};

            return {
                ...pageProps,
                initialReduxState: reduxStore.getState(),
            };
        };
    }

    return (WithRedux as unknown) as JSX.Element;
};
