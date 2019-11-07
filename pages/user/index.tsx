import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { updateUserMe } from '../../actions';
import { Layout, NotFoundCard, UserListTable } from '../../components';
import { UserListDocument, UserMeDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';

interface Props {
  users: PublicUser[] | null;
}

const UserListPage: NextPage<Props> = ({ users }) => (
  <Layout title="User List">
    {users ? <UserListTable users={users} /> : <NotFoundCard text="No users found..." />}
  </Layout>
);

UserListPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  const { apolloClient, reduxStore } = ctx;
  const res = await apolloClient.query({ query: UserMeDocument });
  const { userMe } = res.data;

  if (userMe) {
    await reduxStore.dispatch(updateUserMe(userMe));
  }

  try {
    const { data } = await apolloClient.query({ query: UserListDocument });
    return { users: data.userList };
  } catch (error) {
    return { users: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(UserListPage as NextPage);
