import { Box, CardHeader, Divider, Typography } from '@material-ui/core';
import moment from 'moment';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  TextLink
} from '../../../components';
import { CourseDocument } from '../../../generated/graphql';
import { Course, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { getFullCourseName, useAuthSync } from '../../../utils';
import { withTranslation } from '../../../i18n';

interface Props {
  course?: Course;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
  if (course) {
    const { subject, school, creator } = course;
    const fullName = getFullCourseName(course);
    const courseCode = course.code || 'N/A';
    const subjectName = subject.name || 'N/A';
    const schoolName = school.name || 'N/A';
    const creatorName = creator.username || 'N/A';
    const created = moment(course.created).format('LL');
    const modified = moment(course.modified).format('LL');

    return (
      <Layout heading={fullName} title={fullName} backUrl="/courses">
        <StyledCard>
          <CardHeader title={fullName} />
          <Divider />
          <SlimCardContent>
            <Box textAlign="left">
              <Typography variant="body1">Code: {courseCode}</Typography>
              <Typography variant="body1">
                Subject:{' '}
                <TextLink
                  href={{ pathname: '/courses', query: { subjectId: subject.id } }}
                  color="primary"
                >
                  {subjectName}
                </TextLink>
              </Typography>
              <Typography variant="body1">
                School:{' '}
                <TextLink href={`/schools/${school.id}`} color="primary">
                  {schoolName}
                </TextLink>
              </Typography>
              <Typography variant="body1">
                Creator:{' '}
                <TextLink href={`/users/${creator.id}`} color="primary">
                  {creatorName}
                </TextLink>
              </Typography>
              <Typography variant="body1">Created: {created}</Typography>
              <Typography variant="body1">Modified: {modified}</Typography>
            </Box>
          </SlimCardContent>
          <Divider />
          <SlimCardContent>
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
          </SlimCardContent>
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

export default compose(withRedux, withApollo, withTranslation('common'))(CourseDetailPage);
