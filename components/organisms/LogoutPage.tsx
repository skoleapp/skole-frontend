import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { logout } from '../../redux';
import { Button, H3 } from '../atoms';
import { LoadingScreen } from '../layout';

export const LogoutPage: React.FC = () => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    authenticated && dispatch(logout());
  }, []);

  authenticated || (loading && <LoadingScreen loadingText="Logging out..." />);

  return (
    <>
      <H3>You are logged out!</H3>
      <Link href="/login">
        <Button>login again</Button>
      </Link>
    </>
  );
};
