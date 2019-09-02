import styled from 'styled-components';

interface WrapperProps {
  width?: string;
  height?: string;
}
export const Wrapper = styled.div<WrapperProps>`
  width: ${(props): string | undefined => props.width};
  height: ${(props): string | undefined => props.height};
`;
