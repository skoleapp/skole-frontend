import { Box, CardContent, CardHeader, Divider, Grid, IconButton, SwipeableDrawer } from '@material-ui/core';
import { FilterListOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { StyledCard, StyledTable } from '..';
import { useTranslation } from '../../i18n';
import { LayoutProps } from '../../types';
import { UseFilters } from '../../utils/useFilters';
import { ModalHeader } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    renderTableContent: JSX.Element | JSX.Element[];
}

export const FilterLayout = <T extends {}>({
    renderCardContent,
    renderTableContent,
    toggleDrawer,
    open,
    ...props
}: Props & Pick<UseFilters<T>, 'toggleDrawer' | 'open'>): JSX.Element => {
    const { t } = useTranslation();

    const renderFiltersButton = (
        <IconButton onClick={toggleDrawer(true)} color="secondary">
            <FilterListOutlined />
        </IconButton>
    );

    const renderMobileContent = (
        <Box className="md-down" flexGrow="1" display="flex">
            <StyledTable>{renderTableContent}</StyledTable>
            <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                <StyledCard scrollable>
                    <ModalHeader onCancel={toggleDrawer(false)} title={t('common:advancedSearch')} />
                    <CardContent>{renderCardContent}</CardContent>
                </StyledCard>
            </SwipeableDrawer>
        </Box>
    );

    const renderDesktopContent = (
        <Grid container className="md-up">
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
