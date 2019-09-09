import React from 'react';
import styled from 'styled-components';
import { Column } from './Column';
import { Row } from './Row';

const StyledFooter = styled.div`
  height: 8rem;
  background: var(--primary);
  text-align: center;
`;

export const Footer: React.FC = () => (
  <StyledFooter>
    <Column sm={8} md={6}>
      <Row>© {new Date().getFullYear()} Skole Ltd.</Row>
    </Column>
  </StyledFooter>
);
