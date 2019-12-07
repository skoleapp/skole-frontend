import { CardHeader, Divider, Typography } from '@material-ui/core';
import { NextPage } from 'next';
import React from 'react';
import { compose } from 'redux';
import {
  ButtonLink,
  Layout,
  NotFound,
  SlimCardContent,
  StyledCard,
  TextLink
} from '../../../components';
import { SchoolDocument } from '../../../generated/graphql';
import { School, SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

interface Props {
  school?: School;
}

const SchoolPage: NextPage<Props> = ({ school }) => {
  if (school) {
    const schoolName = school.name || 'N/A';
    const schoolType = school.schoolType || 'N/A';
    const schoolCity = school.city || 'N/A';
    const schoolCountry = school.country || 'N/A';

    return (
      <Layout heading={schoolName} title={schoolName} backUrl="/schools">
        <StyledCard>
          <CardHeader title={schoolName} />
          <Divider />
          <SlimCardContent>
            <Typography variant="body1">
              School Type:{' '}
              <TextLink href={{ pathname: '/schools', query: { schoolType } }} color="primary">
                {schoolType}
              </TextLink>
            </Typography>
            <Typography variant="body1">
              School City:{' '}
              <TextLink href={{ pathname: '/schools', query: { schoolCity } }} color="primary">
                {schoolCity}
              </TextLink>
            </Typography>
            <Typography variant="body1">
              School Country:{' '}
              <TextLink href={{ pathname: '/schools', query: { schoolCountry } }} color="primary">
                {schoolCountry}
              </TextLink>
            </Typography>
          </SlimCardContent>
          <Divider />
          <SlimCardContent>
            <ButtonLink
              href={{ pathname: '/subjects', query: { schoolId: school.id } }}
              variant="outlined"
              color="primary"
              fullWidth
            >
              subjects
            </ButtonLink>
            <ButtonLink
              href={{ pathname: '/courses', query: { schoolId: school.id } }}
              variant="outlined"
              color="primary"
              fullWidth
            >
              courses
            </ButtonLink>
          </SlimCardContent>
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
