import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { StyledCard } from '../../../components';
import { Layout, NotFoundCard } from '../../../containers';
import { SchoolDocument } from '../../../generated/graphql';
import { School, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useSSRAuthSync } from '../../../utils';

interface Props {
  school: School | null;
}

const SchoolDetailPage: NextPage<Props> = ({ school }) => {
  if (school) {
    return (
      <Layout title={school.name}>
        <StyledCard>
          <Typography variant="h5">{school.name}</Typography>
          <Typography variant="body1">Type: {school.schoolType}</Typography>
          <Typography variant="body1">Name: {school.name}</Typography>
          <Typography variant="body1">City: {school.city}</Typography>
          <Typography variant="body1">Country: {school.country}</Typography>
        </StyledCard>
      </Layout>
    );
  }

  return (
    <Layout title="School not found">
      <NotFoundCard text="School not found." />
    </Layout>
  );
};

SchoolDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);
  const { apolloClient, query } = ctx;

  try {
    const { id } = query;
    const { data } = await apolloClient.query({ query: SchoolDocument, variables: { id } });
    return { school: data.school };
  } catch (error) {
    return { school: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(SchoolDetailPage as NextPage);
