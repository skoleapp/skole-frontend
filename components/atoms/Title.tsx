import styled from 'styled-components';

interface TitleProps {
  font?: string;
  size?: number;
  position?: string;
  margin?: string;
}

export const Title = styled.h1<TitleProps>`
  /* font-family: ${(props): string => (props.font ? props.font : 'Verdana')}; */
  font-size: ${(props): string => (props.size ? props.size + 'px' : '60px')};
  margin: ${(props): string => (props.margin ? props.margin : '20px 0px 20px 0px')};

  text-align: center;
  position: ${(props): string | undefined => (props.position ? props.position : 'relative')};
`;
