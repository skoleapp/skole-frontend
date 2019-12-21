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
import { NextPage } from 'next';
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
import {
  City,
  Country,
  Course,
  FilterSearchResultsFormValues,
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

const SearchPage: NextPage<Props> = ({
  courses,
  schools,
  subjects,
  schoolTypes,
  countries,
  cities
}) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { ref, setSubmitting, resetForm } = useForm();

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
    await router.push({ pathname, query });
    setSubmitting(false);
  };

  // Clear the query params and reset form.
  const handleClearFilters = async () => {
    await router.push(router.pathname);
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
        label="Course Name"
        placeholder="Course Name"
        fullWidth
      />
      <Field
        name="courseCode"
        component={TextField}
        label="Course Code"
        placeholder="Course Code"
        fullWidth
      />
      <FormControl fullWidth>
        <InputLabel>School</InputLabel>
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
        <InputLabel>Subject</InputLabel>
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
        <InputLabel>School Type</InputLabel>
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
        <InputLabel>Country</InputLabel>
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
        <InputLabel>City</InputLabel>
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
        <FormSubmitSection submitButtonText="apply filters" {...props} />
        <Button onClick={handleClearFilters} variant="outlined" color="primary" fullWidth>
          clear filters
        </Button>
      </SlimCardContent>
    </StyledForm>
  );

  return (
    <Layout title="Search" backUrl disableSearch>
      <Box marginBottom="0.5rem">
        <StyledCard>
          <CardHeader title="Courses" />
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
                <TableRow key={i} onClick={() => router.push(`/courses/${course.id}`)}>
                  <TableCell>
                    <Typography variant="subtitle1">{getFullCourseName(course)}</Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">No results...</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </StyledTable>
    </Layout>
  );
};

SearchPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: SearchDocument,
      variables: { ...query }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(SearchPage);
