import { Button, MenuItem, MenuList, Paper } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { Layout } from '../../containers';
import { withPrivate } from '../../utils';
import logout from '../logout';

const AccountPage: NextPage = () => {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const router = useRouter();

  return (
    <Layout title="Account">
      <StyledAccountMenu>
        <Paper>
          <MenuList>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/edit')}>
              Edit Profile
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/courses')}>
              My Courses
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/change-password')}>
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
    </Layout>
  );
};

const StyledAccountMenu = styled.div`
  max-width: 25rem;
  margin: 0 auto;

  button {
    margin-top: 1rem;
  }
`;

export default withPrivate(AccountPage);
