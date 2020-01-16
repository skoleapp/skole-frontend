import { CardContent, CardHeader, Grid } from '@material-ui/core';

import { LayoutProps } from '../../types';
import { MainLayout } from '.';
import React from 'react';
import { StyledCard } from '..';

export const FormLayout: React.FC<LayoutProps> = ({ renderCardContent, renderAlert, renderDialog, ...props }) => (
    <MainLayout {...props}>
        <StyledCard>
            <Grid container justify="center">
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <CardContent>{renderAlert}</CardContent>
                    <CardHeader title={props.title} />
                    <CardContent>{renderCardContent}</CardContent>
                    <CardContent>{renderDialog}</CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    </MainLayout>
);
