import { Box, CardContent, CardHeader, Divider, Drawer, Grid, IconButton } from '@material-ui/core';
import { ClearAllOutlined, FilterListOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { StyledCard, StyledTable } from '..';
import { useDeviceContext } from '../../context';
import { useTranslation } from '../../i18n';
import { LayoutProps, UseFilters } from '../../types';
import { ModalHeader } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps, Pick<UseFilters<{}>, 'drawerProps' | 'handleClearFilters'> {
    renderTableContent: JSX.Element;
    renderCardContent: JSX.Element;
}

export const FilterLayout: React.FC<Props> = ({
    renderCardContent,
    renderTableContent,
    drawerProps,
    handleClearFilters,
    topNavbarProps,
    ...props
}) => {
    const { t } = useTranslation();
    const { handleOpen, ...commonDrawerProps } = drawerProps;
    const { onClose: handleCloseDrawer } = drawerProps;
    const isMobile = useDeviceContext();

    const renderMobileClearFiltersButton = (
        <IconButton onClick={handleClearFilters}>
            <ClearAllOutlined />
        </IconButton>
    );

    const renderFiltersButton = (
        <IconButton onClick={handleOpen} color="secondary">
            <FilterListOutlined />
        </IconButton>
    );

    const renderMobileContent = isMobile && (
        <Box flexGrow="1" display="flex">
            <StyledTable>{renderTableContent}</StyledTable>
            <Drawer {...commonDrawerProps}>
                <ModalHeader
                    onCancel={handleCloseDrawer}
                    text={t('common:filters')}
                    headerRight={renderMobileClearFiltersButton}
                />
                <CardContent>{renderCardContent}</CardContent>
            </Drawer>
        </Box>
    );

    const renderDesktopContent = !isMobile && (
        <Grid container>
            <Grid item container xs={5} md={4} lg={3}>
                <StyledCard>
                    <CardHeader title={t('common:filters')} />
                    <Divider />
                    <CardContent>{renderCardContent}</CardContent>
                </StyledCard>
            </Grid>
            <Grid item container xs={7} md={8} lg={9}>
                <StyledCard marginLeft>
                    <CardHeader title={t('common:searchResults')} />
                    <Divider />
                    <StyledTable>{renderTableContent}</StyledTable>
                </StyledCard>
            </Grid>
        </Grid>
    );

    const customTopNavbarProps = { ...topNavbarProps, headerRight: renderFiltersButton };

    return (
        <StyledFilterLayout>
            <MainLayout {...props} topNavbarProps={customTopNavbarProps}>
                {renderMobileContent}
                {renderDesktopContent}
            </MainLayout>
        </StyledFilterLayout>
    );
};

const StyledFilterLayout = styled(Box)`
    .MuiGrid-root {
        flex-grow: 1;
    }
`;
