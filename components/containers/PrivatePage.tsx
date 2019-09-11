import Router from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { LoadingScreen } from '../layout';
import { Column } from './Column';
import { Row } from './Row';
import { Centered } from './Centered';

export const PrivatePage: React.FC = ({ children }) => {
  const { authenticated, loading } = useSelector((state: State) => state.auth);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!authenticated) {
    setTimeout(() => Router.push('/login'), 2000);
    return (
      <Column md={8}>
        <Row>
          <Centered>
            <p>Redirecting you to login...</p>
            <LoadingScreen />
          </Centered>
        </Row>
      </Column>
    );
  }

  return <>{children}</>;
};
