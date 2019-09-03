import styled from 'styled-components';

interface HeaderProps {
  isLoggedIn?: boolean;
}

export const Header = styled.div<HeaderProps>`
  top: 0px;
  background-color: cadetblue;
  position: sticky;
  width: 100%;
  height: 50px;
  z-index: 999999;
`;
