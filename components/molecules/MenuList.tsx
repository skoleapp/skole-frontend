import styled from 'styled-components';
import menuItems from '../../static/menu-items.json';
import { MenuListItem } from '../atoms';

const StyledMenuList = styled.ul``;

export const MenuList: React.FC = () => (
  <StyledMenuList>
    {menuItems.map((m, i) => (
      <MenuListItem key={i} href={m.href}>
        {m.name}
      </MenuListItem>
    ))}
  </StyledMenuList>
);
