import styled from 'styled-components';

export const Input = styled.input`
  border: 0.1rem solid var(--white);
  border-radius: 0.75rem;
  margin: 1rem 0.5rem;
  text-align: center;
  height: 2.5rem;
  width: 18rem;
  font-size: 1.05rem;
  box-shadow: var(--box-shadow);

  &:hover,
  &:focus {
    transform: var(--scale);
    transition: var(--transition);
  }
`;
