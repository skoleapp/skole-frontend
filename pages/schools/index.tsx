import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import {
  ClearFiltersButton,
  DesktopFilters,
  FilterButton,
  FilterSchoolsForm,
  LabelTag,
  Layout,
  MobileFilters,
  StyledTable
} from '../../components';
import { SchoolsDocument } from '../../generated/graphql';
import { FilterSchoolsFormValues, School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useAuthSync, useFilters, useForm, valNotEmpty } from '../../utils';

const filterTitle = 'Filter Schools';

interface Props {
  schools?: School[];
}

const SchoolsPage: NextPage<Props> = ({ schools }) => {
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const router = useRouter();
  const { query, pathname } = router;
  const { schoolType, schoolCity, schoolCountry, schoolName } = query;
  const { ref, resetForm } = useForm();

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = (
    values: FilterSchoolsFormValues,
    actions: FormikActions<FilterSchoolsFormValues>
  ) => {
    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, values);
    router.push({ pathname, query });
    actions.setSubmitting(false);
    setFiltersOpen(false);
  };

  // Pre-load query params to the form.
  const initialValues = {
    schoolType: schoolType || '',
    schoolName: schoolName || '',
    schoolCity: schoolCity || '',
    schoolCountry: schoolCountry || ''
  };

  const renderFilterForm = (
    <Formik
      component={FilterSchoolsForm}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      ref={ref}
    />
  );

  return (
    <Layout heading="Schools" title="Schools" backUrl="/">
      <DesktopFilters title="Filter Schools">
        {renderFilterForm}
        <ClearFiltersButton resetForm={resetForm} />
      </DesktopFilters>
      <StyledTable>
        <Table>
          <TableHead className="mobile-only">
            <TableRow>
              <TableCell>
                <FilterButton toggleFilters={toggleFilters} />
                <ClearFiltersButton resetForm={resetForm} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {schools && schools.length ? (
              schools.map((school: School, i: number) => (
                <Link href={`/schools/${school.id}`} key={i}>
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">{school.name}</Typography>
                      <LabelTag text={school.schoolType} />
                    </TableCell>
                  </TableRow>
                </Link>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">No schools...</Typography>
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

SchoolsPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { query, apolloClient } = ctx;

  try {
    const { data } = await apolloClient.query({ query: SchoolsDocument, variables: { ...query } });
    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(SchoolsPage);
