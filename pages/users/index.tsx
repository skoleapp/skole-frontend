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
import * as R from 'ramda';
import React from 'react';
import { Layout, StyledTable } from '../../components';
import { UsersDocument } from '../../generated/graphql';
import { SkoleContext, User } from '../../interfaces';
import { useAuthSync } from '../../utils';

interface Props {
  users?: User[];
}

const UsersPage: NextPage<Props> = ({ users }) => (
  <Layout heading="Users" title="Users" backUrl>
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
          {users && users.length ? (
            users.map((user: User, i: number) => (
              <Link href={{ pathname: `/users/${user.id}` }} key={i}>
                <TableRow>
                  <TableCell className="user-cell">
                    <Avatar src={process.env.BACKEND_URL + user.avatarThumbnail} />
                    <Typography variant="subtitle1">{user.username || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1">{R.propOr('N/A', 'points', user)}</Typography>
                  </TableCell>
                </TableRow>
              </Link>
            ))
          ) : (
            <TableRow>
              <TableCell className="user-cell">
                <Typography variant="subtitle1">No users found...</Typography>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTable>
  </Layout>
);

UsersPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: UsersDocument });
    return { ...data };
  } catch {
    return {};
  }
};

export default UsersPage;
