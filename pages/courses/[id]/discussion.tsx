import React from 'react';
import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { compose } from 'redux';
import { Layout, SlimCardContent, StyledCard } from '../../../components';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';

const CourseDiscussion: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout heading="Discussion" title="Discussion" backUrl={`/courses/${id}`}>
      <StyledCard>
        <CardHeader title="Discussion" />
        <SlimCardContent>Course discussion will be here...</SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

CourseDiscussion.getInitialProps = async (ctx: SkoleContext): Promise<{}> => {
  await useAuthSync(ctx);
  return {};
};

export default compose(withApollo, withRedux)(CourseDiscussion);
