import React from 'react';
import styled from 'styled-components';

const StyledFooter = styled.div`
  position: absolute;
  bottom: 0;
  height: 10rem;
  width: 100%;
  background: var(--primary);
  margin-bottom: -10rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
`;

export const Footer: React.FC = () => (
  <StyledFooter>© {new Date().getFullYear()} Skole Ltd.</StyledFooter>
);
