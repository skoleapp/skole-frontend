import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../../interfaces';
import { MenuListItem } from '../atoms';

export const MenuList = () => {
  const { authenticated, user } = useSelector((state: State) => state.auth);

  const allMenuItems = {
    home: {
      name: 'home',
      href: '/'
    },
    login: {
      name: 'login',
      href: '/login'
    },
    register: {
      name: 'register',
      href: '/register'
    },
    account: {
      name: 'account',
      href: `/user/${user && user.id}`
    },
    logout: {
      name: 'logout',
      href: '/logout'
    }
  };

  const { home, login, register, account, logout } = allMenuItems;
  const publicMenuItems = [home, login, register];
  const privateMenuItems = [home, account, logout];
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
