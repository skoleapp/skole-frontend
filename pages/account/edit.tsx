import { NextPage } from 'next';
import React from 'react';
import { useSelector } from 'react-redux';
import { EditUserCard, Layout } from '../../components';
import { State } from '../../interfaces';
import { withPrivate } from '../../utils';

const EditAccountPage: NextPage = () => {
  const { user } = useSelector((state: State) => state.auth);

  return (
    <Layout title="Edit User">
      <EditUserCard user={user} />
    </Layout>
  );
};

export default withPrivate(EditAccountPage);
