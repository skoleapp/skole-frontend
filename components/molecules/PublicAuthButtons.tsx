import { Button } from '@material-ui/core';
import Router from 'next/router';
import React from 'react';
import styled from 'styled-components';

export const PublicAuthButtons: React.FC = () => (
  <StyledPublicAuthButtons className="public-auth-buttons">
    <Button color="inherit" onClick={(): Promise<boolean> => Router.push('/login')}>
      Login
    </Button>
    <Button color="inherit" onClick={(): Promise<boolean> => Router.push('/register')}>
      Register
    </Button>
  </StyledPublicAuthButtons>
);

const StyledPublicAuthButtons = styled.div`
  button {
    margin-left: 1rem;
  }
`;
