import { useRouter } from 'next/router';
import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { privateMenuItems, publicMenuItems } from '../../static';
import { MenuListItem } from '../atoms';

export const MenuList: React.FC = () => {
  const router = useRouter();
  const { authenticated } = useSelector((state: State) => state.auth);
  const menuItems = authenticated ? privateMenuItems : publicMenuItems;
  const filteredMenuItems = menuItems.filter(m => m.href !== router.pathname);

  return (
    <>
      {filteredMenuItems.map((m, i) => (
        <MenuListItem key={i} href={m.href}>
          {m.name}
        </MenuListItem>
      ))}
    </>
  );
};
