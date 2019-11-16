import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { compose } from 'redux';
import { StyledTable } from '../components';
import { Layout } from '../containers';
import { SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useSSRAuthSync } from '../utils';

interface Props {
  subjects?: Subject[];
}

const SubjectsPage: NextPage<Props> = ({ subjects }) => {
  const router = useRouter();
  const query = router;

  return (
    <Layout heading="Subjects" title="Subjects" backUrl="/">
      <StyledTable>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">Subjects</Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects && subjects.length ? (
              subjects.map((subject: Subject, i: number) => (
                <Link
                  href={{
                    pathname: '/courses',
                    query: { subjectId: subject.id, ...query }
                  }}
                  key={i}
                >
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">{subject.name}</Typography>
                    </TableCell>
                  </TableRow>
                </Link>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">No subjects...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTable>
    </Layout>
  );
};

SubjectsPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);
  // const { apolloClient, query } = ctx;

  try {
    // const { id } = query;
    // const { data } = await apolloClient.query({
    //   query: SchoolSubjectsDocument,
    //   variables: { id }
    // });

    // return { school: data.school };
    return { subjects: [] };
  } catch (error) {
    return {};
  }
};

export default compose(withRedux, withApollo)(SubjectsPage);
