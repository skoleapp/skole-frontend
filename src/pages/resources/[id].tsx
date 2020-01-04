import * as R from 'ramda';

import { CardContent, CardHeader, Divider, Tab, Tabs } from '@material-ui/core';
import { I18nPage, I18nProps, SkoleContext } from '../../types';
import { Layout, NotFound, StyledCard, TabPanel } from '../../components';
import { ResourceDetailDocument, ResourcePartType, ResourceType } from '../../../generated/graphql';
import { useAuthSync, useTabs } from '../../utils';
import { withApollo, withRedux } from '../../lib';

import React from 'react';
import { compose } from 'redux';
import { includeDefaultNamespaces } from '../../i18n';
import { useTranslation } from 'react-i18next';

interface Props extends I18nProps {
    resource?: ResourceType;
}

const ResourceDetailPage: I18nPage<Props> = ({ resource }) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();

    if (resource) {
        const resourceTitle = R.propOr('-', 'title', resource) as string;
        const resourceParts = R.propOr([], 'resourceParts', resource) as ResourcePartType[];

        return (
            <Layout title={resourceTitle} backUrl>
                <StyledCard>
                    <CardHeader title={resourceTitle} />
                    {/* <CardContent>
                        <Image src={process.env.BACKEND_URL + resource.file} />
                    </CardContent> */}
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
                        {resourceParts.map((r: ResourcePartType, i: number) => (
                            <Tab key={i} label={r.title} />
                        ))}
                    </Tabs>
                    <TabPanel value={tabValue} index={0}>
                        <CardContent>Here will be general discussion thread...</CardContent>
                    </TabPanel>
                    {resourceParts.map((r: ResourcePartType, i: number) => (
                        <TabPanel key={i} value={tabValue} index={i + 1}>
                            <CardContent>Here will be {r.title} discussion thread...</CardContent>
                        </TabPanel>
                    ))}
                </StyledCard>
            </Layout>
        );
    } else {
        return <NotFound title={t('resource:notFound')} />;
    }
};

ResourceDetailPage.getInitialProps = async (ctx: SkoleContext): Promise<I18nProps> => {
    await useAuthSync(ctx);
    const { query } = ctx;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['resource']) };

    try {
        const { data } = await ctx.apolloClient.query({
            query: ResourceDetailDocument,
            variables: query,
        });

        return { ...data, ...nameSpaces };
    } catch {
        return nameSpaces;
    }
};

export default compose(withApollo, withRedux)(ResourceDetailPage);
