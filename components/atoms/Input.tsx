import styled from 'styled-components';

interface InputProps {
  fontSize?: string;
  width?: string;
  animation?: boolean;
}

export const Input = styled.input<InputProps>`
  color: black;
  font-size: ${(props): string | undefined => props.fontSize};
  width: ${(props): string | undefined => (props.width ? props.width : '160px')};
  border: 2px solid white;
  border-radius: 3px;
  margin: 7px;
  transition: all 0.2s;
  text-align: center;

  &:hover {
    transform: ${(props): string => (props.animation ? 'var(--scale)' : 'none')};
  }

  &:focus {
    transform: var(--scale);
  }
`;
