import { NextPage } from 'next';
import React from 'react';
import { LandingPage, MainLayout } from '../components';
import { getUserMe, withApollo } from '../lib';
import { USER_ME } from '../redux';

const IndexPage: NextPage = () => (
  <MainLayout title="Home" secondary>
    <LandingPage />
  </MainLayout>
);

// eslint-disable-next-line
IndexPage.getInitialProps = async ({ apolloClient, store }: any): Promise<{}> => {
  const userMe = await getUserMe(apolloClient);

  if (userMe) {
    store.dispatch({ type: USER_ME, payload: userMe });
  }

  return {};
};

export default withApollo(IndexPage);
