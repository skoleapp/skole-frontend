import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  TextField
} from '@material-ui/core';
import { Formik, Field } from 'formik';
import { NextPage } from 'next';
import { Link } from '../../i18n';
import { Router } from '../../i18n';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import { compose } from 'redux';
import {
  ClearFiltersButton,
  DesktopFilters,
  FilterButton,
  Layout,
  MobileFilters,
  StyledTable,
  StyledForm,
  SchoolTypeField,
  FormSubmitSection
} from '../../components';
import { FilterSchoolsDocument, SchoolType } from '../../generated/graphql';
import { FilterSchoolsFormValues, School, SkoleContext } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useAuthSync, useFilters, useForm, valNotEmpty } from '../../utils';
import { withTranslation } from '../../i18n';

const filterTitle = 'Filter Schools';

interface Props {
  schools?: School[];
  schoolTypes?: SchoolType[];
  t: (value: string) => any;
}

const SchoolsPage: NextPage<Props> = ({ schools, schoolTypes, t }) => {
  const router = useRouter();
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const { query, pathname } = router;
  const { ref, setSubmitting, resetForm } = useForm(t);

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = async (values: FilterSchoolsFormValues) => {
    const { schoolType, schoolName, schoolCity, schoolCountry } = values;
    const filteredValues = { schoolType, schoolName, schoolCity, schoolCountry };
    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, filteredValues);
    await Router.push({ pathname, query });
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
    <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
      {props => (
        <StyledForm>
          <SchoolTypeField {...props} t={t} />
          <Field
            name="schoolName"
            component={TextField}
            label={t('fieldSchoolName')}
            placeholder={t('fieldSchoolName')}
            fullWidth
          />
          <Field
            name="schoolCity"
            label={t('fieldSchoolCity')}
            placeholder={t('fieldSchoolCity')}
            fullWidth
          />
          <Field
            name="schoolCountry"
            component={TextField}
            label={t('fieldSchoolCountry')}
            placeholder={t('fieldSchoolCountry')}
            fullWidth
          />
          <FormSubmitSection submitButtonText={t('buttonApplyFilters')} {...props} />
        </StyledForm>
      )}
    </Formik>
  );

  return (
    <Layout t={t} heading={t('headingSchools')} title={t('titleSchools')} backUrl="/">
      <DesktopFilters title={t('headerFilterSchools')}>
        {renderFilterForm}
        <ClearFiltersButton title={t('buttonClearFilters')} resetForm={resetForm} />
      </DesktopFilters>
      <StyledTable>
        <Table>
          <TableHead className="mobile-only">
            <TableRow>
              <TableCell>
                <FilterButton title={t('buttonFilter')} toggleFilters={toggleFilters} />
                <ClearFiltersButton title={t('buttonClearFilters')} resetForm={resetForm} />
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
                  <Typography variant="subtitle1">{t('textNoSchools')}</Typography>
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

SchoolsPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);
  const { query, apolloClient } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: FilterSchoolsDocument,
      variables: { ...query }
    });
    return { ...data, namespacesRequired: ['common'] };
  } catch (err) {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(SchoolsPage);
