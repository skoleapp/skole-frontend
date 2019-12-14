import React from 'react';
import { CardHeader } from '@material-ui/core';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { compose } from 'redux';
import { ButtonLink, Layout, SlimCardContent, StyledCard } from '../../../components';
import { SkoleContext } from '../../../interfaces';
import { withApollo, withRedux } from '../../../lib';
import { useAuthSync } from '../../../utils';
import { withTranslation } from '../../../i18n';

const ResourcesPage: NextPage = ({ t }: any) => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <Layout
      t={t}
      heading={t('headingResources')}
      title={t('titleResources')}
      backUrl={`/courses/${id}`}
    >
      <StyledCard>
        <CardHeader title={t('headerResources')} />
        <SlimCardContent>Here will be course resources...</SlimCardContent>
        <SlimCardContent>
          <ButtonLink
            href={{ pathname: '/upload-resource', query: { courseId: id } }}
            variant="outlined"
            color="primary"
            fullWidth
          >
            {t('buttonUploadResources')}
          </ButtonLink>
        </SlimCardContent>
      </StyledCard>
    </Layout>
  );
};

ResourcesPage.getInitialProps = async (ctx: SkoleContext): Promise<any> => {
  await useAuthSync(ctx);
  return { namespacesRequired: ['common'] };
};

export default compose(withRedux, withApollo, withTranslation('common'))(ResourcesPage);
