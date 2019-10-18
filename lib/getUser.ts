import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';

export const getUser = async (id: number, apolloClient: ApolloClient<any>) => {
  try {
    const { data } = await apolloClient.query({
      variables: { id },
      query: gql`
        query User($id: ID!) {
          user(id: $id) {
            id
            username
            title
            bio
            points
            created
          }
        }
      `
    });

    return { user: data.user };
  } catch (error) {
    return { user: {} };
  }
};
