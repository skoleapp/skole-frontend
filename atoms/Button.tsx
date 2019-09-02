import styled from 'styled-components';
interface ButtonProps {
  width?: string;
  position?: string;
  size?: string;
}

export const Button = styled.button<ButtonProps>`
  cursor: pointer;
  font-size: ${(props): string | undefined => (props.size ? props.size : '1em')};
  border: 2px solid white;
  border-radius: 3px;
  margin: 7px;
  width: ${(props): string | undefined => props.width};
  position: ${(props): string | undefined => props.position};
`;
