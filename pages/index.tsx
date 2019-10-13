import { NextPage } from 'next';
import React from 'react';
import { LandingPage, MainLayout } from '../components';
import { checkLoggedIn, withApollo } from '../lib';
import { USER_ME } from '../redux';

const IndexPage: NextPage = () => (
  <MainLayout title="Home" secondary>
    <LandingPage />
  </MainLayout>
);

// eslint-disable-next-line
IndexPage.getInitialProps = async ({ apolloClient, store }: any): Promise<{}> => {
  const { loggedInUser } = await checkLoggedIn(apolloClient);
  if (loggedInUser.userMe) {
    loggedInUser && store.dispatch({ type: USER_ME, payload: loggedInUser.userMe });
  }

  return {};
};

export default withApollo(IndexPage);
