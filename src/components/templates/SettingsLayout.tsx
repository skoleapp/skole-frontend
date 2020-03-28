import { CardContent, CardHeader, Divider, Grid, Typography } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { LayoutProps } from '../../types';
import { useSettings } from '../../utils';
import { SettingsButton, StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    formLayout?: boolean;
    infoLayout?: boolean;
    infoContent?: string;
}

export const SettingsLayout: React.FC<Props> = ({
    title,
    heading,
    renderCardContent,
    formLayout,
    infoLayout,
    infoContent,
    ...props
}) => {
    const { renderSettingsCardContent } = useSettings({ modal: false });

    const customColSpan = {
        sm: 8,
        md: 6,
        lg: 5,
    };

    const layoutProps = formLayout || infoLayout ? customColSpan : {};

    const renderFormLayoutMobileContent = formLayout && (
        <StyledCard className="md-down">
            <CardContent>{renderCardContent}</CardContent>
        </StyledCard>
    );

    const renderFullWidthLayoutMobileContent = !formLayout && !infoLayout && (
        <StyledCard className="md-down">{renderCardContent}</StyledCard>
    );

    const renderInfoContent = <Typography variant="body2">{infoContent}</Typography>;

    const renderInfoLayoutMobileContent = infoLayout && (
        <StyledCard className="md-down">
            <CardContent>{renderInfoContent}</CardContent>
        </StyledCard>
    );

    const renderDesktopContent = (
        <Grid container className="md-up">
            <Grid item xs={12} md={4} lg={3}>
                <StyledCard>
                    <CardContent>{renderSettingsCardContent}</CardContent>
                </StyledCard>
            </Grid>
            <Grid item xs={12} md={8} lg={9} container>
                <StyledCard marginLeft>
                    <CardHeader title={heading} />
                    <Divider />
                    <Grid container justify="center">
                        <Grid item container direction="column" xs={12} {...layoutProps}>
                            {infoLayout ? (
                                <CardContent className="container">{renderInfoContent}</CardContent>
                            ) : (
                                renderCardContent
                            )}
                        </Grid>
                    </Grid>
                </StyledCard>
            </Grid>
        </Grid>
    );

    const renderHeaderRight = <SettingsButton color="secondary" />;

    return (
        <StyledSettingsLayout title={title} heading={heading} headerRight={renderHeaderRight} {...props}>
            {renderFormLayoutMobileContent}
            {renderFullWidthLayoutMobileContent}
            {renderInfoLayoutMobileContent}
            {renderDesktopContent}
        </StyledSettingsLayout>
    );
};

const StyledSettingsLayout = styled(MainLayout)`
    .MuiGrid-root,
    .container {
        flex-grow: 1;
        display: flex;
    }
`;
