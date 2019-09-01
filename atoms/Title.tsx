import styled from 'styled-components';

interface TitleProps {
  font?: string;
  size?: number;
  position?: string;
  margin?: string;
}

export const Title = styled.h1<TitleProps>`
  font-family: ${(props): string => (props.font ? props.font : 'monospace')};
  font-size: ${(props): string => (props.size ? props.size + 'px' : '50px')};
  margin: ${(props): string => (props.margin ? props.margin : '')};

  text-align: center;
  position: ${(props): string | undefined => (props.position ? props.position : 'relative')};
`;
