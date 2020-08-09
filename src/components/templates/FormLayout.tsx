import { CardContent, CardHeader, Grid } from '@material-ui/core';
import { useDeviceContext } from 'context';
import React from 'react';
import { MainLayoutProps } from 'types';

import { StyledCard } from '..';
import { MainLayout } from './MainLayout';

interface Props extends Omit<MainLayoutProps, 'children'> {
    renderCardContent?: JSX.Element;
    desktopHeader?: string;
}

export const FormLayout: React.FC<Props> = ({ renderCardContent, desktopHeader, ...props }) => {
    const isMobile = useDeviceContext();

    return (
        <MainLayout {...props}>
            <StyledCard>
                {!isMobile && <CardHeader className="border-bottom" title={desktopHeader} />}
                <Grid container justify="center">
                    <Grid item xs={12} sm={6} md={5} lg={4}>
                        <CardContent>{renderCardContent}</CardContent>
                    </Grid>
                </Grid>
            </StyledCard>
        </MainLayout>
    );
};
