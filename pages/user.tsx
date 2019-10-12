import gql from 'graphql-tag';
import { NextPage } from 'next';
import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';
import { useAccount } from '../components/hooks';
import { withApollo } from '../lib';

const USER_ME = gql`
  query {
    userMe {
      id
      username
      email
      title
      bio
      points
      language
    }
  }
`;

const USER = gql`
  query User($id: ID) {
    user(id: $id) {
      node {
        id
        username
        title
        bio
        points
        created
      }
    }
  }
`;

const UserPage: NextPage = () => (
  <MainLayout title="User">
    <PrivatePage component={AccountPage} />
  </MainLayout>
);

UserPage.getInitialProps = async ctx => {
  const data = await useAccount(ctx);
  return { data };
};

export default withApollo(UserPage);
