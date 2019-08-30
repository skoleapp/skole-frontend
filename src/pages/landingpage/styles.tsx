import styled from "styled-components";

export const Wrapper = styled.div``;
export const Header = styled.div`
  top: 0px;
  background-color: gainsboro;
  position: sticky;
  width: 100%;
  height: 40px;
`;
export const Title = styled.h1<{ font: string }>`
  font-family: ${props => props.font};
  font-size: 50px;
  text-align: center;
`;
