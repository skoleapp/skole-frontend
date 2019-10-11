import { getInitialState } from 'graphql-hooks-ssr';
import Head from 'next/head';
import React from 'react';
import { initGraphQL } from './init-graphql';

export default (App: any) => {
  const GraphQLHooks = (props: any) => {
    const graphQLClient = initGraphQL(props.graphQLState);
    return <App {...props} graphQLClient={graphQLClient} />;
  };

  GraphQLHooks.displayName = 'GraphQLHooks(App)';
  GraphQLHooks.getInitialProps = async (ctx: any) => {
    const { Component, router } = ctx;

    let appProps = {};
    if (App.getInitialProps) {
      appProps = await App.getInitialProps(ctx);
    }

    // Run all GraphQL queries in the component tree
    // and extract the resulting data
    const graphQLClient = initGraphQL();
    let graphQLState = {};
    if (typeof window === 'undefined') {
      try {
        // Run all GraphQL queries
        graphQLState = await getInitialState({
          App: (
            <App
              {...appProps}
              Component={Component}
              router={router}
              graphQLClient={graphQLClient}
            />
          ),
          client: graphQLClient
        });
      } catch (error) {
        // Prevent GraphQL hooks client errors from crashing SSR.
        // Handle them in components via the state.error prop:
        // https://github.com/nearform/graphql-hooks#usequery
        console.error('Error while running `getInitialState`', error);
      }

      // getInitialState does not call componentWillUnmount
      // head side effect therefore need to be cleared manually
      Head.rewind();
    }

    return {
      ...appProps,
      graphQLState
    };
  };

  return GraphQLHooks;
};
