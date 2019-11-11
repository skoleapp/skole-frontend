import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, StyledCard } from '../../../components';
import { Layout, NotFoundCard } from '../../../containers';
import { SchoolDocument } from '../../../generated/graphql';
import { School, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useSSRAuthSync } from '../../../utils';

interface Props {
  school: School | null;
}

const SchoolPage: NextPage<Props> = ({ school }) => {
  if (school) {
    const { id, name, schoolType, city, country } = school;

    return (
      <Layout title="School">
        <StyledCard>
          <Typography variant="h5">{name}</Typography>
          <div className="info-section">
            <Typography variant="body1">Type: {schoolType}</Typography>
            <Typography variant="body1">City: {city}</Typography>
            <Typography variant="body1">Country: {country}</Typography>
          </div>
          <ButtonLink href={`/schools/${id}/subjects`} variant="outlined" color="primary" fullWidth>
            subjects
          </ButtonLink>
          <ButtonLink href={`/schools/${id}/courses`} variant="outlined" color="primary" fullWidth>
            courses
          </ButtonLink>
        </StyledCard>
      </Layout>
    );
  } else {
    return (
      <Layout title="School not found">
        <NotFoundCard text="School not found..." />
      </Layout>
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
SchoolPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useSSRAuthSync(ctx);
  const { query, apolloClient } = ctx;

  try {
    const { id } = query;
    const { data } = await apolloClient.query({
      query: SchoolDocument,
      variables: { id }
    });

    return { school: data.school };
  } catch {
    return { school: null };
  }
};

export default compose(
  withRedux,
  withApollo
)(SchoolPage);
