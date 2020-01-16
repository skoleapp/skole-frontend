import { CardContent, CardHeader, Grid } from '@material-ui/core';

import { MainLayout } from '.';
import React from 'react';
import { StyledCard } from '..';

interface Props {
    title: string;
    backUrl?: boolean;
    renderForm: JSX.Element;
    renderAlert?: JSX.Element;
}

export const FormLayout: React.FC<Props> = ({ title, backUrl, renderForm, renderAlert }) => (
    <MainLayout title={title} backUrl={backUrl}>
        <StyledCard>
            <Grid container justify="center">
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    <CardContent>{renderAlert}</CardContent>
                    <CardHeader title={title} />
                    <CardContent>{renderForm}</CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    </MainLayout>
);
