import {
  Avatar,
  Box,
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
import * as R from 'ramda';
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
import { CourseDetailDocument } from '../../../generated/graphql';
import { includeDefaultNamespaces, useTranslation } from '../../../i18n';
import { Course, I18nProps, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { getFullCourseName, useAuthSync } from '../../../utils';

interface Props extends I18nProps {
  course?: Course;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
  const { t } = useTranslation();

  if (course) {
    const { subject, school, creator } = course;
    const fullName = getFullCourseName(course);
    const courseCode = course.code || 'N/A';
    const subjectName = subject.name || 'N/A';
    const schoolName = school.name || 'N/A';
    const creatorName = creator.username || 'N/A';
    const created = moment(course.created).format('LL');
    const modified = moment(course.modified).format('LL');
    const points = R.propOr('N/A', 'points', course);
    const resourceCount = R.propOr('N/A', 'resourceCount', course);

    const renderGeneralCourseInfo = (
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
    );

    const renderCourseInfoList = (
      <SlimCardContent>
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
            <ListItemText>Resources: {resourceCount}</ListItemText>
          </ListItem>
        </StyledList>
      </SlimCardContent>
    );

    return (
      <Layout heading={fullName} title={fullName} backUrl>
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
    return <NotFound title={t('course:notFound')} />;
  }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { courseId } = query;
    const { data } = await apolloClient.query({
      query: CourseDetailDocument,
      variables: { courseId }
    });

    return { ...data, namespacesRequired: includeDefaultNamespaces(['course']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['course']) };
  }
};

export default compose(withApollo, withRedux)(CourseDetailPage);
