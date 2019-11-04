import { NextPage } from 'next';
import React from 'react';
import { Layout, NotFoundCard, UserListTable } from '../../components';
import { UserListDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withAuthSync } from '../../utils';

interface Props {
  users: PublicUser[] | null;
}

const UserListPage: NextPage<Props> = ({ users }) => (
  <Layout title="User List">
    {users ? <UserListTable users={users} /> : <NotFoundCard text="No users found..." />}
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

export default withAuthSync(UserListPage as NextPage);
