import { Box, CardContent, CardHeader, Grid } from '@material-ui/core';
import { useDeviceContext } from 'context';
import { useSettings } from 'hooks';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React from 'react';
import styled from 'styled-components';
import { MainLayoutProps } from 'types';

import { SettingsButton, StyledCard } from '..';
import { MainLayout } from './MainLayout';

interface Props extends Omit<MainLayoutProps, 'children'> {
    renderCardContent?: JSX.Element | JSX.Element[];
    renderDesktopHeaderRight?: JSX.Element;
    desktopHeader?: string;
    formLayout?: boolean;
    infoLayout?: boolean;
    fullSize?: boolean;
}

export const SettingsLayout: React.FC<Props> = ({
    topNavbarProps,
    renderCardContent,
    renderDesktopHeaderRight,
    desktopHeader,
    formLayout,
    infoLayout,
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
                <CardContent className="container">{renderCardContent}</CardContent>
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
