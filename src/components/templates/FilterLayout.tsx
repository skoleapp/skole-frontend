import { Box, CardContent, CardHeader, Divider, Drawer, Grid, IconButton } from '@material-ui/core';
import { ClearAllOutlined, FilterListOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { StyledCard, StyledTable } from '..';
import { useTranslation } from '../../i18n';
import { LayoutProps, UseDrawer, UseFilters } from '../../types';
import { ModalHeader } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps, Pick<UseFilters<{}>, 'drawerProps' | 'handleClearFilters'> {
    renderTableContent: JSX.Element | JSX.Element[];
    drawerProps: UseDrawer;
}

export const FilterLayout: React.FC<Props> = ({
    renderCardContent,
    renderTableContent,
    drawerProps,
    handleClearFilters,
    ...props
}) => {
    const { t } = useTranslation();
    const { handleOpen: handleOpenFilters, onClose: handleCloseFilters } = drawerProps;

    const renderMobileClearFiltersButton = (
        <IconButton onClick={handleClearFilters}>
            <ClearAllOutlined />
        </IconButton>
    );

    const renderFiltersButton = (
        <IconButton onClick={handleOpenFilters} color="secondary">
            <FilterListOutlined />
        </IconButton>
    );

    const renderMobileContent = (
        <Box className="md-down" flexGrow="1" display="flex">
            <StyledTable>{renderTableContent}</StyledTable>
            <Drawer {...drawerProps}>
                <ModalHeader
                    onCancel={handleCloseFilters}
                    title={t('common:advancedSearch')}
                    headerRight={renderMobileClearFiltersButton}
                />
                <CardContent>{renderCardContent}</CardContent>
            </Drawer>
        </Box>
    );

    const renderDesktopContent = (
        <Grid className="md-up" container>
            <Grid item container xs={5} md={4} lg={3}>
                <StyledCard>
                    <CardHeader subheader={t('common:advancedSearch')} />
                    <Divider />
                    <CardContent>{renderCardContent}</CardContent>
                </StyledCard>
            </Grid>
            <Grid item container xs={7} md={8} lg={9}>
                <StyledCard marginLeft>
                    <CardHeader subheader={t('common:searchResults')} />
                    <Divider />
                    <StyledTable disableBoxShadow>{renderTableContent}</StyledTable>
                </StyledCard>
            </Grid>
        </Grid>
    );

    return (
        <StyledFilterLayout headerRight={renderFiltersButton} {...props}>
            {renderMobileContent}
            {renderDesktopContent}
        </StyledFilterLayout>
    );
};

const StyledFilterLayout = styled(MainLayout)`
    .MuiGrid-root {
        flex-grow: 1;
    }
`;
