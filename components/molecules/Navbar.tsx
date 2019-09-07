import React from 'react';
import styled from 'styled-components';

const StyledNavbar = styled.div`
  min-width: 100%;
  height: 5rem;
  background: var(--primary);
`;

export const Navbar: React.FC = () => <StyledNavbar />;
