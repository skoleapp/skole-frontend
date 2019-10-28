import { Button, Typography } from '@material-ui/core';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';
import { Card } from '../atoms';

const StyledLogoutCard = styled(Card)`
  button {
    margin: 2rem 0;
  }
`;

export const LogoutCard: React.FC = () => (
  <StyledLogoutCard>
    <Typography variant="h5">You have been logged out!</Typography>
    <Button
      variant="contained"
      color="primary"
      onClick={(): Promise<boolean> => Router.push('/login')}
    >
      log back in
    </Button>
  </StyledLogoutCard>
);
