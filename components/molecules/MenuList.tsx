import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { privateMenuItems, publicMenuItems } from '../../static';
import { MenuListItem } from '../atoms';

export const MenuList: React.FC = () => {
  const { authenticated } = useSelector((state: State) => state.auth);
  const menuItems = authenticated ? privateMenuItems : publicMenuItems;

  return (
    <>
      {menuItems.map((m, i) => (
        <MenuListItem key={i} href={m.href}>
          {m.name}
        </MenuListItem>
      ))}
    </>
  );
};
