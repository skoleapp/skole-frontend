import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { Layout, NotFoundCard, UserListTable } from '../../components';
import { UserListDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withAuth } from '../../lib';

const noUsersText = 'No users found.';

interface Props {
  users: PublicUser[] | null;
}

const UserListPage: NextPage<Props> = ({ users }) => (
  <Layout title="User List">
    <Typography variant="h5">User List</Typography>
    {users ? <UserListTable users={users} /> : <NotFoundCard text={noUsersText} />}
  </Layout>
);

UserListPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  const { apolloClient } = ctx;

  try {
    const { data } = await apolloClient.query({ query: UserListDocument });
    return { users: data.userList };
  } catch (error) {
    return { users: null };
  }
};

export default withAuth(UserListPage as NextPage);
