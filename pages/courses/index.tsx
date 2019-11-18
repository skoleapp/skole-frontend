import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import { Formik, FormikActions } from 'formik';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React, { useRef } from 'react';
import { compose } from 'redux';
import { LabelTag, StyledTable } from '../../components';
import { FilterCoursesForm, Layout } from '../../containers';
import { CoursesSchoolsAndSubjectsDocument } from '../../generated/graphql';
import { Course, FilterCoursesFormValues, School, SkoleContext, Subject } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useAuthSync } from '../../utils';

interface Props {
  courses?: Course[];
  schools?: School[];
  subjects?: Subject[];
}

const CoursesPage: NextPage<Props> = ({ courses, schools, subjects }) => {
  const router = useRouter();
  const { query, pathname } = router;
  const { courseName, courseCode, subjectId, schoolId } = query;
  const ref = useRef<any>(); // eslint-disable-line @eslint/typescript-no-explicit-any

  // Pick non-empty values and reload the page with new query params.
  const handleSubmit = (
    values: FilterCoursesFormValues,
    actions: FormikActions<FilterCoursesFormValues>
  ) => {
    const isNotEmpty = (val: string) => val !== '';
    const query: any = R.pickBy(isNotEmpty, values); // eslint-disable-line @eslint/typescript-no-explicit-any
    router.push({ pathname, query });
    actions.setSubmitting(false);
  };

  // Wait for the router to clear the query params, then reset the form.
  const handleClearFilters = async () => {
    await router.push(pathname);
    ref.current.resetForm();
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

  return (
    <Layout heading="Courses" title="Courses" backUrl="/">
      <StyledTable>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">
                <Typography variant="h6">Filter Courses</Typography>
                <Formik
                  component={FilterCoursesForm}
                  onSubmit={handleSubmit}
                  initialValues={initialValues}
                  ref={ref}
                />
                <Button variant="outlined" color="primary" fullWidth onClick={handleClearFilters}>
                  clear filters
                </Button>
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
