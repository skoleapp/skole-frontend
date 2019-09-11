import Router from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { LoadingScreen } from '../layout';
import { Column } from './Column';
import { Row } from './Row';
import styled from 'styled-components';

const Centered = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

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
          <Centered>Redirecting you to login...</Centered>
        </Row>
      </Column>
    );
  }

  return <>{children}</>;
};
