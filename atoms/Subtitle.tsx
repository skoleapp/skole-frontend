import styled from 'styled-components';

interface SubtitleProps {
  font?: string;
  size?: number;
  position?: string;
  margin?: string;
  textAlign?: string;
}

export const Subtitle = styled.h1<SubtitleProps>`
  font-family: ${(props): string => (props.font ? props.font : 'Verdana')};
  font-size: ${(props): string => (props.size ? props.size + 'px' : '16px')};
  margin: ${(props): string => (props.margin ? props.margin : '0px')};
  text-align: ${(props): string => (props.textAlign ? props.textAlign : 'center')};
  position: ${(props): string | undefined => (props.position ? props.position : 'relative')};
`;
