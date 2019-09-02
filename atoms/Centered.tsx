import styled from 'styled-components';

interface CenteredProps {
  width?: string;
  height?: string;
  position?: string;
  top?: string;
}

export const Centered = styled.div<CenteredProps>`
  position: ${(props): string | undefined => (props.position ? props.position : 'fixed')};
  top: ${(props): string | undefined => (props.top ? props.top : '50%')};
  left: 50%;
  height: ${(props): string | undefined => props.height};
  width: ${(props): string | undefined => props.width};
  transform: translate(-50%, -50%);
`;
