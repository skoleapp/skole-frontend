import { CardContent, CardHeader, Grid } from '@material-ui/core';
import React from 'react';

import { StyledCard } from '..';
import { LayoutProps } from '../../types';
import { MainLayout } from '.';

interface Props extends LayoutProps {
    renderCardContent?: JSX.Element;
    renderAlert?: JSX.Element;
    desktopHeader?: string;
}

export const FormLayout: React.FC<Props> = ({ renderCardContent, renderAlert, desktopHeader, ...props }) => (
    <MainLayout {...props}>
        <StyledCard>
            <CardHeader className="border-bottom md-up" title={desktopHeader} />
            <Grid container justify="center">
                <Grid item xs={12} sm={6} md={5} lg={4}>
                    {!!renderAlert && <CardContent>{renderAlert}</CardContent>}
                    <CardContent>{renderCardContent}</CardContent>
                </Grid>
            </Grid>
        </StyledCard>
    </MainLayout>
);
