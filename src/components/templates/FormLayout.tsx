import { CardContent, CardHeader, Grid } from '@material-ui/core';
import { useDeviceContext } from 'context';
import React from 'react';
import { LayoutProps } from 'types';

import { StyledCard } from '..';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    renderCardContent?: JSX.Element;
    renderAlert?: JSX.Element;
    desktopHeader?: string;
}

export const FormLayout: React.FC<Props> = ({ renderCardContent, renderAlert, desktopHeader, ...props }) => {
    const isMobile = useDeviceContext();

    return (
        <MainLayout {...props}>
            <StyledCard>
                {!isMobile && <CardHeader className="border-bottom" title={desktopHeader} />}
                <Grid container justify="center">
                    <Grid item xs={12} sm={6} md={5} lg={4}>
                        {!!renderAlert && <CardContent>{renderAlert}</CardContent>}
                        <CardContent>{renderCardContent}</CardContent>
                    </Grid>
                </Grid>
            </StyledCard>
        </MainLayout>
    );
};
