import { CardContent, CardHeader, Grid } from '@material-ui/core';
import { Layout, StyledCard } from '../components';

import React from 'react';
import { useSettings } from '.';

interface Props {
    title: string;
    renderCardContent: JSX.Element;
}

export const useSettingsLayout = ({ title, renderCardContent }: Props): JSX.Element => {
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
        <Layout title={title} backUrl>
            {renderMobileContent}
            {renderDesktopContent}
        </Layout>
    );
};
