import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import React from 'react';
import { compose } from 'redux';
import { StyledTable } from '../../../components';
import { Layout, NotFoundCard } from '../../../containers';
import { SchoolSubjectsDocument } from '../../../generated/graphql';
import { School, SkoleContext, Subject } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useSSRAuthSync } from '../../../utils';

interface Props {
  school: School | null;
}

const SubjectsPage: NextPage<Props> = ({ school }) => {
  if (school) {
    const { id, name, subjects } = school;

    return (
      <Layout title={`Subjects in ${name}`}>
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Subjects in {name}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subjects && subjects.length ? (
                subjects.map((subject: Subject, i: number) => (
                  <Link
                    href={{ pathname: `/schools/${id}/courses`, query: { subjectId: subject.id } }}
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
  } else {
    return (
      <Layout title="School not found">
        <NotFoundCard text="School not found..." />
      </Layout>
    );
  }
};

SubjectsPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { id } = query;
    const { data } = await apolloClient.query({
      query: SchoolSubjectsDocument,
      variables: { id }
    });

    return { school: data.school };
  } catch (error) {
    return { school: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(SubjectsPage);
