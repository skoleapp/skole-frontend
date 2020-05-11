import { Box, Tab } from '@material-ui/core';
import { GetServerSideProps, NextPage } from 'next';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { CourseObjectType, ResourceObjectType, StarredDocument, UserObjectType } from '../../../generated/graphql';
import {
    CourseTableBody,
    FrontendPaginatedTable,
    NotFoundBox,
    NotFoundLayout,
    ResourceTableBody,
    SettingsLayout,
    StyledTabs,
} from '../../components';
import { includeDefaultNamespaces } from '../../i18n';
import { withApolloSSR, withAuthSync } from '../../lib';
import { I18nProps, SkolePageContext } from '../../types';
import { useFrontendPagination, useTabs } from '../../utils';

interface Props extends I18nProps {
    userMe?: UserObjectType | null;
}

const StarredPage: NextPage<Props> = ({ userMe }) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();
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
                {tabValue === 0 && (
                    <Box display="flex" flexGrow="1">
                        {renderStarredCourses}
                    </Box>
                )}
                {tabValue === 1 && (
                    <Box display="flex" flexGrow="1">
                        {renderStarredResources}
                    </Box>
                )}
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

export const getServerSideProps: GetServerSideProps = withApolloSSR(async ctx => {
    const { apolloClient } = ctx as SkolePageContext;
    const nameSpaces = { namespacesRequired: includeDefaultNamespaces(['starred']) };

    try {
        const { data } = await apolloClient.query({ query: StarredDocument });
        return { props: { ...data, ...nameSpaces } };
    } catch {
        return { props: { ...nameSpaces } };
    }
});

export default withAuthSync(StarredPage);
