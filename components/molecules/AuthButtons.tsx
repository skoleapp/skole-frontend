import { Button } from '@material-ui/core';
import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';

export const AuthButtons: React.FC = () => (
  <StyledPublicAuthButtons className="public-auth-buttons">
    <Link href="/login">
      <Button color="inherit">Login</Button>
    </Link>
    <Link href="/register">
      <Button color="inherit">Register</Button>
    </Link>
  </StyledPublicAuthButtons>
);

const StyledPublicAuthButtons = styled.div`
  button {
    margin-left: 1rem;
  }
`;
