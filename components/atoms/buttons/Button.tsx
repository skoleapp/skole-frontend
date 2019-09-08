import styled from 'styled-components';

// interface Props extends React.HTMLProps<HTMLButtonElement> {
//   text: string;
// }

export const Button = styled.button`
  cursor: pointer;
  background var(--primary);
  border-radius: 0.25rem;
  margin: 0.5rem;
  padding: 0.5rem;
  color: var(--secondary);
  min-width: 5rem;
  font-size: 1rem;
  text-transform: uppercase;
`;

// export const Button: React.FC<Props> = ({ text }) => <StyledButton>{text}</StyledButton>;
