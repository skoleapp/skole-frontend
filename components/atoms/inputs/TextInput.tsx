import styled from 'styled-components';

export const TextInput = styled.input`
  border: var(--white-border);
  border-radius: 0.75rem;
  margin: 0.5rem;
  text-align: center;
  height: 2.5rem;
  width: 18rem;
  font-size: 1.05rem;
  box-shadow: var(--box-shadow);

  &:hover,
  &:focus {
    outline: none;
  }
`;
