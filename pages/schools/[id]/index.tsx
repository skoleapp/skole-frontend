import { Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, StyledCard } from '../../../components';
import { Layout, NotFoundCard } from '../../../containers';
import { SchoolDocument } from '../../../generated/graphql';
import { School, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

interface Props {
  school?: School;
}

const SchoolPage: NextPage<Props> = ({ school }) => {
  if (school) {
    const { id, name, schoolType, city, country } = school;

    return (
      <Layout heading={name} title={name} backUrl="/schools">
        <StyledCard>
          <Typography variant="body1">Name: {name}</Typography>
          <Typography variant="body1">Type: {schoolType}</Typography>
          <Typography variant="body1">City: {city}</Typography>
          <Typography variant="body1">Country: {country}</Typography>
          <ButtonLink
            href={{ pathname: '/subjects', query: { schoolId: id } }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            subjects
          </ButtonLink>
          <ButtonLink
            href={{ pathname: '/courses', query: { schoolId: id } }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            courses
          </ButtonLink>
        </StyledCard>
      </Layout>
    );
  } else {
    return (
      <Layout title="School not found" backUrl="/schools">
        <NotFoundCard text="School not found..." />
      </Layout>
    );
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
SchoolPage.getInitialProps = async (ctx: SkoleContext): Promise<Props> => {
  await useAuthSync(ctx);
  const { query, apolloClient } = ctx;

  try {
    const { data } = await apolloClient.query({
      query: SchoolDocument,
      variables: { schoolId: query.id }
    });

    return { ...data };
  } catch {
    return {};
  }
};

export default compose(withRedux, withApollo)(SchoolPage);
