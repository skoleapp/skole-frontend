import styled from 'styled-components';

const StyledGoButton = styled.button`
  border: 0.1rem solid var(--primary);
  height: 2.52rem;
  border-radius: 0 0.5rem 0.5rem 0;
  background: var(--white);
  text-transform: uppercase;
  color: var(--primary);
  font-weight: bold;
  font-size: 1.25rem;
  margin: 0.5rem 0.5rem 0.5rem 0.1rem;

  &:hover,
  &:focus {
    transform: var(--scale);
    transition: var(--transition);
    background: var(--primary);
    color: var(--white);
  }
`;

export const GoButton = () => <StyledGoButton>go</StyledGoButton>;
