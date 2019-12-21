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
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  StyledTable
} from '../../../components';
import { CourseDocument } from '../../../generated/graphql';
import { Course, Resource, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { getFullCourseName, useAuthSync } from '../../../utils';

interface Props {
  course?: Course;
}

const ResourcesPage: NextPage<Props> = ({ course }) => {
  const router = useRouter();

  if (course) {
    const fullCourseName = getFullCourseName(course);
    const resources = course.resources || [];

    return (
      <Layout heading="Resources" title={`${fullCourseName} | Resources`} backUrl>
        <Box marginBottom="0.5rem">
          <StyledCard>
            <CardHeader title={`${fullCourseName}`} subheader="Resources" />
            <SlimCardContent>
              <ButtonLink
                href={{ pathname: '/upload-resource', query: { course: course.id || '' } }}
                variant="outlined"
                color="primary"
                fullWidth
              >
                new resource
              </ButtonLink>
            </SlimCardContent>
          </StyledCard>
        </Box>
        <StyledTable>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="h6">Title</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="h6">Points</Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {resources && resources.length ? (
                resources.map((r: Resource, i: number) => (
                  <TableRow key={i} onClick={() => router.push(`/resources/${r.id}`)}>
                    <TableCell>
                      <Typography variant="subtitle1">{r.title || 'N/A'}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="subtitle1">{R.propOr('N/A', 'points', r)}</Typography>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle1">No resources...</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTable>
      </Layout>
    );
  } else {
    return <NotFound title="Course not found..." />;
  }
};

ResourcesPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
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

export default compose(withApollo, withRedux)(ResourcesPage);
