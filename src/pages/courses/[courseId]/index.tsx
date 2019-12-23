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
import { CourseDetailDocument } from '../../../../generated/graphql';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  StyledList,
  TextLink
} from '../../../components';
import { includeDefaultNamespaces, useTranslation } from '../../../i18n';
import { Course, I18nProps, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { getFullCourseName, useAuthSync } from '../../../utils';

interface Props extends I18nProps {
  course?: Course;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
  const { t, i18n } = useTranslation();

  if (course) {
    const { subject, school, creator } = course;
    const fullName = getFullCourseName(course); // TODO: Add translations for course names.
    const courseCode = course.code || 'N/A';
    const subjectName = subject.name || 'N/A'; // TODO: Add translations for subject names.
    const schoolName = school.name || 'N/A';
    const creatorName = creator.username || 'N/A';
    moment.locale(i18n.language); // Set moment language.
    const created = moment(course.created).format('LL');
    const modified = moment(course.modified).format('LL');
    const points = R.propOr('N/A', 'points', course);
    const resourceCount = R.propOr('N/A', 'resourceCount', course);

    const renderGeneralCourseInfo = (
      <SlimCardContent>
        <Box textAlign="left">
          <Typography variant="body1">{t('course:courseCode', { courseCode })}</Typography>
          <Typography variant="body1">
            {t('course:subject')}:{' '}
            <TextLink
              href={{ pathname: '/courses', query: { subjectId: subject.id } }}
              color="primary"
            >
              {subjectName}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('course:school')}:{' '}
            <TextLink href={`/schools/${school.id}`} color="primary">
              {schoolName}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('course:creator')}:{' '}
            <TextLink href={`/users/${creator.id}`} color="primary">
              {creatorName}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('course:created')}: {created}
          </Typography>
          <Typography variant="body1">
            {t('course:modified')}: {modified}
          </Typography>
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
            <ListItemText>{t('course:points', { points })}</ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CloudUploadOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>{t('course:resourceCount', { resourceCount })}</ListItemText>
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
              {t('course:resources')}
            </ButtonLink>
            <ButtonLink
              href={`/courses/${course.id}/discussion`}
              variant="outlined"
              color="primary"
              fullWidth
            >
              {t('course:discussion')}
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
