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
  Layout,
  MobileFilters,
  StyledTable,
  StyledForm,
  SchoolField,
  FormSubmitSection
} from '../components';
import { FilterSubjectsDocument } from '../generated/graphql';
import { FilterSubjectsFormValues, School, SkoleContext, Subject } from '../interfaces';
import { withApollo, withRedux } from '../lib';
import { useAuthSync, useFilters, valNotEmpty } from '../utils';
import { withTranslation } from '../i18n';

const filterTitle = 'Filter Subjects';

interface Props {
  subjects?: Subject[];
  schools?: School[];
  t: (value: string) => any;
}

const SubjectsPage: NextPage<Props> = ({ subjects, schools, t }) => {
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const router = useRouter();
  const { query, pathname } = router;
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
    <Formik onSubmit={handleSubmit} initialValues={initialValues}>
      {props => (
        <StyledForm>
          <SchoolField {...props} t={t} />
          <FormSubmitSection submitButtonText={t('buttonApply')} {...props} />
        </StyledForm>
      )}
    </Formik>
  );

  return (
    <Layout t={t} heading={t('headingSubjects')} title={t('titleSubjects')} backUrl="/">
      <DesktopFilters title={filterTitle}>{renderFilterForm}</DesktopFilters>
      <StyledTable>
        <Table>
          <TableHead className="mobile-only">
            <TableRow>
              <TableCell>
                <FilterButton title={t('buttonFilter')} toggleFilters={toggleFilters} />
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
                  <Typography variant="subtitle1">{t('textNoSubjects')}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTable>
      <MobileFilters
        t={t}
        title={filterTitle}
        filtersOpen={filtersOpen}
        toggleFilters={toggleFilters}
      >
        {renderFilterForm}
      </MobileFilters>
    </Layout>
  );
};

SubjectsPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: FilterSubjectsDocument,
      variables: { ...query }
    });

    return { ...data, namespacesRequired: ['common'] };
  } catch {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(SubjectsPage);
