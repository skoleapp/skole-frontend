import styled, { TitleProps } from "styled-components";

export const Title = styled.h1<TitleProps>`
  font-family: ${props => (props.font ? props.font : "monospace")};
  font-size: ${props => (props.size ? props.size + "px" : "50px")};
  text-align: center;
`;
