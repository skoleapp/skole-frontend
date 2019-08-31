import React from 'react';
import { FlexBox, Header } from '../atoms';
import '../index.css';
import { Login } from '../organisms';
import { Layout } from '../organisms/Layout';
import { LandingPage } from '../templates';

const Index: React.SFC<{}> = () => (
  <Layout title="skole | ebin oppimisalusta">
    <>
      <Header>
        <FlexBox justifyContent="flex-end">
          <Login />
        </FlexBox>
      </Header>
      <LandingPage />
    </>
  </Layout>
);

export default Index;
