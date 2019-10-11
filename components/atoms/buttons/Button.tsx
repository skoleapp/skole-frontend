import styled from 'styled-components';

export const Button = styled.button`
  cursor: pointer;
  background var(--primary);
  border-radius: var(--border-radius);
  margin: 0.5rem;
  padding: 0.5rem;
  color: var(--secondary);
  width: 100%;
  max-width: 18.5rem;
  height: 2.75rem;
  font-size: 1.05rem;
  text-transform: uppercase;
  box-shadow: var(--box-shadow);
  border: var(--white-border);

  &:hover {
    transform: var(--scale);
    transition: var(--transition);
  }

  &:focus {
    outline: none;
  }

  &:disabled {
    opacity: 0.5;
    transform: none;
  }
`;
