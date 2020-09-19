import { Box, Tab } from '@material-ui/core';
import {
    CourseTableBody,
    ErrorLayout,
    FrontendPaginatedTable,
    LoadingLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    ResourceTableBody,
    SettingsLayout,
    StyledSwipeableViews,
    StyledTabs,
} from 'components';
import {
    CourseObjectType,
    ResourceObjectType,
    ResourceTypeObjectType,
    useResourceTypesQuery,
    UserObjectType,
    useStarredQuery,
} from 'generated';
import { useFrontendPagination, useSwipeableTabs } from 'hooks';
import { includeDefaultNamespaces, useTranslation, withAuth } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { AuthProps } from 'types';

const StarredPage: NextPage<AuthProps> = ({ authLoading, authNetworkError }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const { data, loading, error } = useStarredQuery();
    const { data: resourceTypeData, loading: loadingResourceType, error: resourceTypeError } = useResourceTypesQuery();

    const userMe: UserObjectType = R.propOr(null, 'userMe', data);
    const starredCourses: CourseObjectType[] = R.propOr([], 'starredCourses', data);
    const starredResources: ResourceObjectType[] = R.propOr([], 'starredResources', data);
    const resourceTypes: ResourceTypeObjectType[] = R.propOr([], 'resourceTypes', resourceTypeData);

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
            renderTableBody={<ResourceTableBody resourceTypes={resourceTypes} resources={paginatedResources} />}
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

    const seoProps = {
        title: t('starred:title'),
        description: t('starred:description'),
    };

    const layoutProps = {
        seoProps,
        topNavbarProps: {
            header: t('starred:header'),
            dynamicBackUrl: true,
        },
        renderCardContent,
        desktopHeader: t('starred:header'),
        fullSize: true,
    };

    if (loading || authLoading || loadingResourceType) {
        return <LoadingLayout seoProps={seoProps} />;
    }

    if ((!!error && !!error.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!error) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    if ((!!resourceTypeError && !!resourceTypeError.networkError) || authNetworkError) {
        return <OfflineLayout seoProps={seoProps} />;
    } else if (!!resourceTypeError) {
        return <ErrorLayout seoProps={seoProps} />;
    }

    if (!!userMe) {
        return <SettingsLayout {...layoutProps} />;
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticProps: GetStaticProps = async () => ({
    props: {
        namespacesRequired: includeDefaultNamespaces(['starred']),
    },
});

export default withAuth(StarredPage);
