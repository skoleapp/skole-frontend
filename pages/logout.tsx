import { Button } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { getUserMe } from '../actions';
import { Anchor, Card, H2, MainLayout } from '../components';
import { SkoleContext } from '../interfaces';
import { redirect, withApollo } from '../lib';

const LogoutPage: NextPage = () => (
  <MainLayout title="Login">
    <Card>
      <H2>You have been logged out!</H2>
      <Link href="/login">
        <Anchor>
          <Button variant="contained" color="primary">
            log back in
          </Button>
        </Anchor>
      </Link>
    </Card>
  </MainLayout>
);

LogoutPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  const { userMe } = await getUserMe(ctx.apolloClient);

  if (userMe) {
    redirect(ctx, '/');
  }

  return {};
};

export default withApollo(LogoutPage);
