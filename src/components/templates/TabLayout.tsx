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

import { LayoutProps } from '../../types';
import { useOpen, useTabs } from '../../utils';
import { ModalHeader, StyledCard, TabPanel, TextLink } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    titleSecondary: string;
    tabLabelLeft: string;
    renderMobileInfo?: JSX.Element;
    renderDesktopInfo?: JSX.Element;
    renderLeftContent: JSX.Element;
    renderRightContent: JSX.Element;
    customBottomNavbar?: JSX.Element;
    renderOptions?: JSX.Element;
    headerLeft?: JSX.Element;
    renderSecondaryAction?: JSX.Element;
    singleColumn?: boolean;
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
    renderMobileInfo,
    renderDesktopInfo,
    renderLeftContent,
    renderRightContent,
    customBottomNavbar,
    createdInfoProps,
    singleColumn,
    renderOptions,
    headerLeft,
    renderSecondaryAction,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const { open, handleOpen, handleClose } = useOpen();
    const { open: optionsOpen, handleOpen: openOptions, handleClose: closeOptions } = useOpen();

    const renderMobileHeaderRight = (
        <Box display="flex" flex-direction="row">
            <IconButton color="secondary" onClick={handleOpen}>
                <InfoOutlined />
            </IconButton>

            {!!renderOptions && (
                <IconButton color="secondary" onClick={openOptions}>
                    <MoreHorizOutlined />
                </IconButton>
            )}
        </Box>
    );

    const renderDesktopHeaderRight = (
        <>
            {renderSecondaryAction}
            {!renderDesktopInfo && (
                <IconButton color="primary" onClick={handleOpen}>
                    <InfoOutlined />
                </IconButton>
            )}
            {!!renderOptions && (
                <IconButton color="primary" onClick={openOptions}>
                    <MoreHorizOutlined />
                </IconButton>
            )}
        </>
    );

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

    const renderLeftTabPanel = (
        <TabPanel value={tabValue} index={0} flexGrow={tabValue === 0 ? '1' : '0'} display="flex">
            {renderLeftContent}
        </TabPanel>
    );

    const renderRightTabPanel = (
        <TabPanel value={tabValue} index={1} flexGrow={tabValue === 1 ? '1' : '0'} display="flex">
            {renderRightContent}
        </TabPanel>
    );

    const renderMobileContent = (
        <StyledCard className="md-down">
            {renderTabs}
            {renderLeftTabPanel}
            {renderRightTabPanel}
        </StyledCard>
    );

    const renderDesktopContent = !!singleColumn ? (
        <StyledCard className="md-up">
            <CardHeader title={title} />
            <Divider />
            {renderDesktopInfo}
            <Divider />
            {renderTabs}
            {renderLeftTabPanel}
            {renderRightTabPanel}
        </StyledCard>
    ) : (
        <Grid container className="md-up">
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    <CardHeader title={title} action={renderDesktopHeaderRight} />
                    <Divider />
                    {renderDesktopInfo}
                    {!!renderDesktopInfo && renderCreatedInfo}
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

    const renderMobileDrawer = (
        <SwipeableDrawer className="md-down" anchor="bottom" open={!!open} onOpen={handleOpen} onClose={handleClose}>
            <Paper>
                <ModalHeader title={title} onCancel={handleClose} />
                {renderCreatedInfo}
                <Divider />
                {renderMobileInfo}
            </Paper>
        </SwipeableDrawer>
    );

    const renderDesktopDrawer = (
        <SwipeableDrawer className="md-up" anchor="left" open={!!open} onOpen={handleOpen} onClose={handleClose}>
            <ModalHeader title={title} onCancel={handleClose} />
            {renderCreatedInfo}
            <Divider />
            {renderMobileInfo}
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
            {renderOptions}
        </SwipeableDrawer>
    );

    return (
        <MainLayout
            title={title}
            backUrl
            headerRight={renderMobileHeaderRight}
            headerLeft={headerLeft}
            customBottomNavbar={customBottomNavbar}
            {...props}
        >
            {renderMobileContent}
            {renderDesktopContent}
            {renderMobileDrawer}
            {renderDesktopDrawer}
            {renderMobileOptionsDrawer}
            {renderDesktopOptionsDrawer}
        </MainLayout>
    );
};
