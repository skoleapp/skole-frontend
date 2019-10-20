import { useApolloClient } from '@apollo/react-hooks';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../actions';
import { State } from '../../interfaces';
import { MenuListItem } from '../atoms';

export const MenuList = () => {
  const { authenticated, user } = useSelector((state: State) => state.auth);
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();

  const renderPrivateMenuItems = () => (
    <>
      <MenuListItem href={`/user/${user.id}`}>account</MenuListItem>
      <MenuListItem href="#" onClick={() => dispatch(logout(apolloClient))}>
        logout
      </MenuListItem>
    </>
  );

  const renderPublicMenuItems = () => (
    <>
      <MenuListItem href="/login">login</MenuListItem>
      <MenuListItem href="/register">register</MenuListItem>
    </>
  );

  return (
    <>
      <MenuListItem href="/">home</MenuListItem>
      {authenticated && user.id ? renderPrivateMenuItems() : renderPublicMenuItems()}
    </>
  );
};
