import Link from 'next/link';
import React from 'react';
import styled from 'styled-components';
import { Icon } from '../atoms/Icon';

const StyledHomeButton = styled.div``;

export const HomeButton: React.FC = () => (
  <Link href="/">
    <StyledHomeButton>
      <Icon iconName="home" variant="white" />
    </StyledHomeButton>
  </Link>
);
