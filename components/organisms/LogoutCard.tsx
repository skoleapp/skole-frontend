import Link from 'next/link';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { Button, Card, H2 } from '../atoms';
import { LoadingScreen } from '../layout';

export const LogoutCard: React.FC = () => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);
  // const dispatch = useDispatch();

  useEffect(() => {
    // authenticated && dispatch(logout());
  }, [authenticated]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Card>
      <H2>You have been logged out!</H2>
      <Link href="/login">
        <Button>log back in</Button>
      </Link>
    </Card>
  );
};
