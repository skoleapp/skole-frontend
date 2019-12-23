import {
  Box,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography
} from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { CourseDetailDocument } from '../../../../../generated/graphql';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  StyledTable
} from '../../../../components';
import { includeDefaultNamespaces, Router } from '../../../../i18n';
import { Course, I18nPage, I18nProps, Resource, SkoleContext } from '../../../../interfaces';
import { withApollo, withRedux } from '../../../../lib';
import { getFullCourseName, useAuthSync } from '../../../../utils';

interface Props {
  course?: Course;
}

const ResourcesPage: I18nPage<Props> = ({ course }) => {
  const { t } = useTranslation();

  if (course) {
    const fullCourseName = getFullCourseName(course); // TODO: Add translations for course names.
    const resources = course.resources || [];

    return (
      <Layout
        heading={t('course-resources:heading')}
        title={t('course-resources:title', { fullCourseName })}
        backUrl
      >
        <Box marginBottom="0.5rem">
          <StyledCard>
            <CardHeader title={fullCourseName} subheader={t('course-resources:subHeader')} />
            <SlimCardContent>
              <ButtonLink
                href={{ pathname: '/upload-resource', query: { course: course.id || '' } }}
                variant="outlined"
                color="primary"
                fullWidth
              >
                {t('course-resources:buttonNewResource')}
              </ButtonLink>
            </SlimCardContent>
          </StyledCard>
        </Box>
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">{t('course-resources:tableHeadTitle')}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">{t('course-resources:tableHeadPoints')}</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources.length ? (
                resources.map((r: Resource, i: number) => (
                  <TableRow
                    key={i}
                    onClick={() => Router.push(`/courses/${course.id}/resources/${r.id}`)}
                  >
                    <TableCell>
                      <Typography variant="subtitle1">
                        {R.propOr(t('common:na'), 'title', r)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1">
                        {R.propOr(t('common:na'), 'points', r)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1">{t('course-resources:noResources')}</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTable>
      </Layout>
    );
  } else {
    return <NotFound title={t('course-resources:courseNotFound')} />;
  }
};

ResourcesPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { courseId } = query;
    const { data } = await apolloClient.query({
      query: CourseDetailDocument,
      variables: { courseId }
    });

    return { ...data, namespacesRequired: includeDefaultNamespaces(['course-resources']) };
  } catch {
    return { namespacesRequired: includeDefaultNamespaces(['course-resources']) };
  }
};

export default compose(withApollo, withRedux)(ResourcesPage);
