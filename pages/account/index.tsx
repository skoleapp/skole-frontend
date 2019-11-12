import { Button, MenuItem, MenuList, Paper } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { useApolloClient } from 'react-apollo';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { logout } from '../../actions';
import { Layout } from '../../containers';
import { breakpoints } from '../../styles';
import { withPrivate } from '../../utils';

const AccountPage: NextPage = () => {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();
  const router = useRouter();

  return (
    <Layout title="Account" backUrl="/">
      <StyledAccountMenu>
        <Paper>
          <MenuList>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/profile')}>
              Profile
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/activity')}>
              Activity
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/edit')}>
              Edit Profile
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/my-courses')}>
              My Courses
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/account/change-password')}>
              Change Password
            </MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/feedback')}>Feedback</MenuItem>
            <MenuItem onClick={(): Promise<boolean> => router.push('/about')}>About</MenuItem>
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
  margin: 0 auto;

  @media only screen and (min-width: ${breakpoints.SM}) {
    max-width: 25rem;
  }

  button {
    margin-top: 1rem;
  }
`;

export default withPrivate(AccountPage);
