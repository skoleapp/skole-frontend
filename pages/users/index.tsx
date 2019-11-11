import {
  Avatar,
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
import { StyledTable } from '../../components';
import { Layout, NotFoundCard } from '../../containers';
import { UsersDocument } from '../../generated/graphql';
import { PublicUser, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getAvatar, useSSRAuthSync } from '../../utils';

interface Props {
  users: PublicUser[] | null;
}

const UsersPage: NextPage<Props> = ({ users }) => {
  if (users) {
    return (
      <Layout title="Users">
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Users</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Points</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user: PublicUser, i: number) => (
                <Link href={{ pathname: `/users/${user.id}` }} key={i}>
                  <TableRow>
                    <TableCell className="user-cell">
                      <Avatar src={getAvatar(user.avatar)} />
                      <Typography variant="subtitle1">{user.username}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1">{user.points}</Typography>
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
            </TableBody>
          </Table>
        </StyledTable>
      </Layout>
    );
  } else {
    return (
      <Layout title="No users found">
        <NotFoundCard text="No users found..." />;
      </Layout>
    );
  }
};

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: UsersDocument });
    const { users } = data;
    return { users };
  } catch (error) {
    return { users: null };
  }
};

export default compose(withRedux, withApollo)(UsersPage);
