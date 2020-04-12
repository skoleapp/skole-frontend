import { Box, CardContent, CardHeader, Divider, Drawer, Grid, IconButton, Tab } from '@material-ui/core';
import { InfoOutlined, MoreHorizOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { breakpointsNum } from '../../styles';
import { LayoutProps, MuiColor, UseOptions } from '../../types';
import { useBreakPoint, useDrawer, useTabs } from '../../utils';
import { StyledCard } from '../shared';
import { StyledTabs } from '../shared/StyledTabs';
import { MainLayout } from './MainLayout';

interface OptionProps extends Omit<UseOptions, 'renderShareOption' | 'renderReportOption' | 'closeOptions'> {
    renderOptions: JSX.Element;
}

interface Props extends LayoutProps {
    headerDesktop?: string;
    subheaderDesktop?: JSX.Element;
    headerSecondary: string;
    tabLabelLeft: string;
    tabLabelRight: string;
    renderInfo: JSX.Element;
    renderLeftContent: JSX.Element;
    renderRightContent: JSX.Element;
    customBottomNavbar?: JSX.Element;
    customBottomNavbarSecondary?: JSX.Element;
    renderSecondaryAction?: JSX.Element;
    headerLeftMobile?: JSX.Element;
    headerActionDesktop?: JSX.Element;
    extraDesktopActions?: JSX.Element;
    singleColumn?: boolean;
    optionProps: OptionProps;
}

export const TabLayout: React.FC<Props> = ({
    headerDesktop,
    subheaderDesktop,
    headerSecondary,
    tabLabelLeft,
    tabLabelRight,
    renderInfo,
    renderLeftContent,
    renderRightContent,
    singleColumn,
    optionProps,
    headerLeftMobile,
    headerActionDesktop,
    extraDesktopActions,
    customBottomNavbar,
    customBottomNavbarSecondary,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const isMobile = useBreakPoint(breakpointsNum.MD);

    const {
        renderOptions,
        renderOptionsHeader,
        drawerProps: { handleOpen: handleOpenOptions, ...optionDrawerProps },
    } = optionProps;

    const { renderHeader: renderInfoHeader, handleOpen: handleOpenInfo, ...infoDrawerProps } = useDrawer(
        t('common:info'),
    );

    const renderCustomBottomNavbar =
        tabValue === 0 ? customBottomNavbar : customBottomNavbarSecondary || customBottomNavbar;

    const renderHeaderActions = (color: MuiColor): JSX.Element => (
        <Box display="flex">
            <Box className="md-up">{headerActionDesktop}</Box>
            <IconButton onClick={handleOpenInfo} color={color}>
                <InfoOutlined />
            </IconButton>
            <IconButton onClick={handleOpenOptions} color={color}>
                <MoreHorizOutlined />
            </IconButton>
        </Box>
    );

    const renderMobileHeaderActions = renderHeaderActions('secondary');
    const renderDesktopHeaderActions = renderHeaderActions('default');

    const renderTabs = (
        <StyledTabs value={tabValue} onChange={handleTabChange}>
            <Tab label={tabLabelLeft} />
            <Tab label={tabLabelRight} />
        </StyledTabs>
    );

    const renderLeftTab = tabValue === 0 && (
        <Box display="flex" flexGrow="1">
            {renderLeftContent}
        </Box>
    );

    const renderRightTab = tabValue === 1 && (
        <Box display="flex" flexGrow="1">
            {renderRightContent}
        </Box>
    );

    const renderMobileContent = (
        <StyledCard className="md-down">
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    const renderDesktopContent = singleColumn ? (
        <StyledCard className="md-up">
            <CardHeader title={headerDesktop} action={renderDesktopHeaderActions} />
            <Divider />
            {renderInfo}
            <Divider />
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    ) : (
        <Grid className="md-up" id="container" container>
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    <CardHeader
                        id="main-header"
                        title={headerDesktop}
                        subheader={subheaderDesktop}
                        action={renderDesktopHeaderActions}
                    />
                    <CardContent>{extraDesktopActions}</CardContent>
                    <Divider />
                    {renderLeftContent}
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

    const renderInfoDrawer = (
        <Drawer {...infoDrawerProps}>
            {renderInfoHeader}
            {renderInfo}
        </Drawer>
    );

    const renderOptionsDrawer = (
        <Drawer {...optionDrawerProps}>
            {renderOptionsHeader}
            {renderOptions}
        </Drawer>
    );

    const layoutProps = {
        ...props,
        topNavbarProps: {
            headerRight: renderMobileHeaderActions,
            headerLeft: headerLeftMobile,
        },
        customBottomNavbar: renderCustomBottomNavbar,
    };

    return (
        <StyledTabLayout>
            <MainLayout {...layoutProps}>
                {isMobile && renderMobileContent}
                {!isMobile && renderDesktopContent}
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
        padding-bottom: 0 !important;

        .MuiCardHeader-content {
            padding-left: 0.5rem;
        }
    }
`;
