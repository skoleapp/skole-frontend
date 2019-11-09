import { Paper, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { compose } from 'redux';
import { StyledTable } from '../../components';
import { Layout, NotFoundCard } from '../../containers';
import { SchoolsDocument } from '../../generated/graphql';
import { School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useSSRAuthSync } from '../../utils';

interface Props {
  schools: School[] | null;
}

const SchoolListPage: NextPage<Props> = ({ schools }) => {
  if (schools) {
    return (
      <Layout title="School List">
        <Paper>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>Schools</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.map((school: School, i: number) => (
                <Link href={`/school/${school.id}`} key={i}>
                  <TableRow>
                    <TableCell className="main-cell">
                      <Typography variant="subtitle1">{school.name}</Typography>
                    </TableCell>
                  </TableRow>
                </Link>
              ))}
            </TableBody>
          </StyledTable>
        </Paper>
      </Layout>
    );
  } else {
    return (
      <Layout title="No schools found">
        <NotFoundCard text="No schools found..." />
      </Layout>
    );
  }
};

SchoolListPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: SchoolsDocument });
    const { schools } = data;
    return { schools };
  } catch (error) {
    return { schools: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(SchoolListPage as NextPage);
