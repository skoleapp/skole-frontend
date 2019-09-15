import React from 'react';
import styled from 'styled-components';

const StyledGoButton = styled.button`
  border: 0.1rem solid var(--primary);
  height: 2.87rem;
  width: 4rem;
  border-radius: 0 0.75rem 0.75rem 0;
  background: var(--white);
  text-transform: uppercase;
  color: var(--primary);
  font-weight: bold;
  font-size: 1.25rem;
  margin: 0.5rem 0.5rem 0.5rem 0;
  box-shadow: var(--box-shadow);

  &:hover,
  &:focus {
    transform: var(--scale);
    transition: var(--transition);
    background: var(--primary);
    color: var(--white);
  }
`;

export const GoButton: React.FC = () => <StyledGoButton>go</StyledGoButton>;
