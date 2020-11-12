import { Box, Tab, Tabs } from '@material-ui/core';
import {
    CourseTableBody,
    ErrorLayout,
    LoadingLayout,
    NotFoundBox,
    NotFoundLayout,
    OfflineLayout,
    PaginatedTable,
    ResourceTableBody,
    SettingsLayout,
} from 'components';
import { useAuthContext } from 'context';
import {
    CourseObjectType,
    ResourceObjectType,
    ResourceTypeObjectType,
    StarredQueryVariables,
    useStarredQuery,
} from 'generated';
import { withAuth } from 'hocs';
import { useLanguageHeaderContext, useSwipeableTabs } from 'hooks';
import { loadNamespaces, useTranslation } from 'lib';
import { GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import * as R from 'ramda';
import React from 'react';
import SwipeableViews from 'react-swipeable-views';

const StarredPage: NextPage = () => {
    const { t } = useTranslation();
    const { query } = useRouter();
    const { tabValue, handleTabChange, handleIndexChange } = useSwipeableTabs();
    const variables: StarredQueryVariables = R.pick(['page', 'pageSize'], query);
    const context = useLanguageHeaderContext();
    const { data, loading, error } = useStarredQuery({ variables, context });
    const { userMe } = useAuthContext();
    const courses: CourseObjectType[] = R.pathOr([], ['starredCourses', 'objects'], data);
    const resources: ResourceObjectType[] = R.pathOr([], ['starredResources', 'objects'], data);
    const courseCount = R.pathOr(0, ['starredCourses', 'count'], data);
    const resourceCount = R.pathOr(0, ['starredResources', 'count'], data);
    const resourceTypes: ResourceTypeObjectType[] = R.propOr([], 'resourceTypes', data);
    const commonTableHeadProps = { titleRight: t('common:score') };

    const courseTableHeadProps = {
        titleLeft: t('common:name'),
        ...commonTableHeadProps,
    };

    const resourceTableHeadProps = {
        titleLeft: t('common:title'),
        ...commonTableHeadProps,
    };

    const renderResourceTableBody = <ResourceTableBody resourceTypes={resourceTypes} resources={resources} />;
    const renderCourseTableBody = <CourseTableBody courses={courses} />;

    const renderStarredCourses = !!courses.length ? (
        <PaginatedTable
            tableHeadProps={courseTableHeadProps}
            renderTableBody={renderCourseTableBody}
            count={courseCount}
        />
    ) : (
        <NotFoundBox text={t('starred:noCourses')} />
    );

    const renderStarredResources = !!resources.length ? (
        <PaginatedTable
            tableHeadProps={resourceTableHeadProps}
            renderTableBody={renderResourceTableBody}
            count={resourceCount}
        />
    ) : (
        <NotFoundBox text={t('starred:noResources')} />
    );

    const renderTabs = (
        <Tabs value={tabValue} onChange={handleTabChange}>
            <Tab label={`${t('common:courses')} (${courseCount})`} />
            <Tab label={`${t('common:resources')} (${resourceCount})`} />
        </Tabs>
    );

    const renderSwipeableViews = (
        <Box flexGrow="1" position="relative" minHeight="30rem">
            <SwipeableViews index={tabValue} onChangeIndex={handleIndexChange}>
                {renderStarredCourses}
                {renderStarredResources}
            </SwipeableViews>
        </Box>
    );

    const layoutProps = {
        seoProps: {
            title: t('starred:title'),
            description: t('starred:description'),
        },
        header: t('starred:header'),
        disablePadding: true,
        topNavbarProps: {
            dynamicBackUrl: true,
        },
    };

    if (loading) {
        return <LoadingLayout />;
    }

    if (!!error && !!error.networkError) {
        return <OfflineLayout />;
    } else if (!!error) {
        return <ErrorLayout />;
    }

    if (!!userMe) {
        return (
            <SettingsLayout {...layoutProps}>
                {renderTabs}
                {renderSwipeableViews}
            </SettingsLayout>
        );
    } else {
        return <NotFoundLayout />;
    }
};

export const getStaticProps: GetStaticProps = async ({ locale }) => ({
    props: {
        _ns: await loadNamespaces(['starred'], locale),
    },
});

export default withAuth(StarredPage);
