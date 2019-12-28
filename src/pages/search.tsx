import { Box, Button, CardHeader, FormControl, InputLabel, MenuItem, Table, TableBody, TableCell, TableRow, Typography } from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { SchoolType, SearchDocument } from '../../generated/graphql';
import { FormSubmitSection, Layout, SlimCardContent, StyledCard, StyledForm, StyledTable } from '../components';
import { includeDefaultNamespaces, Router } from '../i18n';
import { withApollo, withRedux } from '../lib';
import { City, Country, Course, FilterSearchResultsFormValues, I18nPage, I18nProps, School, SkoleContext, Subject } from '../types';
import { getFullCourseName, useAuthSync, useForm, valNotEmpty } from '../utils';

interface Props {
  courses?: Course[];
  schools?: School[];
  subjects?: Subject[];
  schoolTypes?: SchoolType[];
  countries?: Country[];
  cities?: City[];
}

const SearchPage: I18nPage<Props> = ({
  courses,
  schools,
  subjects,
  schoolTypes,
  countries,
  cities
}) => {
  const { query, pathname } = useRouter();
  const { ref, setSubmitting, resetForm } = useForm();
  const { t } = useTranslation();

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = async (values: FilterSearchResultsFormValues): Promise<void> => {
    const {
      courseName,
      courseCode,
      schoolName,
      subjectName,
      schoolType,
      countryName,
      cityName
    } = values;

    const filteredValues = {
      courseName,
      courseCode,
      schoolName,
      subjectName,
      schoolType,
      countryName,
      cityName
    };

    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, filteredValues);
    await Router.push({ pathname, query });
    setSubmitting(false);
  };

  // Clear the query params and reset form.
  const handleClearFilters = async () => {
    await Router.push(pathname);
    resetForm();
  };

  const courseName = (query.courseName as string) || '';
  const courseCode = (query.courseCode as string) || '';
  const schoolName = (query.schoolName as string) || '';
  const subjectName = (query.subjectName as string) || '';
  const schoolType = (query.schoolType as string) || '';
  const countryName = (query.countryName as string) || '';
  const cityName = (query.cityName as string) || '';

  // Pre-load query params to the form.
  const initialValues = {
    courseName,
    courseCode,
    schoolName,
    subjectName,
    schoolType,
    countryName,
    cityName
  };

  const renderForm = (props: FormikProps<FilterSearchResultsFormValues>) => (
    <StyledForm>
      <Field
        name="courseName"
        component={TextField}
        label={t('forms:courseName')}
        placeholder={t('forms:courseName')}
        fullWidth
      />
      <Field
        name="courseCode"
        component={TextField}
        label={t('forms:courseCode')}
        placeholder={t('forms:courseCode')}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>{t('forms:school')}</InputLabel>
        <Field component={Select} name="schoolName" fullWidth>
          <MenuItem value="">---</MenuItem>
          {schools &&
            schools.map((s: School, i: number) => (
              <MenuItem key={i} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>{t('forms:subject')}</InputLabel>
        <Field component={Select} name="subjectName" fullWidth>
          <MenuItem value="">---</MenuItem>
          {subjects &&
            subjects.map((s: Subject, i: number) => (
              <MenuItem key={i} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>{t('forms:schoolType')}</InputLabel>
        <Field component={Select} name="schoolType" fullWidth>
          <MenuItem value="">---</MenuItem>
          {schoolTypes &&
            schoolTypes.map((s: SchoolType, i: number) => (
              <MenuItem key={i} value={s.name}>
                {s.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>{t('forms:country')}</InputLabel>
        <Field component={Select} name="countryName" fullWidth>
          <MenuItem value="">---</MenuItem>
          {countries &&
            countries.map((c: Country, i: number) => (
              <MenuItem key={i} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel>{t('forms:city')}</InputLabel>
        <Field component={Select} name="cityName" fullWidth>
          <MenuItem value="">---</MenuItem>
          {cities &&
            cities.map((c: City, i: number) => (
              <MenuItem key={i} value={c.name}>
                {c.name}
              </MenuItem>
            ))}
        </Field>
      </FormControl>
      <SlimCardContent>
        <FormSubmitSection submitButtonText={t('search:applyFiltersButton')} {...props} />
        <Button onClick={handleClearFilters} variant="outlined" color="primary" fullWidth>
          {t('search:clearFiltersButton')}
        </Button>
      </SlimCardContent>
    </StyledForm>
  );

  return (
    <Layout title={t('search:title')} backUrl disableSearch>
      <Box marginBottom="0.5rem">
        <StyledCard>
          <CardHeader title={t('search:title')} />
          <SlimCardContent>
            <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
              {renderForm}
            </Formik>
          </SlimCardContent>
        </StyledCard>
      </Box>
      <StyledTable>
        <Table>
          <TableBody>
            {courses && courses.length ? (
              courses.map((course: Course, i: number) => (
                <TableRow key={i} onClick={() => Router.push(`/courses/${course.id}`)}>
                  <TableCell>
                    <Typography variant="subtitle1">{getFullCourseName(course)}</Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">{t('search:noCourses')}</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTable>
    </Layout>
  );
};

SearchPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: SearchDocument,
      variables: { ...query }
    });

    return { ...data, namespacesRequired: includeDefaultNamespaces(['search', 'forms']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['search', 'forms']) };
  }
};

export default compose(withApollo, withRedux)(SearchPage);
