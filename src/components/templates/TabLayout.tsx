import { Box, Breadcrumbs, CardHeader, Divider, Grid, IconButton, Tab, Tooltip } from '@material-ui/core';
import { InfoOutlined, MoreHorizOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useDeviceContext } from '../../context';
import { LayoutProps, MaxWidth, MuiColor, StyledBreadcrumbProps, UseOptions } from '../../types';
import { useDrawer, useTabs } from '../../utils';
import { StyledCard, StyledDrawer, StyledTabs, TextLink } from '../shared';
import { MainLayout } from './MainLayout';

interface OptionProps extends Omit<UseOptions, 'renderShareOption' | 'renderReportOption' | 'closeOptions'> {
    renderOptions: JSX.Element;
    optionsTooltip?: string;
}

interface Props extends LayoutProps {
    headerDesktop?: string;
    // subheaderDesktop?: JSX.Element | string | boolean;
    // subheaderDesktopSecondary?: JSX.Element | string | boolean;
    headerSecondary?: string;
    tabLabelLeft: string;
    tabLabelRight: string;
    renderInfo: JSX.Element;
    infoTooltip?: string;
    infoHeader: string;
    renderLeftContent: JSX.Element;
    renderRightContent: JSX.Element;
    customBottomNavbar?: JSX.Element;
    customBottomNavbarSecondary?: JSX.Element;
    renderSecondaryAction?: JSX.Element;
    headerLeftMobile?: JSX.Element;
    headerActionDesktop?: JSX.Element;
    // extraDesktopActions?: JSX.Element;
    extraBreadcrumbs: StyledBreadcrumbProps[];
    optionProps: OptionProps;
    responsive?: boolean;
}

export const TabLayout: React.FC<Props> = ({
    headerDesktop,
    // subheaderDesktop,
    // subheaderDesktopSecondary,
    headerSecondary,
    tabLabelLeft,
    tabLabelRight,
    renderInfo,
    infoTooltip,
    infoHeader,
    renderLeftContent,
    renderRightContent,
    optionProps,
    headerLeftMobile,
    headerActionDesktop,
    extraBreadcrumbs,
    // extraDesktopActions,
    customBottomNavbar,
    customBottomNavbarSecondary,
    topNavbarProps,
    responsive,
    ...props
}) => {
    const { t } = useTranslation();
    const { tabValue, handleTabChange } = useTabs();
    const isMobile = useDeviceContext();
    const { renderHeader: renderInfoHeader, handleOpen: handleOpenInfo, ...infoDrawerProps } = useDrawer(infoHeader);

    const {
        renderOptions,
        renderOptionsHeader,
        drawerProps: { handleOpen: handleOpenOptions, ...optionDrawerProps },
        optionsTooltip,
    } = optionProps;

    const renderCustomBottomNavbar =
        tabValue === 0 ? customBottomNavbar : customBottomNavbarSecondary || customBottomNavbar;

    const renderHeaderRight = (color: MuiColor): JSX.Element => (
        <Tooltip title={optionsTooltip || ''}>
            <IconButton onClick={handleOpenOptions} color={color}>
                <MoreHorizOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderHeaderRightSecondary = (color: MuiColor): JSX.Element => (
        <Tooltip title={infoTooltip || ''}>
            <IconButton onClick={handleOpenInfo} color={color}>
                <InfoOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderDesktopHeaderActions = (
        <Box display="flex">
            {headerActionDesktop}
            {renderHeaderRightSecondary('default')}
            {renderHeaderRight('default')}
        </Box>
    );

    const renderMobileHeaderRight = renderHeaderRight('secondary');
    const renderMobileHeaderRightSecondary = renderHeaderRightSecondary('secondary');

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={tabLabelLeft} />
            <Tab label={tabLabelRight} />
        </StyledTabs>
    );

    const renderLeftTab = tabValue === 0 && (
        <Box display="flex" flexGrow="1" position="relative">
            {renderLeftContent}
        </Box>
    );

    const renderRightTab = tabValue === 1 && (
        <Box display="flex" flexGrow="1">
            {renderRightContent}
        </Box>
    );

    const renderMobileContent = isMobile && !responsive && (
        <StyledCard>
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    // const renderSubheaderDesktop = (
    //     <Box>
    //         <Typography variant="subtitle1">{subheaderDesktop}</Typography>
    //         <Typography variant="subtitle1">{subheaderDesktopSecondary}</Typography>
    //     </Box>
    // );

    const StyledBreadcrumbs = styled(Breadcrumbs)`
        .MuiBreadcrumbs-li {
            .MuiLink-root {
                display: flex;
            }

            .MuiSvgIcon-root {
                color: default;
                margin-right: 0.25rem;
            }
        }
    `;

    const renderBreadCrumbs = (
        <StyledBreadcrumbs>
            <TextLink href="/" color="inherit">
                {t('common:home')}
            </TextLink>
            <TextLink href="/search" color="inherit">
                {t('common:search')}
            </TextLink>
            {extraBreadcrumbs.map(({ linkProps, text }, i) => (
                <TextLink key={i} {...linkProps}>
                    {text}
                </TextLink>
            ))}
        </StyledBreadcrumbs>
    );

    const renderDesktopContent = !isMobile && !responsive && (
        <Grid id="container" container>
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    {/* <CardHeader
                        id="main-header"
                        title={renderBreadCrumbs}
                        // subheader={renderBreadCrumbs}
                        action={renderDesktopHeaderActions}
                    /> */}
                    {/* <CardContent>{extraDesktopActions}</CardContent> */}
                    {/* <Divider /> */}
                    <Box position="relative" flexGrow="1" display="flex">
                        {renderLeftContent}
                    </Box>
                </StyledCard>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <StyledCard marginLeft>
                    <CardHeader title={headerSecondary} />
                    <Divider />
                    {renderRightContent}
                </StyledCard>
            </Grid>
        </Grid>
    );

    // Responsive template for both mobile and desktop
    const renderResponsiveContent = !!responsive && (
        <StyledCard>
            {!isMobile && (
                <CardHeader title={headerDesktop} action={renderDesktopHeaderActions} className="border-bottom" />
            )}
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    const renderInfoDrawer = (
        <StyledDrawer {...infoDrawerProps}>
            {renderInfoHeader}
            {renderInfo}
        </StyledDrawer>
    );

    const renderOptionsDrawer = (
        <StyledDrawer {...optionDrawerProps}>
            {renderOptionsHeader}
            {renderOptions}
        </StyledDrawer>
    );

    const layoutProps = {
        ...props,
        topNavbarProps: {
            ...topNavbarProps,
            headerRight: renderMobileHeaderRight,
            headerRightSecondary: renderMobileHeaderRightSecondary,
            headerLeft: headerLeftMobile,
        },
        customBottomNavbar: renderCustomBottomNavbar,
        containerProps: {
            maxWidth: 'xl' as MaxWidth,
        },
    };

    return (
        <StyledTabLayout>
            <MainLayout {...layoutProps}>
                {renderMobileContent}
                {renderDesktopContent}
                {renderResponsiveContent}
                {renderInfoDrawer}
                {renderOptionsDrawer}
            </MainLayout>
        </StyledTabLayout>
    );
};

const StyledTabLayout = styled(Box)`
    #container {
        flex-grow: 1;
    }

    #main-header {
        text-align: left;

        .MuiCardHeader-subheader {
            margin-top: 0.25rem;
        }
    }
`;
