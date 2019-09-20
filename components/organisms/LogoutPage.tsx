import Link from 'next/link';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { logout } from '../../redux';
import { Button, H3 } from '../atoms';
import { LoadingScreen } from '../layout';

export const LogoutPage: React.FC = () => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();

  if (loading) {
    return <LoadingScreen />;
  }

  if (authenticated) {
    return (
      <>
        <H3>Logout Here!</H3>
        <Button
          onClick={(): void => {
            dispatch(logout());
          }}
        >
          log out
        </Button>
      </>
    );
  }

  return (
    <>
      <H3>You have been logged out!</H3>
      <Link href="/login">
        <Button>log back in</Button>
      </Link>
    </>
  );
};
