import React from 'react';
import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { compose } from 'redux';
import { ButtonLink, Layout, SlimCardContent, StyledCard } from '../../../components';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

const ResourcesPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout heading="Resources" title="Resources" backUrl={`/courses/${id}`}>
      <StyledCard>
        <CardHeader title="Resources" />
        <SlimCardContent>Here will be course resources...</SlimCardContent>
        <SlimCardContent>
          <ButtonLink
            href={{ pathname: '/upload-resource', query: { courseId: id } }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            upload resource
          </ButtonLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ResourcesPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ResourcesPage);
