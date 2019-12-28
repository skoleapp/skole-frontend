import { CardContent, CardHeader, Divider, Tab, Tabs } from '@material-ui/core';
import Image from 'material-ui-image';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { compose } from 'redux';
import { ResourceDetailDocument } from '../../../generated/graphql';
import { Layout, NotFound, StyledCard, TabPanel } from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps, Resource, ResourcePart, SkoleContext } from '../../types';
import { useAuthSync, useTabs } from '../../utils';

interface Props extends I18nProps {
  resource?: Resource;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
  const { tabValue, handleTabChange } = useTabs();
  const { t } = useTranslation();

  if (resource) {
    const resourceTitle = resource.title || t('resource:resourceNA');
    const resourceParts = resource.resourceParts || [];

    return (
      <Layout title={resourceTitle} backUrl>
        <StyledCard>
          <CardHeader title={resourceTitle} />
          <CardContent>
            <Image src={process.env.BACKEND_URL + resource.file} />
          </CardContent>
          <Divider />
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="on"
          >
            <Tab label="General" />
            {resourceParts.map((r: ResourcePart, i: number) => (
              <Tab key={i} label={r.title} />
            ))}
          </Tabs>
          <TabPanel value={tabValue} index={0}>
            <CardContent>Here will be general discussion thread...</CardContent>
          </TabPanel>
          {resourceParts.map((r: ResourcePart, i: number) => (
            <TabPanel key={i} value={tabValue} index={i + 1}>
              <CardContent>Here will be {r.title} discussion thread...</CardContent>
            </TabPanel>
          ))}
        </StyledCard>
      </Layout>
    );
  } else {
    return <NotFound title={t('resource:resourceNA')} />;
  }
};

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
  await useAuthSync(ctx);

  try {
    const { resourceId } = ctx.query;
    const { data } = await ctx.apolloClient.query({
      query: ResourceDetailDocument,
      variables: { resourceId }
    });

    return {
      ...data,
      namespacesRequired: includeDefaultNamespaces(['resource'])
    };
  } catch {
    return {
      namespacesRequired: includeDefaultNamespaces(['resource'])
    };
  }
};

export default compose(withApollo, withRedux)(ResourceDetailPage);
