import styled from 'styled-components';

export const Textarea = styled.textarea`
  width: 15rem;
  border: 0.1rem solid var(--primary);
  border-radius: 0.5rem;
  margin: 0.5rem;
  height: 5rem;
  font-size: 1.25rem;
  padding: 1rem;
  resize: none;

  &:hover,
  &:focus {
    transform: var(--scale);
    transition: var(--transition);
  }
`;
