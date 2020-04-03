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
    titleSecondary: string;
    tabLabelLeft: string;
    renderInfo: JSX.Element;
    renderLeftContent: JSX.Element;
    renderRightContent: JSX.Element;
    customBottomNavbar?: JSX.Element;
    renderSecondaryAction?: JSX.Element;
    headerActionMobile?: JSX.Element;
    headerActionDesktop?: JSX.Element;
    extraDesktopActions?: JSX.Element;
    singleColumn?: boolean;
    optionProps: OptionProps;
}

export const TabLayout: React.FC<Props> = ({
    title,
    titleSecondary,
    tabLabelLeft,
    renderInfo,
    renderLeftContent,
    renderRightContent,
    singleColumn,
    optionProps,
    headerActionMobile,
    headerActionDesktop,
    extraDesktopActions,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const { renderHeader: renderInfoHeader, ...infoDrawerProps } = useDrawer(t('common:info'));
    const { handleOpen: handleOpenInfo } = infoDrawerProps;
    const { renderOptions, renderOptionsHeader, drawerProps: optionDrawerProps } = optionProps;
    const { handleOpen: handleOpenOptions } = optionDrawerProps;
    const isMobile = useBreakPoint(breakpointsNum.MD);

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
            <Tab label={titleSecondary} />
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
        <StyledCard>
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    const renderDesktopContent = singleColumn ? (
        <StyledCard>
            <CardHeader title={title} action={renderDesktopHeaderActions} />
            <Divider />
            {renderInfo}
            <Divider />
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    ) : (
        <Grid id="container" container>
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    <CardHeader id="main-header" title={title} action={renderDesktopHeaderActions} />
                    <CardContent>{extraDesktopActions}</CardContent>
                    <Divider />
                    {renderLeftContent}
                </StyledCard>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <StyledCard marginLeft>
                    <CardHeader title={titleSecondary} />
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

    return (
        <StyledTabLayout
            title={title}
            backUrl
            headerRight={renderMobileHeaderActions}
            headerLeft={headerActionMobile}
            {...props}
        >
            {isMobile && renderMobileContent}
            {!isMobile && renderDesktopContent}
            {renderInfoDrawer}
            {renderOptionsDrawer}
        </StyledTabLayout>
    );
};

const StyledTabLayout = styled(MainLayout)`
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
