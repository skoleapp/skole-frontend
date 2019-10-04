import styled from 'styled-components';

export const TextInput = styled.input`
  border: var(--white-border);
  border-radius: var(--border-radius);
  margin: 0.5rem;
  text-align: center;
  height: 2.25rem;
  width: 100%;
  max-width: 18rem;
  font-size: 1.05rem;
  box-shadow: var(--box-shadow);

  &:hover,
  &:focus {
    outline: none;
  }
`;
