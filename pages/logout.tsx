import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { Anchor, Button, Card, H2, MainLayout } from '../components';
import { SkoleContext } from '../interfaces';
import { redirect, withAuthSync } from '../lib';

const LogoutPage: NextPage = () => (
  <MainLayout title="Login">
    <Card>
      <H2>You have been logged out!</H2>
      <Link href="/login">
        <Anchor>
          <Button>log back in</Button>
        </Anchor>
      </Link>
    </Card>
  </MainLayout>
);

LogoutPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  const { authenticated } = ctx.store.getState().auth;

  if (authenticated) {
    redirect(ctx, '/');
  }

  return {};
};

export default withAuthSync(LogoutPage);
