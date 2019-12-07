import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik } from 'formik';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { withTranslation } from '../../i18n';
import { compose } from 'redux';
import {
  ClearFiltersButton,
  DesktopFilters,
  FilterButton,
  FilterSchoolsForm,
  Layout,
  MobileFilters,
  StyledTable
} from '../../components';
import { FilterSchoolsDocument, SchoolType } from '../../generated/graphql';
import { FilterSchoolsFormValues, School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useAuthSync, useFilters, useForm, valNotEmpty } from '../../utils';

const filterTitle = 'Filter Schools';

interface Props {
  schools?: School[];
  schoolTypes?: SchoolType[];
}

const SchoolsPage: NextPage<Props> = ({ schools, schoolTypes, t }) => {
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const router = useRouter();
  const { query, pathname } = router;
  const { ref, setSubmitting, resetForm } = useForm();

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = async (values: FilterSchoolsFormValues) => {
    const { schoolType, schoolName, schoolCity, schoolCountry } = values;
    const filteredValues = { schoolType, schoolName, schoolCity, schoolCountry };
    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, filteredValues);
    await router.push({ pathname, query });
    setSubmitting(false);
    setFiltersOpen(false);
  };

  // Pre-load query params to the form.
  const initialValues = {
    schoolType: query.schoolType || '',
    schoolName: query.schoolName || '',
    schoolCity: query.schoolCity || '',
    schoolCountry: query.schoolCountry || '',
    schoolTypes: schoolTypes || []
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
                      <Typography variant="subtitle1">{school.name || 'N/A'}</Typography>
                    </TableCell>
                  </TableRow>
                </Link>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">{t('No schools...')}</Typography>
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
    const { data } = await apolloClient.query({
      query: FilterSchoolsDocument,
      variables: { ...query }
    });
    return { ...data, namespacesRequired: ['common'] };
  } catch (err) {
    return {};
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(SchoolsPage);
