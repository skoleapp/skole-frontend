import { IconButton, MenuItem } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import { AccountCircle } from '@material-ui/icons';
import Router from 'next/router';
import React, { useState } from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../actions';

export const AuthMenu: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    setAnchorEl(null);
  };

  const handleLogout = (): void => {
    handleClose();
    dispatch(logout(apolloClient));
  };

  return (
    <StyledAuthMenu className="auth-menu">
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={(): Promise<boolean> => Router.push('/account')}>Account</MenuItem>
        <MenuItem onClick={(): Promise<boolean> => Router.push('/account/courses')}>
          My Courses
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </StyledAuthMenu>
  );
};

const StyledAuthMenu = styled.div`
  margin-left: 1.5rem;
`;
