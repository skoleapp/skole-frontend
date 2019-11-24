import { CardContent, CardHeader, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, Layout, NotFound, StyledCard } from '../../../components';
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
          <CardHeader title={name} />
          <CardContent>
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
          </CardContent>
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title="School not found..." />;
  }
};

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
