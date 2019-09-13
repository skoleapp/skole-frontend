import styled from 'styled-components';

export const Input = styled.input`
  border: 0.1rem solid var(--primary);
  border-radius: 0.75rem;
  margin: 0.5rem 0 0.5rem 0.5rem;
  text-align: center;
  height: 2.25rem;
  width: 12rem;
  font-size: 1.05rem;

  &:hover,
  &:focus {
    transform: var(--scale);
    transition: var(--transition);
  }
`;
