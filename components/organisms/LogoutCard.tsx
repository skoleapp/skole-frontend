import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { logout } from '../../redux';
import { Card, H1 } from '../atoms';
import { LoadingScreen } from '../layout';

export const LogoutCard: React.FC = () => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logout());
  }, []);

  authenticated && loading && <LoadingScreen loadingText="Logging out..." />;

  return (
    <Card>
      <H1>You have been logged out!</H1>
    </Card>
  );
};
