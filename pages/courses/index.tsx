import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQueryInput } from 'querystring';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import {
  ClearFiltersButton,
  DesktopFilters,
  FilterButton,
  FilterCoursesForm,
  LabelTag,
  Layout,
  MobileFilters,
  StyledTable
} from '../../components';
import { CoursesSchoolsAndSubjectsDocument } from '../../generated/graphql';
import { Course, FilterCoursesFormValues, School, SkoleContext, Subject } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useAuthSync, useFilters, useForm, valNotEmpty } from '../../utils';

const filterTitle = 'Filter Courses';

interface Props {
  courses?: Course[];
  schools?: School[];
  subjects?: Subject[];
}

const CoursesPage: NextPage<Props> = ({ courses, schools, subjects }) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { courseName, courseCode, subjectId, schoolId } = query;
  const { filtersOpen, setFiltersOpen, toggleFilters } = useFilters();
  const { ref, resetForm } = useForm();

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = async (
    values: FilterCoursesFormValues,
    actions: FormikActions<FilterCoursesFormValues>
  ) => {
    const { courseName, courseCode, schoolId, subjectId } = values;
    const filteredValues = { courseName, courseCode, schoolId, subjectId };
    const query: ParsedUrlQueryInput = R.pickBy(valNotEmpty, filteredValues);
    router.push({ pathname, query });
    actions.setSubmitting(false);
    setFiltersOpen(false);
  };

  // Pre-load query params to the form.
  const initialValues = {
    courseName: courseName || '',
    courseCode: courseCode || '',
    subjectId: subjectId || '',
    schoolId: schoolId || '',
    subjects: subjects || [],
    schools: schools || []
  };

  const renderFilterForm = (
    <Formik
      component={FilterCoursesForm}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      ref={ref}
    />
  );

  return (
    <Layout heading="Courses" title="Courses" backUrl="/">
      <DesktopFilters title={filterTitle}>
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
            {courses && courses.length ? (
              courses.map((course: Course, i: number) => (
                <TableRow key={i} onClick={() => router.push(`/courses/${course.id}`)}>
                  <TableCell>
                    <Typography variant="subtitle1">{course.name}</Typography>
                    {course.code && <LabelTag text={course.code} />}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle1">No courses...</Typography>
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

CoursesPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: CoursesSchoolsAndSubjectsDocument,
      variables: { ...query }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(CoursesPage);
