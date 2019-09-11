import React from 'react';
import styled from 'styled-components';
import { Column } from './Column';

const StyledContainer = styled.div`
  height: 100vh;
`;

export const Container: React.FC = ({ children }) => (
  <Column sm={8} md={6}>
    <StyledContainer>{children}</StyledContainer>
  </Column>
);
