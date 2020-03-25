import {
    Box,
    CardHeader,
    Divider,
    Grid,
    IconButton,
    Paper,
    SwipeableDrawer,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core';
import { InfoOutlined, MoreHorizOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { LayoutProps, MuiColor, UseOptions } from '../../types';
import { useOpen, useTabs } from '../../utils';
import { ModalHeader, StyledCard, TextLink } from '../shared';
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
    extraActionMobile?: JSX.Element;
    extraActionDesktop?: JSX.Element;
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
    customBottomNavbar,
    createdInfoProps,
    singleColumn,
    optionProps,
    extraActionMobile,
    extraActionDesktop,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const { open: infoOpen, handleOpen: handleOpenInfo, handleClose: handleCloseInfo } = useOpen();
    const { renderOptions, renderOptionsHeader, mobileDrawerProps, desktopDrawerProps, openOptions } = optionProps;

    const renderHeaderActions = (color: MuiColor): JSX.Element => (
        <Box display="flex">
            <Box className="md-up">{extraActionDesktop}</Box>
            <IconButton onClick={handleOpenInfo} color={color}>
                <InfoOutlined />
            </IconButton>
            <IconButton onClick={openOptions} color={color}>
                <MoreHorizOutlined />
            </IconButton>
        </Box>
    );

    const renderMobileHeaderActions = renderHeaderActions('secondary');
    const renderDesktopHeaderActions = renderHeaderActions('primary');

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
        <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
        >
            <Tab label={tabLabelLeft} />
            <Tab label={titleSecondary} />
        </Tabs>
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
                    <CardHeader title={title} action={renderDesktopHeaderActions} />
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

    const renderMobileInfoDrawer = (
        <SwipeableDrawer
            className="md-down"
            anchor="bottom"
            open={!!infoOpen}
            onOpen={handleOpenInfo}
            onClose={handleCloseInfo}
        >
            <Paper>
                <ModalHeader title={title} onCancel={handleCloseInfo} />
                {renderCreatedInfo}
                <Divider />
                {renderInfo}
            </Paper>
        </SwipeableDrawer>
    );

    const renderDesktopInfoDrawer = (
        <SwipeableDrawer
            className="md-up"
            anchor="left"
            open={!!infoOpen}
            onOpen={handleOpenInfo}
            onClose={handleCloseInfo}
        >
            <ModalHeader title={title} onCancel={handleCloseInfo} />
            {renderCreatedInfo}
            <Divider />
            {renderInfo}
        </SwipeableDrawer>
    );

    const renderMobileOptionsDrawer = (
        <SwipeableDrawer {...mobileDrawerProps}>
            {renderOptionsHeader}
            {renderOptions}
        </SwipeableDrawer>
    );

    const renderDesktopOptionsDrawer = (
        <SwipeableDrawer {...desktopDrawerProps}>
            {renderOptionsHeader}
            {renderOptions}
        </SwipeableDrawer>
    );

    return (
        <StyledTabLayout
            title={title}
            backUrl
            headerRight={renderMobileHeaderActions}
            customBottomNavbar={customBottomNavbar}
            headerLeft={extraActionMobile}
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
`;
