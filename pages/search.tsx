import {
  Box,
  Button,
  CardContent,
  CardHeader,
  FormControl,
  InputLabel,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import { Field, Formik, FormikProps } from 'formik';
import { Select, TextField } from 'formik-material-ui';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import {
  FormSubmitSection,
  Layout,
  SlimCardContent,
  StyledCard,
  StyledForm,
  StyledTable
} from '../components';
import { SchoolType, SearchDocument } from '../generated/graphql';
import { includeDefaultNamespaces, Router, useTranslation } from '../i18n';
import {
  City,
  Country,
  Course,
  FilterSearchResultsFormValues,
  I18nPage,
  I18nProps,
  School,
  SkoleContext,
  Subject
} from '../interfaces';
import { withApollo, withRedux } from '../lib';
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
        label={t('search:courseName')}
        placeholder={t('search:courseName')}
        fullWidth
      />
      <Field
        name="courseCode"
        component={TextField}
        label={t('search:courseCode')}
        placeholder={t('search:courseCode')}
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>{t('search:school')}</InputLabel>
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
        <InputLabel>{t('search:subject')}</InputLabel>
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
        <InputLabel>{t('search:schoolType')}</InputLabel>
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
        <InputLabel>{t('search:country')}</InputLabel>
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
        <InputLabel>{t('search:city')}</InputLabel>
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
        <FormSubmitSection submitButtonText={t('search:applyFilters')} {...props} />
        <Button onClick={handleClearFilters} variant="outlined" color="primary" fullWidth>
          {t('search:clearFilters')}
        </Button>
      </SlimCardContent>
    </StyledForm>
  );

  return (
    <Layout title={t('search:title')} backUrl disableSearch>
      <Box marginBottom="0.5rem">
        <StyledCard>
          <CardHeader title={t('search:title')} />
          <CardContent>
            <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
              {renderForm}
            </Formik>
          </CardContent>
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

    return { ...data, namespacesRequired: includeDefaultNamespaces(['search']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['search']) };
  }
};

export default compose(withApollo, withRedux)(SearchPage);
