import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { Layout, UserInfoCard } from '../../containers';
import { State } from '../../interfaces';
import { withPrivate } from '../../utils';

const ProfilePage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);

  return (
    <Layout title="Account">
      <UserInfoCard {...user} />
    </Layout>
  );
};

export default withPrivate(ProfilePage);
