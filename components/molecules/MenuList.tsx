import styled from 'styled-components';
import { MenuListItem } from '../atoms';

const StyledMenuList = styled.ul``;

export const MenuList: React.FC = () => (
  <StyledMenuList>
    <MenuListItem href="/">home</MenuListItem>
    <MenuListItem href="/login">login</MenuListItem>
    <MenuListItem href="/register">register</MenuListItem>
    <MenuListItem href="/search-schools">search</MenuListItem>
    <MenuListItem href="/account">account</MenuListItem>
    <MenuListItem href="/edit-account">edit account</MenuListItem>
    <MenuListItem href="/feedback">feedback</MenuListItem>
  </StyledMenuList>
);
