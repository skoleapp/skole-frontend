import { NextPage } from 'next';
import React from 'react';
import { LandingPage, MainLayout } from '../components';
import { getUserMe, withApollo } from '../lib';
import { SET_USER } from '../redux';

const IndexPage: NextPage = () => (
  <MainLayout title="Home" secondary>
    <LandingPage />
  </MainLayout>
);

// eslint-disable-next-line
IndexPage.getInitialProps = async ({ apolloClient, store }: any): Promise<{}> => {
  const userMe = await getUserMe(apolloClient);

  if (userMe) {
    store.dispatch({ type: SET_USER, payload: userMe });
  }

  return {};
};

export default withApollo(IndexPage);
