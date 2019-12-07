import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography
} from '@material-ui/core';
import { CloudUploadOutlined, ScoreOutlined } from '@material-ui/icons';
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
  StyledList,
  TextLink
} from '../../../components';
import { CourseDocument } from '../../../generated/graphql';
import { Course, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { getFullCourseName, useAuthSync } from '../../../utils';

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
    const points = course.points;
    const resources = course.resources.length;

    const renderGeneralCourseInfo = (
      <CardContent>
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
      </CardContent>
    );

    const renderCourseInfoList = (
      <CardContent>
        <StyledList>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <ScoreOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>Points: {points}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CloudUploadOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>Resources: {resources}</ListItemText>
          </ListItem>
        </StyledList>
      </CardContent>
    );

    return (
      <Layout heading={fullName} title={fullName} backUrl="/courses">
        <StyledCard>
          <CardHeader title={fullName} />
          <Divider />
          <Box
            className="flex-flow"
            display="flex"
            justifyContent="space-around"
            alignItems="center"
          >
            {renderGeneralCourseInfo}
            {renderCourseInfoList}
          </Box>
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

export default compose(withApollo, withRedux)(CourseDetailPage);
