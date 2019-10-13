import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';

export const checkLoggedIn = async (apolloClient: ApolloClient<any>) => {
  try {
    const res = await apolloClient.query({
      query: gql`
        query {
          userMe {
            id
            username
            title
            bio
            points
            created
            email
            language
          }
        }
      `
    });

    return { loggedInUser: res.data };
  } catch (error) {
    return { loggedInUser: {} };
  }
};
