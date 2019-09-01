import styled from 'styled-components';

interface CenteredProps {
  width?: string;
  height?: string;
  position?: string;
}

export const Centered = styled.h1<CenteredProps>`
  position: ${(props): string | undefined => (props.position ? props.position : 'fixed')};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
