import React from 'react';
import styled from 'styled-components';
import menuItems from '../../static/menu-items.json';
import { MenuListItem } from '../atoms';

const StyledDesktopNavbar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

export const DesktopMenuItems: React.FC = () => (
  <StyledDesktopNavbar>
    {menuItems.map((m, i) => (
      <MenuListItem key={i} href={m.href}>
        {m.name}
      </MenuListItem>
    ))}
  </StyledDesktopNavbar>
);
