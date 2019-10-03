import React from 'react';
import { AccountPage, MainLayout, PrivatePage } from '../components';
import { useAccount } from '../components/hooks';
import { LoadingScreen } from '../components/layout';

const Account: React.FC = () => {
  const [user, loading] = useAccount();

  if (loading) {
    return <LoadingScreen loadingText="Loading account details..." />;
  }

  return (
    <MainLayout title="Account">
      <PrivatePage component={AccountPage} {...user} />
    </MainLayout>
  );
};

export default Account;
