import { Box, Tab, Table, TableContainer } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';
import { compose } from 'redux';

import { CourseObjectType, ResourceObjectType } from '../../../generated/graphql';
import {
    CourseTableBody,
    NotFound,
    ResourceTableBody,
    SettingsLayout,
    StyledTable,
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
    const commonPaginationProps = { titleRight: 'common:points' };

    const {
        renderTablePagination: renderStarredCoursesTablePagination,
        paginatedItems: paginatedCourses,
        renderNotFound: renderCoursesNotFound,
        renderTableHead: renderCoursesTableHead,
    } = useFrontendPagination({
        ...commonPaginationProps,
        items: starredCourses,
        notFoundText: 'starred:noCourses',
        titleLeft: 'common:name',
    });

    const {
        renderTablePagination: renderStarredResourcesTablePagination,
        paginatedItems: paginatedResources,
        renderNotFound: renderResourcesNotFound,
        renderTableHead: renderResourcesTableHead,
    } = useFrontendPagination({
        ...commonPaginationProps,
        items: starredResources,
        notFoundText: 'starred:noResources',
        titleLeft: 'common:title',
    });

    if (!!user) {
        const renderStarredCourses = !!starredCourses.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table stickyHeader>
                        {renderCoursesTableHead}
                        <CourseTableBody courses={paginatedCourses} />
                    </Table>
                </TableContainer>
                {renderStarredCoursesTablePagination}
            </StyledTable>
        ) : (
            renderCoursesNotFound
        );

        const renderStarredResources = !!starredResources.length ? (
            <StyledTable disableBoxShadow>
                <TableContainer>
                    <Table>
                        {renderResourcesTableHead}
                        <ResourceTableBody resources={paginatedResources} />
                    </Table>
                </TableContainer>
                {renderStarredResourcesTablePagination}
            </StyledTable>
        ) : (
            renderResourcesNotFound
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
        return <NotFound title={t('error:notFound')} />;
    }
};

StarredPage.getInitialProps = (): I18nProps => ({ namespacesRequired: includeDefaultNamespaces(['starred']) });

export default compose(withAuthSync, withRedux, withApollo)(StarredPage);
