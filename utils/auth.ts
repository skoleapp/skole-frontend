import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import Router from 'next/router';

export const checkLoggedIn = async (apolloClient: ApolloClient<any>) => {
  console.log('test');

  try {
    const { data } = await apolloClient.query({
      query: gql`
        query userMe {
          node {
            id
            username
            language
          }
        }
      `
    });

    return { loggedInUser: data };
  } catch (error) {
    return { loggedInUser: {} };
  }
};

export const redirect = (context: any, target: string) => {
  if (context.res) {
    // server
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    // browser
    Router.replace(target);
  }
};
