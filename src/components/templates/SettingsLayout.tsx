import { CardContent, CardHeader, Grid } from '@material-ui/core';
import { MainLayout, StyledCard } from '..';

import { LayoutProps } from '../../types';
import React from 'react';
import { useSettings } from '../../utils';

export const SettingsLayout: React.FC<Omit<LayoutProps, 'backUrl'>> = ({ title, renderCardContent, renderDialog }) => {
    const { renderSettingsCardContent } = useSettings({ modal: false });

    const renderMobileContent = (
        <StyledCard className="md-down">
            <CardHeader title={title} />
            <CardContent>{renderCardContent}</CardContent>
        </StyledCard>
    );

    const renderDesktopContent = (
        <StyledCard className="md-up">
            <Grid container>
                <Grid item xs={4} lg={3}>
                    <CardContent>{renderSettingsCardContent}</CardContent>
                </Grid>
                <Grid item xs={8} lg={9} container justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={5}>
                        <CardHeader title={title} />
                        <CardContent>{renderCardContent}</CardContent>
                    </Grid>
                </Grid>
            </Grid>
        </StyledCard>
    );

    return (
        <MainLayout title={title} backUrl>
            {renderMobileContent}
            {renderDesktopContent}
            {renderDialog}
        </MainLayout>
    );
};
