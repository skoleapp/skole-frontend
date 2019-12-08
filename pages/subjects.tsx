import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import { Link } from '../i18n';
import { Router } from '../i18n';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import {
  DesktopFilters,
  FilterButton,
  FilterSubjectsForm,
  Layout,
  MobileFilters,
  StyledTable
} from '../components';
import { FilterSubjectsDocument } from '../generated/graphql';
import { FilterSubjectsFormValues, School, SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useFilters, valNotEmpty } from '../utils';

const filterTitle = 'Filter Subjects';

interface Props {
  subjects?: Subject[];
  schools?: School[];
}

const SubjectsPage: NextPage<Props> = ({ subjects, schools }) => {
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const useNextRouter = useRouter();
  const { query, pathname } = useNextRouter;
  const { schoolId } = query;

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = async (
    values: FilterSubjectsFormValues,
    actions: FormikActions<FilterSubjectsFormValues>
  ) => {
    const { schoolId } = values;
    const filteredValues = { schoolId };
    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, filteredValues);
    await Router.push({ pathname, query });
    actions.setSubmitting(false);
    setFiltersOpen(false);
  };

  // Pre-load query params to the form.
  const initialValues = {
    schoolId: schoolId || '',
    schools: schools || []
  };

  const renderFilterForm = (
    <Formik component={FilterSubjectsForm} onSubmit={handleSubmit} initialValues={initialValues} />
  );

  return (
    <Layout heading="Subjects" title="Subjects" backUrl="/">
      <DesktopFilters title={filterTitle}>{renderFilterForm}</DesktopFilters>
      <StyledTable>
        <Table>
          <TableHead className="mobile-only">
            <TableRow>
              <TableCell>
                <FilterButton toggleFilters={toggleFilters} />
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
      <MobileFilters title={filterTitle} filtersOpen={filtersOpen} toggleFilters={toggleFilters}>
        {renderFilterForm}
      </MobileFilters>
    </Layout>
  );
};

SubjectsPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: FilterSubjectsDocument,
      variables: { ...query }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(SubjectsPage);
