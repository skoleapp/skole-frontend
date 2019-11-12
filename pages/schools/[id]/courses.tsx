import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { compose } from 'redux';
import { LabelTag, StyledTable } from '../../../components';
import { CourseSelectFilter, Layout, NotFoundCard } from '../../../containers';
import { SchoolCoursesDocument } from '../../../generated/graphql';
import { Course, School, SkoleContext, Subject } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useSSRAuthSync } from '../../../utils';

interface Props {
  school?: School;
  subjects?: Subject[];
  courses?: Course[];
}

const CoursesPage: NextPage<Props> = ({ school, subjects, courses }) => {
  const router = useRouter();
  const { subjectId } = router.query;
  const subject = subjects && subjects.find((s: Subject) => s.id.toString() === subjectId);

  if (school && subjects && subjects.length) {
    const { name, id } = school;

    return (
      <Layout title={`Courses in ${name}`} backUrl={`/schools/${id}`}>
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">
                    {subject && subject.name ? (
                      <span>
                        {subject.name} Courses in {name}
                      </span>
                    ) : (
                      <span>All courses in {name}</span>
                    )}
                  </Typography>
                  <CourseSelectFilter
                    subjects={subjects}
                    initialValue={subject && subject.id}
                    id={id}
                  />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses && courses.length ? (
                courses.map((course: Course, i: number) => (
                  <Link href={`/course/${course.id}`} key={i}>
                    <TableRow>
                      <TableCell>
                        <Typography variant="subtitle1">{course.name}</Typography>
                        {course.code && <LabelTag text={course.code} />}
                        {subject && subject.name && <LabelTag text={subject.name} />}
                      </TableCell>
                    </TableRow>
                  </Link>
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
  } else {
    return (
      <Layout title="School not found" backUrl="/schools">
        <NotFoundCard text="School not found..." />;
      </Layout>
    );
  }
};

CoursesPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { id, subjectId } = query;

    const { data } = await apolloClient.query({
      query: SchoolCoursesDocument,
      variables: { id, subjectId }
    });
    const { school, subjects, courses } = data;
    return { school, subjects, courses };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(CoursesPage);
