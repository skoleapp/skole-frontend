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

import { LayoutProps, MuiColor } from '../../types';
import { useOpen, useTabs } from '../../utils';
import { ModalHeader, StyledCard, TextLink } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    titleSecondary: string;
    tabLabelLeft: string;
    renderInfo: JSX.Element;
    renderOptions: JSX.Element;
    renderLeftContent: JSX.Element;
    renderRightContent: JSX.Element;
    customBottomNavbar?: JSX.Element;
    renderSecondaryAction?: JSX.Element;
    extraActionMobile?: JSX.Element;
    extraActionDesktop?: JSX.Element;
    singleColumn?: boolean;
    filePreview?: boolean;
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
    renderOptions,
    extraActionMobile,
    extraActionDesktop,
    filePreview,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const { open: infoOpen, handleOpen: handleOpenInfo, handleClose: handleCloseInfo } = useOpen();
    const { open: optionsOpen, handleOpen: openOptions, handleClose: closeOptions } = useOpen();

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

    const renderMobileContent = (
        <StyledCard className="md-down">
            {renderTabs}
            {tabValue === 0 && (
                <Box display="flex" flexGrow="1">
                    {renderLeftContent}
                </Box>
            )}
            {tabValue === 1 && (
                <Box display="flex" flexGrow="1">
                    {renderRightContent}
                </Box>
            )}
        </StyledCard>
    );

    const renderDesktopContent = !!singleColumn ? (
        <StyledCard className="md-up">
            <CardHeader title={title} action={renderDesktopHeaderActions} />
            <Divider />
            {renderInfo}
            <Divider />
            {renderTabs}
            {renderLeftTabPanel}
            {renderRightTabPanel}
        </StyledCard>
    ) : (
        <Grid container className="md-up">
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    <CardHeader title={title} action={renderDesktopHeaderActions} />
                    <Divider />
                    {!filePreview && renderInfo}
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
        <SwipeableDrawer
            className="md-down"
            anchor="bottom"
            open={!!optionsOpen}
            onOpen={openOptions}
            onClose={closeOptions}
        >
            <ModalHeader title={t('common:actions')} onCancel={closeOptions} />
            {renderOptions}
        </SwipeableDrawer>
    );

    const renderDesktopOptionsDrawer = (
        <SwipeableDrawer
            className="md-up"
            anchor="left"
            open={!!optionsOpen}
            onOpen={openOptions}
            onClose={closeOptions}
        >
            <ModalHeader title={t('common:actions')} onCancel={closeOptions} />
            {renderOptions}
        </SwipeableDrawer>
    );

    return (
        <MainLayout
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
        </MainLayout>
    );
};
