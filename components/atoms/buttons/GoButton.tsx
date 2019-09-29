import React from 'react';
import styled from 'styled-components';

const StyledGoButtonWrapper = styled.div``;

const StyledGoButton = styled.button`
  border: var(--primary-border);
  height: 2.83rem;
  width: 4rem;
  border-radius: 0 var(--border-radius) var(--border-radius) 0;
  background: var(--white);
  text-transform: uppercase;
  color: var(--primary);
  font-weight: bold;
  font-size: 1.3rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
  box-shadow: var(--box-shadow);

  &:hover,
  &:focus {
    background: var(--primary);
    color: var(--white);
    outline: none;
  }
`;

export const GoButton: React.FC = () => (
  <StyledGoButtonWrapper>
    <StyledGoButton type="submit">go</StyledGoButton>
  </StyledGoButtonWrapper>
);
