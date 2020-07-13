import { Box, Tab } from '@material-ui/core';
import {
    CourseTableBody,
    FrontendPaginatedTable,
    NotFoundBox,
    NotFoundLayout,
    ResourceTableBody,
    SettingsLayout,
    StyledSwipeableViews,
    StyledTabs,
} from 'components';
import { CourseObjectType, ResourceObjectType, StarredDocument, UserObjectType } from 'generated';
import { useFrontendPagination, useSwipeableTabs } from 'hooks';
import { includeDefaultNamespaces } from 'i18n';
import { useSSRApollo, withAuthSync, withSSRAuth, withUserAgent } from 'lib';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { I18nProps } from 'types';

interface Props extends I18nProps {
    userMe?: UserObjectType | null;
}

const StarredPage: NextPage<Props> = ({ userMe }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const starredCourses = R.propOr([], 'starredCourses', userMe) as CourseObjectType[];
    const starredResources = R.propOr([], 'starredResources', userMe) as ResourceObjectType[];
    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(starredCourses);
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(starredResources);
    const commonTableHeadProps = { titleRight: t('common:score') };

    const courseTableHeadProps = {
        titleLeft: t('common:name'),
        ...commonTableHeadProps,
    };

    const resourceTableHeadProps = {
        titleLeft: t('common:title'),
        ...commonTableHeadProps,
    };

    if (!!userMe) {
        const renderStarredCourses = !!starredCourses.length ? (
            <FrontendPaginatedTable
                tableHeadProps={courseTableHeadProps}
                paginationProps={coursePaginationProps}
                renderTableBody={<CourseTableBody courses={paginatedCourses} />}
            />
        ) : (
            <NotFoundBox text={t('starred:noCourses')} />
        );

        const renderStarredResources = !!starredResources.length ? (
            <FrontendPaginatedTable
                tableHeadProps={resourceTableHeadProps}
                paginationProps={resourcePaginationProps}
                renderTableBody={<ResourceTableBody resources={paginatedResources} />}
            />
        ) : (
            <NotFoundBox text={t('starred:noResources')} />
        );

        const renderCardContent = (
            <Box flexGrow="1" display="flex" flexDirection="column">
                <StyledTabs value={tabValue} onChange={handleTabChange}>
                    <Tab label={t('common:courses')} />
                    <Tab label={t('common:resources')} />
                </StyledTabs>
                <StyledSwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
                    <Box display="flex" flexGrow="1">
                        {renderStarredCourses}
                    </Box>
                    <Box display="flex" flexGrow="1">
                        {renderStarredResources}
                    </Box>
                </StyledSwipeableViews>
            </Box>
        );

        const layoutProps = {
            seoProps: {
                title: t('starred:title'),
                description: t('starred:description'),
            },
            topNavbarProps: {
                header: t('starred:header'),
                dynamicBackUrl: true,
            },
            renderCardContent,
            desktopHeader: t('starred:header'),
            fullSize: true,
        };

        return <SettingsLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

const wrappers = R.compose(withUserAgent, withSSRAuth);

export const getServerSideProps: GetServerSideProps = wrappers(async ctx => {
    const { apolloClient, initialApolloState } = useSSRApollo(ctx);
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['starred']) };

    try {
        const { data } = await apolloClient.query({ query: StarredDocument });
        return { props: { ...data, ...nameSpaces, initialApolloState } };
    } catch {
        return { props: { ...nameSpaces, initialApolloState } };
    }
});

export default withAuthSync(StarredPage);
