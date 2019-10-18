import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';

export const getUserMe = async (apolloClient: ApolloClient<any>) => {
  try {
    const { data } = await apolloClient.query({
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

    return { userMe: data.userMe };
  } catch {
    return { userMe: null };
  }
};
