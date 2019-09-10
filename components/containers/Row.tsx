import React, { ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  className?: string;
}

const StyledRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Row: React.FC<Props> = ({ children }) => <StyledRow>{children}</StyledRow>;
