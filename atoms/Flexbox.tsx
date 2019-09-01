import styled from 'styled-components';

interface FlexBoxProps {
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  width?: string;
  height?: string;
  flexDirection?: string;
  position?: string;
  bottom?: string;
}

export const FlexBox = styled.div<FlexBoxProps>`
  display: flex;
  justify-content: ${(props): string | undefined => props.justifyContent};
  align-items: ${(props): string | undefined => props.alignItems};
  align-content: ${(props): string | undefined => props.alignContent};
  width: ${(props): string | undefined => props.width};
  height: ${(props): string | undefined => props.height};
  flex-direction: ${(props): string | undefined => props.flexDirection};
  position: ${(props): string | undefined => props.position};
  bottom: ${(props): string | undefined => props.bottom};
`;
