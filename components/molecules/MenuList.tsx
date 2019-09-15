import React from 'react';
import menuItems from '../../static/menu-items.json';
import { MenuListItem } from '../atoms';

export const MenuList: React.FC = () => (
  <ul>
    {menuItems.map((m, i) => (
      <MenuListItem key={i} href={m.href}>
        {m.name}
      </MenuListItem>
    ))}
  </ul>
);
