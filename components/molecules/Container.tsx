import React from 'react';
import styled from 'styled-components';

const StyledContainer = styled.div`
  height: 100%;
`;

export const Container: React.FC = ({ children }) => <StyledContainer>{children}</StyledContainer>;
