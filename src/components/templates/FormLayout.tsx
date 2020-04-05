import { CardContent, CardHeader, Grid } from '@material-ui/core';
import React from 'react';

import { StyledCard } from '..';
import { LayoutProps } from '../../types';
import { MainLayout } from '.';

export const FormLayout: React.FC<LayoutProps> = ({ renderCardContent, renderAlert, heading, ...props }) => (
    <MainLayout heading={heading} {...props}>
        <StyledCard>
            <CardHeader className="border-bottom md-up" title={heading} />
            <Grid container justify="center">
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    {!!renderAlert && <CardContent>{renderAlert}</CardContent>}
                    <CardContent>{renderCardContent}</CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    </MainLayout>
);
