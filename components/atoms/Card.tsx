import React from 'react';
import styled from 'styled-components';

export const StyledCard = styled.div`
  border-radius: var(--border-radius);
  background-color: var(--white);
  margin: 2rem 0.5rem;
  padding: 0.5rem;
  box-shadow: var(--box-shadow);
`;

export const Card: React.FC = ({ children }) => <StyledCard>{children}</StyledCard>;
