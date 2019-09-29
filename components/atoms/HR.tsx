import React from 'react';
import styled from 'styled-components';

const StyledHR = styled.hr`
  height: 1px;
  border-radius: 1rem;
  background: var(--black);
  margin: 0.5rem;
`;

export const HR: React.FC = () => <StyledHR />;
