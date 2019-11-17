import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import { StyledTable } from '../components';
import { FilterSubjectsForm, Layout } from '../containers';
import { SchoolsAndSubjectsDocument } from '../generated/graphql';
import { FilterSubjectsFormValues, School, SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useSSRAuthSync } from '../utils';

interface Props {
  schools?: School[];
  subjects?: Subject[];
}

const SubjectsPage: NextPage<Props> = ({ schools, subjects }) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { schoolId } = query;

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = (
    values: FilterSubjectsFormValues,
    actions: FormikActions<FilterSubjectsFormValues>
  ) => {
    const isNotEmpty = (val: string) => val !== '';
    const query: any = R.pickBy(isNotEmpty, values); // eslint-disable-line @eslint/typescript-no-explicit-any
    router.push({ pathname, query });
    actions.setSubmitting(false);
  };

  // Pre-load query params to the form.
  const initialValues = {
    schoolId: schoolId || '',
    schools: schools || []
  };

  return (
    <Layout heading="Subjects" title="Subjects" backUrl="/">
      <StyledTable>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Filter Subjects</Typography>
                <Formik
                  component={FilterSubjectsForm}
                  onSubmit={handleSubmit}
                  initialValues={initialValues}
                />
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
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: SchoolsAndSubjectsDocument,
      variables: { ...query }
    });

    const { schools, subjects } = data;
    return { schools, subjects };
  } catch (error) {
    return {};
  }
};

export default compose(withRedux, withApollo)(SubjectsPage);
