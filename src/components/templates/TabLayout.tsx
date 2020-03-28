import { Box, CardHeader, Divider, Drawer, Grid, IconButton, Paper, Tab, Typography } from '@material-ui/core';
import { InfoOutlined, MoreHorizOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { LayoutProps, MuiColor, UseOptions } from '../../types';
import { useOpen, useTabs } from '../../utils';
import { ModalHeader, StyledCard, TextLink } from '../shared';
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
    createdInfoProps?: {
        creatorId: string;
        creatorName: string;
        created: string;
    };
}

export const TabLayout: React.FC<Props> = ({
    title,
    titleSecondary,
    tabLabelLeft,
    renderInfo,
    renderLeftContent,
    renderRightContent,
    createdInfoProps,
    singleColumn,
    optionProps,
    headerActionMobile,
    headerActionDesktop,
    extraDesktopActions,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const { open: infoOpen, handleOpen: handleOpenInfo, handleClose: handleCloseInfo } = useOpen();
    const { renderOptions, renderOptionsHeader, mobileDrawerProps, desktopDrawerProps, openOptions } = optionProps;

    const renderHeaderActions = (color: MuiColor): JSX.Element => (
        <Box display="flex">
            <Box className="md-up">{headerActionDesktop}</Box>
            <IconButton onClick={handleOpenInfo} color={color}>
                <InfoOutlined />
            </IconButton>
            <IconButton onClick={openOptions} color={color}>
                <MoreHorizOutlined />
            </IconButton>
        </Box>
    );

    const renderMobileHeaderActions = renderHeaderActions('secondary');
    const renderDesktopHeaderActions = renderHeaderActions('default');

    const renderCreatedInfo = !!createdInfoProps && (
        <Box padding="0.5rem" textAlign="left">
            <Typography variant="body2" color="textSecondary">
                {t('common:createdBy')}{' '}
                <TextLink href={`/users/${createdInfoProps.creatorId}`} color="primary">
                    {createdInfoProps.creatorName}
                </TextLink>{' '}
                {createdInfoProps.created}
            </Typography>
        </Box>
    );

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
        <StyledCard className="md-down">
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    );

    const renderDesktopContent = !!singleColumn ? (
        <StyledCard className="md-up">
            <CardHeader title={title} action={renderDesktopHeaderActions} />
            <Divider />
            {renderInfo}
            <Divider />
            {renderTabs}
            {renderLeftTab}
            {renderRightTab}
        </StyledCard>
    ) : (
        <Grid container className="md-up">
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    <CardHeader id="main-header" title={title} action={renderDesktopHeaderActions} />
                    {extraDesktopActions}
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

    const commonInfoDrawerProps = {
        open: !!infoOpen,
        onClose: handleCloseInfo,
    };

    const renderMobileInfoDrawer = (
        <Drawer className="md-down" anchor="bottom" {...commonInfoDrawerProps}>
            <Paper>
                <ModalHeader title={title} onCancel={handleCloseInfo} />
                {renderCreatedInfo}
                <Divider />
                {renderInfo}
            </Paper>
        </Drawer>
    );

    const renderDesktopInfoDrawer = (
        <Drawer className="md-up" anchor="left" {...commonInfoDrawerProps}>
            <ModalHeader title={title} onCancel={handleCloseInfo} />
            {renderCreatedInfo}
            <Divider />
            {renderInfo}
        </Drawer>
    );

    const renderMobileOptionsDrawer = (
        <Drawer {...mobileDrawerProps}>
            {renderOptionsHeader}
            {renderOptions}
        </Drawer>
    );

    const renderDesktopOptionsDrawer = (
        <Drawer {...desktopDrawerProps}>
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
            {renderMobileContent}
            {renderDesktopContent}
            {renderMobileInfoDrawer}
            {renderDesktopInfoDrawer}
            {renderMobileOptionsDrawer}
            {renderDesktopOptionsDrawer}
        </StyledTabLayout>
    );
};

const StyledTabLayout = styled(MainLayout)`
    .MuiGrid-root {
        flex-grow: 1;
    }

    #main-header {
        text-align: left;
        padding: 0.5rem 0.5rem 0.5rem 1rem;
    }
`;
