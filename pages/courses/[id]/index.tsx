import { CardContent, CardHeader, Typography } from '@material-ui/core';
import moment from 'moment';
import { NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, Layout, NotFound, StyledCard } from '../../../components';
import { CourseDocument } from '../../../generated/graphql';
import { Course, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

interface Props {
  course?: Course;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
  if (course) {
    const codeName = `${course.code} ${course.name}`;
    const name: string = R.propOr('N/A', 'name', course); // Need to cast to string.
    const code = R.propOr('N/A', 'code', course);
    const subjectName = R.propOr('N/A', 'name', course.subject);
    const schoolName = R.propOr('N/A', 'name', course.school);
    const creatorName = R.propOr('N/A', 'username', course.creator);
    const created = moment(course.created).format('LL');
    const modified = moment(course.modified).format('LL');

    return (
      <Layout heading={codeName} title={codeName} backUrl="/courses">
        <StyledCard>
          <CardHeader title={name} />
          <CardContent>
            <Typography variant="body1">Code: {code}</Typography>
            <Typography variant="body1">Subject: {subjectName}</Typography>
            <Typography variant="body1">School: {schoolName}</Typography>
            <Typography variant="body1">Creator: {creatorName}</Typography>
            <Typography variant="body1">Created: {created}</Typography>
            <Typography variant="body1">Modified: {modified}</Typography>
          </CardContent>
          <CardContent>
            <ButtonLink
              href={`/courses/${course.id}/resources`}
              variant="outlined"
              color="primary"
              fullWidth
            >
              resources
            </ButtonLink>
            <ButtonLink
              href={`/courses/${course.id}/discussion`}
              variant="outlined"
              color="primary"
              fullWidth
            >
              discussion
            </ButtonLink>
          </CardContent>
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title="Course not found..." />;
  }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: CourseDocument,
      variables: { courseId: query.id }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withApollo, withRedux)(CourseDetailPage);
