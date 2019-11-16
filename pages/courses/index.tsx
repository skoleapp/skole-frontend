import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { compose } from 'redux';
import { LabelTag, StyledTable } from '../../components';
import { Layout, SubjectFilter } from '../../containers';
import { CoursesDocument } from '../../generated/graphql';
import { Course, School, SkoleContext, Subject } from '../../interfaces';
import { withApollo, withRedux } from '../../lib';
import { useSSRAuthSync } from '../../utils';

interface Props {
  courses?: Course[];
  school?: School;
  subjects?: Subject[];
}

const CoursesPage: NextPage<Props> = ({ courses, school, subjects }) => {
  const router = useRouter();
  const { subjectId } = router.query;
  const subject = subjects && subjects.find((s: Subject) => s.id.toString() === subjectId);

  const getTitle = () => {
    if (school) {
      if (subject) {
        return `${subject.name} Courses in ${school.name}`;
      } else {
        return `All courses in ${school.name}`;
      }
    } else {
      if (subject) {
        return `All ${subject.name} Courses`;
      } else {
        return 'All courses';
      }
    }
  };

  return (
    <Layout heading="Courses" title="Courses" backUrl="/">
      <StyledTable>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">{getTitle()}</Typography>
                <SubjectFilter subjects={subjects} initialValue={subjectId} />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {courses && courses.length ? (
              courses.map((course: Course, i: number) => (
                <TableRow key={i} onClick={() => router.push(`/course/${course.id}`)}>
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
  await useSSRAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { schoolId, subjectId } = query;

    const { data } = await apolloClient.query({
      query: CoursesDocument,
      variables: { schoolId, subjectId }
    });

    const { courses, school, subjects } = data;
    return { courses, school, subjects };
  } catch (err) {
    return {};
  }
};

export default compose(withRedux, withApollo)(CoursesPage);
