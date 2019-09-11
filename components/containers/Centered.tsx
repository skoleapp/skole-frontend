import React from 'react';
import styled from 'styled-components';

const StyledCentered = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

export const Centered: React.FC = ({ children }) => <StyledCentered>{children}</StyledCentered>;
