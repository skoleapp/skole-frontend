import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { compose } from 'redux';
import { LabelTag, StyledTable } from '../../components';
import { Layout, NotFoundCard } from '../../containers';
import { SchoolsDocument } from '../../generated/graphql';
import { School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useSSRAuthSync } from '../../utils';

interface Props {
  schools: School[] | null;
}

const SchoolsPage: NextPage<Props> = ({ schools }) => {
  if (schools && schools.length) {
    return (
      <Layout title="Schools" backUrl="/">
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Schools</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schools.map((school: School, i: number) => (
                <Link href={{ pathname: `schools/${school.id}` }} key={i}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">{school.name}</Typography>
                      <LabelTag text={school.schoolType} />
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
      <Layout title="No schools found">
        <NotFoundCard text="No schools found..." />
      </Layout>
    );
  }
};

SchoolsPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);

  try {
    const { data } = await ctx.apolloClient.query({ query: SchoolsDocument });
    return { schools: data.schools };
  } catch (error) {
    return { schools: null };
  }
};

export default compose(withRedux, withApollo)(SchoolsPage);
