import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { Formik } from 'formik';
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
  FilterCoursesForm,
  Layout,
  MobileFilters,
  StyledForm,
  StyledTable
} from '../../components';
import { FilterCoursesDocument } from '../../generated/graphql';
import { Course, FilterCoursesFormValues, School, SkoleContext, Subject } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { getFullCourseName, useAuthSync, useFilters, useForm, valNotEmpty } from '../../utils';
import { useRouter } from 'next/router';
import { withTranslation } from '../../i18n';

interface Props {
  courses?: Course[];
  schools?: School[];
  subjects?: Subject[];
}

const CoursesPage: NextPage<Props> = ({ courses, schools, subjects }) => {
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
                <StyledForm>
                  <FilterButton toggleFilters={toggleFilters} />
                  <ClearFiltersButton resetForm={resetForm} />
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
      query: FilterCoursesDocument,
      variables: { ...query }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo, withTranslation('common'))(CoursesPage);
