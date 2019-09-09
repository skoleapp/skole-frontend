import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  height: 100vh;
  padding-top: 7rem;
`;

export const Container: React.FC = ({ children }) => <StyledContainer>{children}</StyledContainer>;
