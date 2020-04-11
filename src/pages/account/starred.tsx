import { Box, Tab } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import { CourseObjectType, ResourceObjectType } from '../../../generated/graphql';
import {
    CourseTableBody,
    FrontendPaginatedTable,
    NotFoundBox,
    NotFoundLayout,
    ResourceTableBody,
    SettingsLayout,
    StyledTabs,
} from '../../components';
import { useTranslation } from '../../i18n';
import { includeDefaultNamespaces } from '../../i18n';
import { withApollo, withRedux } from '../../lib';
import { I18nPage, I18nProps } from '../../types';
import { useAuth, useFrontendPagination, useTabs, withAuthSync } from '../../utils';

const StarredPage: I18nPage = () => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();
    const { user } = useAuth();
    const starredCourses = R.propOr([], 'starredCourses', user) as CourseObjectType[];
    const starredResources = R.propOr([], 'starredResources', user) as ResourceObjectType[];
    const { paginatedItems: paginatedCourses, ...coursePaginationProps } = useFrontendPagination(starredCourses);
    const { paginatedItems: paginatedResources, ...resourcePaginationProps } = useFrontendPagination(starredResources);

    const commonTableHeadProps = { titleRight: t('common:points') };

    const courseTableHeadProps = {
        titleLeft: t('common:name'),
        ...commonTableHeadProps,
    };

    const resourceTableHeadProps = {
        titleLeft: t('common:title'),
        ...commonTableHeadProps,
    };

    if (!!user) {
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

        return (
            <SettingsLayout
                heading={t('starred:heading')}
                title={t('starred:title')}
                renderCardContent={renderCardContent}
                dynamicBackUrl
                fullSize
            />
        );
    } else {
        return <NotFoundLayout title={t('_error:notFound')} />;
    }
};

StarredPage.getInitialProps = (): I18nProps => ({ namespacesRequired: includeDefaultNamespaces(['starred']) });

export default compose(withAuthSync, withRedux, withApollo)(StarredPage);
