import React from 'react';
import { LayoutProps } from '../../types';
import { MainLayout } from './MainLayout';
import { Divider, Grid } from '@material-ui/core';
import { StyledCard } from '../shared';

interface Props extends LayoutProps {
    renderLeftCardContent: JSX.Element;
    renderRightCardContent: JSX.Element;
    renderMidCardContent: JSX.Element;
    renderTabs: JSX.Element;
}

export const ResponsiveMainLayout: React.FC<Props> = ({
    renderLeftCardContent,
    renderRightCardContent,
    renderMidCardContent,
    renderTabs,
    ...props
}) => {
    const renderTopSection = (
        <Grid container justify="center" alignItems="center">
            <Grid item container xs={12} sm={6} direction="column" justify="center" alignItems="center">
                {renderLeftCardContent}
            </Grid>
            <Grid item container xs={12} sm={6} direction="column" justify="center" alignItems="center">
                <Grid container alignItems="center" justify="center">
                    {renderRightCardContent}
                </Grid>
            </Grid>
        </Grid>
    );

    return (
        <MainLayout {...props}>
            <StyledCard>
                {renderTopSection}
                <Divider />
                {renderMidCardContent}
                <Divider />
                {renderTabs}
            </StyledCard>
        </MainLayout>
    );
};
