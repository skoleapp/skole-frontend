import { CardContent, CardHeader, Grid } from '@material-ui/core';
import React from 'react';

import { StyledCard } from '..';
import { LayoutProps } from '../../types';
import { MainLayout } from '.';

export const FullWidthLayout: React.FC<LayoutProps> = ({ renderCardContent, renderAlert, ...props }) => (
    <MainLayout {...props}>
        <StyledCard>
            <Grid container justify="center">
                <Grid item xs={12} sm={12} md={12} lg={12}>
                    <CardContent>{renderAlert}</CardContent>
                    <CardHeader title={props.title} />
                    <CardContent>{renderCardContent}</CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    </MainLayout>
);
