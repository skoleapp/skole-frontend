import styled, { FlexboxProps } from "styled-components";

export const Flexbox = styled.div<FlexboxProps>`
  display: flex;
  justify-content: ${props => props.justifyContent};
  align-items: ${props => props.alignItems};
  align-content: ${props => props.alignContent};
`;
