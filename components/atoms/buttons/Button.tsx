import styled from 'styled-components';

export const Button = styled.button`
  cursor: pointer;
  background var(--primary);
  border-radius: 0.75rem;
  margin: 2rem 0.5rem;
  padding: 0.5rem;
  color: var(--secondary);
  width: 18.35rem;
  height: 2.75rem;
  font-size: 1.05rem;
  text-transform: uppercase;
  box-shadow: var(--box-shadow);
  border: 0.1rem solid var(--white);
  &:focus {
    outline: none;
  }
`;
