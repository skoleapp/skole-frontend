import { Box, CardContent, CardHeader, Grid, Typography } from '@material-ui/core';
import * as R from 'ramda';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useDeviceContext } from '../../context';
import { LayoutProps } from '../../types';
import { useSettings } from '../../utils';
import { SettingsButton, StyledCard } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    renderCardContent?: JSX.Element | JSX.Element[];
    renderDesktopHeaderRight?: JSX.Element;
    desktopHeader?: string;
    formLayout?: boolean;
    infoLayout?: boolean;
    infoContent?: string;
    fullSize?: boolean;
}

export const SettingsLayout: React.FC<Props> = ({
    topNavbarProps,
    renderCardContent,
    renderDesktopHeaderRight,
    desktopHeader,
    formLayout,
    infoLayout,
    infoContent,
    fullSize,
    children,
    ...props
}) => {
    const { renderSettingsMenuList } = useSettings(false);
    const { t } = useTranslation();
    const isMobile = useDeviceContext();

    const customColSpan = {
        sm: 8,
        md: 6,
        lg: 5,
    };

    const layoutProps = formLayout || infoLayout ? customColSpan : {};
    const renderInfoContent = infoContent && <Typography variant="body2">{infoContent}</Typography>;
    const renderHeaderRight = <SettingsButton color="secondary" />;
    const headerRight: JSX.Element = R.propOr(renderHeaderRight, 'headerRight', topNavbarProps);

    const customTopNavbarProps = {
        ...topNavbarProps,
        headerRight,
    };

    const renderSettings = !isMobile && (
        <Grid item xs={12} md={4} lg={3}>
            <StyledCard>
                <CardHeader className="border-bottom" title={t('common:settings')} />
                <CardContent>{renderSettingsMenuList}</CardContent>
            </StyledCard>
        </Grid>
    );

    const renderCardHeader = !isMobile && (
        <CardHeader className="border-bottom" title={desktopHeader} action={renderDesktopHeaderRight} />
    );

    const renderCardContentSection = (
        <Grid container justify="center">
            <Grid item container direction="column" xs={12} {...layoutProps}>
                <CardContent className="container">
                    {renderCardContent}
                    {renderInfoContent}
                </CardContent>
            </Grid>
        </Grid>
    );

    const renderContent = (
        <Grid item xs={12} md={8} lg={9} container>
            <StyledCard marginLeft>
                {renderCardHeader}
                {renderCardContentSection}
            </StyledCard>
        </Grid>
    );

    return (
        <MainLayout {...props} topNavbarProps={customTopNavbarProps}>
            <StyledSettingsLayout fullSize={fullSize}>
                <Grid container>
                    {renderSettings}
                    {renderContent}
                    {children}
                </Grid>
            </StyledSettingsLayout>
        </MainLayout>
    );
};

// Ignore: fullSize must be omitted from Box props.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledSettingsLayout = styled(({ fullSize, ...other }) => <Box {...other} />)`
    flex-grow: 1;
    display: flex;

    .MuiGrid-root,
    .container {
        flex-grow: 1;
        display: flex;
        padding: ${({ fullSize }): string => fullSize && '0 !important'};

        form {
            width: 100%;
        }
    }

    .container {
        flex-direction: column;
    }
`;
