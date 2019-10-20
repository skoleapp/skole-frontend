import React from 'react';
import styled from 'styled-components';
import { Column } from './Column';

const StyledContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  text-align: center;
  margin: 1rem 0;
`;

export const Container: React.FC = ({ children }) => (
  <Column sm={10} md={8}>
    <StyledContainer>{children}</StyledContainer>
  </Column>
);
