import React from 'react';
import styled from 'styled-components';
import { Column } from './Column';

const StyledContainer = styled.div`
  min-height: 100vh;
  margin-top: 6rem;
  margin-bottom: 1rem;
  text-align: center;
`;

export const Container: React.FC = ({ children }) => (
  <Column sm={8} md={6}>
    <StyledContainer>{children}</StyledContainer>
  </Column>
);
