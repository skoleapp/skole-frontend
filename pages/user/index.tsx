import {
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { compose } from 'redux';
import styled from 'styled-components';
import { updateUserMe } from '../../actions';
import { Layout, NotFoundCard } from '../../containers';
import { UserListDocument, UserMeDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getAvatar } from '../../utils';

interface Props {
  users: PublicUser[] | null;
}

const UserListPage: NextPage<Props> = ({ users }) => (
  <Layout title="User List">
    {users ? (
      <StyledUserList>
        <Paper>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Users</TableCell>
                <TableCell align="right">Points</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: PublicUser, i: number) => (
                <Link href={`/user/${user.id}`} key={i}>
                  <TableRow>
                    <TableCell className="main-cell">
                      <Avatar src={getAvatar(user.avatar)} />
                      <Typography variant="subtitle1">{user.username}</Typography>
                    </TableCell>
                    <TableCell align="right">{user.points}</TableCell>
                  </TableRow>
                </Link>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </StyledUserList>
    ) : (
      <NotFoundCard text="No users found..." />
    )}
  </Layout>
);

UserListPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  const { apolloClient, reduxStore } = ctx;
  const res = await apolloClient.query({ query: UserMeDocument });
  const { userMe } = res.data;

  if (userMe) {
    await reduxStore.dispatch(updateUserMe(userMe));
  }

  try {
    const { data } = await apolloClient.query({ query: UserListDocument });
    return { users: data.userList };
  } catch (error) {
    return { users: null };
  }
};

const StyledUserList = styled.div`
  tr:hover {
    background-color: var(--light-opacity);
  }

  .main-cell {
    display: flex;
    align-items: center;

    h6 {
      margin-left: 1rem;
    }
  }
`;

export default compose(
  withRedux,
  withApollo
)(UserListPage as NextPage);
