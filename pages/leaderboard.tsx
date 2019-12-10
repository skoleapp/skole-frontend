import React from 'react';
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
import { Link } from '../i18n';
import { compose } from 'redux';
import { Layout, StyledTable } from '../components';
import { LeaderboardDocument } from '../generated/graphql';
import { PublicUser, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { getAvatar, useAuthSync } from '../utils';
import { withTranslation } from '../i18n';

interface Props {
  leaderboard?: PublicUser[];
  t: (value: string) => any;
}

const LeaderboardPage: NextPage<Props> = ({ leaderboard, t }) => (
  <Layout t={t} heading="Leaderboard" title="Leaderboard" backUrl="/">
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
          {leaderboard && leaderboard.length ? (
            leaderboard.map((user: PublicUser, i: number) => (
              <Link href={{ pathname: `/users/${user.id}` }} key={i}>
                <TableRow>
                  <TableCell className="user-cell">
                    <Avatar src={getAvatar(user.avatar)} />
                    <Typography variant="subtitle1">{user.username || 'N/A'}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="subtitle1">{user.points || 0}</Typography>
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

LeaderboardPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: LeaderboardDocument });
    return { ...data, namespacesRequired: ['common'] };
  } catch {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(LeaderboardPage);
