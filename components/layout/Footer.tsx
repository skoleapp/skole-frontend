import React from 'react';
import styled from 'styled-components';
import { Column } from '../containers';

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
  text-align: center;
`;

const StyledColumn = styled(Column)`
  justify-content: center;
  height: 100%;
`;

export const Footer: React.FC = () => (
  <StyledFooter>
    <StyledColumn sm={8} md={6}>
      © {new Date().getFullYear()} Skole Ltd.
    </StyledColumn>
  </StyledFooter>
);
