import {
  Avatar,
  Box,
  CardContent,
  CardHeader,
  Divider,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  Typography
} from '@material-ui/core';
import { CloudUploadOutlined, ScoreOutlined } from '@material-ui/icons';
import moment from 'moment';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { CourseDetailDocument } from '../../../generated/graphql';
import {
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  StyledList,
  StyledTable,
  TabPanel,
  TextLink
} from '../../components';
import { includeDefaultNamespaces, Router } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { Course, I18nPage, I18nProps, Resource, SkoleContext } from '../../types';
import { getFullCourseName, useAuthSync, useTabs } from '../../utils';

interface Props extends I18nProps {
  course?: Course;
}

const CourseDetailPage: I18nPage<Props> = ({ course }) => {
  const { t, i18n } = useTranslation();
  const { tabValue, handleTabChange } = useTabs();

  if (course) {
    const { subject, school, creator } = course;
    const fullName = getFullCourseName(course); // TODO: Add translations for course names.
    const courseCode = course.code || '-';
    const subjectName = subject.name || '-'; // TODO: Add translations for subject names.
    const schoolName = school.name || '-';
    const creatorName = creator.username || '-';
    moment.locale(i18n.language); // Set moment language.
    const created = moment(course.created).format('LL');
    const modified = moment(course.modified).format('LL');
    const points = R.propOr('-', 'points', course);
    const resourceCount = R.propOr('-', 'resourceCount', course);
    const resources = course.resources || [];

    const renderGeneralCourseInfo = (
      <SlimCardContent>
        <Box textAlign="left">
          <Typography variant="body1">
            {t('common:courseCode')}: {courseCode}
          </Typography>
          <Typography variant="body1">
            {t('common:subject')}:{' '}
            <TextLink
              href={{ pathname: '/search', query: { subjectId: subject.id || '' } }}
              color="primary"
            >
              {subjectName}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('common:school')}:{' '}
            <TextLink href={`/schools/${school.id}`} color="primary">
              {schoolName}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('common:creator')}:{' '}
            <TextLink href={`/users/${creator.id}`} color="primary">
              {creatorName}
            </TextLink>
          </Typography>
          <Typography variant="body1">
            {t('common:created')}: {created}
          </Typography>
          <Typography variant="body1">
            {t('common:modified')}: {modified}
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
            <ListItemText>
              {t('common:points')}: {points}
            </ListItemText>
          </ListItem>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <CloudUploadOutlined />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>
              {t('common:resources')}: {resourceCount}
            </ListItemText>
          </ListItem>
        </StyledList>
      </SlimCardContent>
    );

    const renderTabs = (
      <Tabs
        value={tabValue}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
      >
        <Tab label={t('common:resources')} />
        <Tab label={t('common:discussion')} />
      </Tabs>
    );

    const renderTabContent = (
      <>
        <TabPanel value={tabValue} index={0}>
          <StyledTable>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="h6">{t('common:title')}</Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">{t('common:points')}</Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resources.length ? (
                  resources.map((r: Resource, i: number) => (
                    <TableRow key={i} onClick={() => Router.push(`/resources/${r.id}`)}>
                      <TableCell>
                        <Typography variant="subtitle1">{R.propOr('-', 'title', r)}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="subtitle1">{R.propOr('-', 'points', r)}</Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>
                      <Typography variant="subtitle1">{t('course:noResources')}</Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </StyledTable>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <CardContent>Course discussion will show here...</CardContent>
        </TabPanel>
      </>
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
          {renderTabs}
          {renderTabContent}
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
