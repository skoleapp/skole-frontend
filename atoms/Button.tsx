import styled, { ButtonProps } from 'styled-components';

export const Button = styled.button<ButtonProps>`
  font-size: 1em;
  border: 2px solid white;
  border-radius: 3px;
  margin: 7px;
  width: ${(props): string | undefined => props.width};
`;
