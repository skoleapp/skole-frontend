import { Box, Button, CardContent, CardHeader, Grid, IconButton, SwipeableDrawer } from '@material-ui/core';
import { Cancel, FilterList } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from '../../i18n';

import { StyledCard, StyledTable } from '..';
import { LayoutProps } from '../../types';
import { UseFilters } from '../../utils/useFilters';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    renderTableContent: JSX.Element;
}

export const FilterLayout = <T extends {}>({
    renderCardContent,
    renderTableContent,
    toggleDrawer,
    open,
    ...props
}: Props & Pick<UseFilters<T>, 'toggleDrawer' | 'open'>): JSX.Element => {
    const { t } = useTranslation();

    const renderExitDrawerButton = (
        <IconButton onClick={toggleDrawer(false)}>
            <Cancel />
        </IconButton>
    );

    const renderMobileContent = (
        <Box className="md-down">
            <Box marginBottom="0.5rem">
                <StyledCard>
                    <CardContent>
                        <Button
                            variant="outlined"
                            color="primary"
                            onClick={toggleDrawer(true)}
                            endIcon={<FilterList />}
                            fullWidth
                        >
                            {t('common:advancedSearch')}
                        </Button>
                    </CardContent>
                </StyledCard>
            </Box>
            <StyledTable>{renderTableContent}</StyledTable>
            <SwipeableDrawer anchor="bottom" open={open} onClose={toggleDrawer(false)} onOpen={toggleDrawer(true)}>
                <StyledCard scrollable>
                    <CardHeader subheader={t('common:advancedSearch')} action={renderExitDrawerButton} />
                    <CardContent>{renderCardContent}</CardContent>
                </StyledCard>
            </SwipeableDrawer>
        </Box>
    );

    const renderDesktopContent = (
        <StyledCard className="md-up">
            <Grid container>
                <Grid item xs={5} md={4} lg={3}>
                    <CardHeader subheader={t('common:advancedSearch')} />
                    <CardContent>{renderCardContent}</CardContent>
                </Grid>
                <Grid item xs={7} md={8} lg={9}>
                    <CardHeader subheader={t('common:searchResults')} />
                    <CardContent>
                        <StyledTable disableBoxShadow>{renderTableContent}</StyledTable>
                    </CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    );

    return (
        <MainLayout {...props}>
            {renderMobileContent}
            {renderDesktopContent}
        </MainLayout>
    );
};
