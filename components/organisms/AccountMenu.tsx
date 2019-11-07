import { Button, MenuItem, MenuList, Paper } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../actions';

export const AccountMenu: React.FC = () => {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const router = useRouter();

  return (
    <StyledAccountMenu>
      <Paper>
        <MenuList>
          <MenuItem onClick={() => router.push('/account/profile')}>Profile</MenuItem>
          <MenuItem onClick={() => router.push('/account/edit')}>Edit Account</MenuItem>
          <MenuItem onClick={() => router.push('/account/courses')}>My Courses</MenuItem>
          <MenuItem onClick={() => router.push('/account/change-password')}>
            Change Password
          </MenuItem>
        </MenuList>
      </Paper>
      <Button
        fullWidth
        variant="outlined"
        color="primary"
        onClick={(): Promise<boolean> => dispatch(logout(apolloClient))}
      >
        Logout
      </Button>
    </StyledAccountMenu>
  );
};

const StyledAccountMenu = styled.div`
  max-width: 25rem;
  margin: 0 auto;

  button {
    margin-top: 1rem;
  }
`;
