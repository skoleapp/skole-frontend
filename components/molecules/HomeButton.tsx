import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Icon } from '../atoms/Icon';

const StyledHomeButton = styled.div`
  height: 5rem;
  width: 5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 2rem;
  cursor: pointer;
`;

export const HomeButton: React.FC = () => (
  <Link href="/">
    <StyledHomeButton>
      <Icon iconName="home" variant="white" />
    </StyledHomeButton>
  </Link>
);
