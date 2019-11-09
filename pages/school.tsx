import {
  Button,
  Paper,
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
import { StyledTable } from '../components';
import { Layout, NotFoundCard } from '../containers';
import { SchoolsDocument } from '../generated/graphql';
import { School, SkoleContext } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useSSRAuthSync } from '../utils';

interface Props {
  schools: School[] | null;
}

const SchoolPage: NextPage<Props> = ({ schools }) => {
  if (schools && schools.length) {
    return (
      <Layout title="Schools">
        <Paper>
          <StyledTable>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Schools</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.map((school: School, i: number) => (
                <Link href={`/school/${school.id}`} key={i}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">{school.name}</Typography>
                      <Button variant="outlined" color="primary" className="school-type">
                        {school.schoolType}
                      </Button>
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

SchoolPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
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
)(SchoolPage as NextPage);
