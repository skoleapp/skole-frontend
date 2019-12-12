import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik, Field } from 'formik';
import { NextPage } from 'next';
import { Router } from '../../i18n';

import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import {
  ClearFiltersButton,
  DesktopFilters,
  FilterButton,
  Layout,
  MobileFilters,
  StyledForm,
  StyledTable,
  SchoolField,
  SubjectField,
  FormSubmitSection
} from '../../components';
import { FilterCoursesDocument } from '../../generated/graphql';
import { Course, FilterCoursesFormValues, School, SkoleContext, Subject } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getFullCourseName, useAuthSync, useFilters, useForm, valNotEmpty } from '../../utils';
import { useRouter } from 'next/router';
import { withTranslation } from '../../i18n';
import { TextField } from 'formik-material-ui';

interface Props {
  courses?: Course[];
  schools?: School[];
  subjects?: Subject[];
  t: (value: string) => any;
}

const CoursesPage: NextPage<Props> = ({ courses, schools, subjects, t }) => {
  const router = useRouter();

  const { query, pathname } = router;
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const { ref, setSubmitting, resetForm } = useForm();

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = async (values: FilterCoursesFormValues): Promise<void> => {
    const { courseName, courseCode, schoolId, subjectId } = values;
    const filteredValues = { courseName, courseCode, schoolId, subjectId };
    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, filteredValues);
    await Router.push({ pathname, query });
    setSubmitting(false);
    setFiltersOpen(false);
  };

  // Pre-load query params to the form.
  const initialValues = {
    courseName: query.courseName || '',
    courseCode: query.courseCode || '',
    subjectId: query.subjectId || '',
    schoolId: query.schoolId || '',
    schools: schools || [],
    subjects: subjects || []
  };

  const filterTitle = 'Filter Courses';

  const renderFilterForm = (
    <Formik onSubmit={handleSubmit} initialValues={initialValues} ref={ref}>
      {props => (
        <StyledForm>
          <Field
            name="courseName"
            component={TextField}
            label={t('fieldCourseName')}
            placeholder={t('fieldCourseName')}
            fullWidth
          />
          <Field
            name="courseCode"
            component={TextField}
            label={t('fieldCourseCode')}
            placeholder={t('fieldCourseName')}
            fullWidth
          />
          <SchoolField {...props} />
          <SubjectField {...props} />
          <FormSubmitSection submitButtonText={t('buttonApplyFilters')} {...props} />
        </StyledForm>
      )}
    </Formik>
  );

  return (
    <Layout t={t} heading={'headerCourses'} title={t('titleCourses')} backUrl="/">
      <DesktopFilters title={filterTitle}>
        {renderFilterForm}
        <ClearFiltersButton title={t('buttonClearFilters')} resetForm={resetForm} />
      </DesktopFilters>
      <StyledTable>
        <Table>
          <TableHead className="mobile-only">
            <TableRow>
              <TableCell>
                <StyledForm>
                  <FilterButton toggleFilters={toggleFilters} />
                  <ClearFiltersButton title={t('buttonClearFilters')} resetForm={resetForm} />
                </StyledForm>
              </TableCell>
            </TableRow>
          </TableHead>
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
                  <Typography variant="subtitle1">{t('textNoCourses')}</Typography>
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

CoursesPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: FilterCoursesDocument,
      variables: { ...query }
    });

    return { ...data, namespacesRequired: ['common'] };
  } catch {
    return { namespacesRequired: ['common'] };
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(CoursesPage);
