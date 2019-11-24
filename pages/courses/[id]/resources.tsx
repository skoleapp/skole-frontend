import { CardContent, CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import React from 'react';
import { compose } from 'redux';
import { ButtonLink, Layout, StyledCard } from '../../../components';
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
        <CardContent>
          <ButtonLink
            href={{ pathname: '/upload-resource', query: { courseId: id } }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            upload resource
          </ButtonLink>
        </CardContent>
      </StyledCard>
    </Layout>
  );
};

ResourcesPage.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(ResourcesPage);
