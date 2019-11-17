import { Typography } from '@material-ui/core';
import moment from 'moment';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, StyledCard } from '../../../components';
import { Layout, NotFoundCard } from '../../../containers';
import { CourseDocument } from '../../../generated/graphql';
import { Course, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useSSRAuthSync } from '../../../utils';

interface Props {
  course?: Course;
}

const CourseDetailPage: NextPage<Props> = ({ course }) => {
  if (course) {
    const { id, name, code, subject, school, creator, created, modified } = course;

    return (
      <Layout heading={`${code} ${name}`} title={`${code} ${name}`} backUrl="/courses">
        <StyledCard>
          <Typography variant="body1">Name: {name}</Typography>
          <Typography variant="body1">Code: {code}</Typography>
          <Typography variant="body1">Subject: {subject.name}</Typography>
          <Typography variant="body1">School: {school.name}</Typography>
          <Typography variant="body1">Creator: {creator.username}</Typography>
          <Typography variant="body1">Created: {moment(created).format('LL')}</Typography>
          <Typography variant="body1">Updated: {moment(modified).format('LL')}</Typography>
          <ButtonLink
            href={`/courses/${id}/resources`}
            variant="outlined"
            color="primary"
            fullWidth
          >
            resources
          </ButtonLink>
          <ButtonLink
            href={`/courses/${id}/discussion`}
            variant="outlined"
            color="primary"
            fullWidth
          >
            discussion
          </ButtonLink>
        </StyledCard>
      </Layout>
    );
  } else {
    return (
      <Layout title="Course not found" backUrl="/courses">
        <NotFoundCard text="Course not found..." />
      </Layout>
    );
  }
};

CourseDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  useSSRAuthSync(ctx);
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
