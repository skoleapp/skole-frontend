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
import { InfoOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { LayoutProps } from '../../types';
import { DiscussionBoxProps } from '../../types';
import { useOpen, useTabs } from '../../utils';
import { DiscussionBox, ModalHeader, StyledCard, TabPanel, TextLink } from '../shared';
import { MainLayout } from './MainLayout';

interface Props extends LayoutProps {
    tabLabel: string;
    renderMobileInfo?: JSX.Element;
    renderDesktopInfo?: JSX.Element;
    renderMainContent: JSX.Element;
    discussionBoxProps: DiscussionBoxProps;
    customBottomNavbar?: JSX.Element;
    createdInfoProps?: {
        creatorId: string;
        creatorName: string;
        created: string;
    };
}

export const DiscussionLayout: React.FC<Props> = ({
    title,
    tabLabel,
    renderMobileInfo,
    renderDesktopInfo,
    renderMainContent,
    discussionBoxProps,
    customBottomNavbar,
    createdInfoProps,
    ...props
}) => {
    const { tabValue, handleTabChange } = useTabs();
    const { t } = useTranslation();
    const { open, handleOpen, handleClose } = useOpen();

    const renderMobileHeaderRight = (
        <IconButton color="secondary" onClick={handleOpen}>
            <InfoOutlined />
        </IconButton>
    );

    const renderDesktopHeaderRight = (
        <IconButton color="primary" onClick={handleOpen}>
            <InfoOutlined />
        </IconButton>
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

    const renderMobileContent = (
        <Grid container className="md-down">
            <StyledCard>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="primary"
                    textColor="primary"
                    variant="fullWidth"
                >
                    <Tab label={tabLabel} />
                    <Tab label={t('common:discussion')} />
                </Tabs>
                <TabPanel value={tabValue} index={0} flexGrow={tabValue === 0 ? '1' : '0'} display="flex">
                    {renderMainContent}
                </TabPanel>
                <TabPanel value={tabValue} index={1} flexGrow={tabValue === 1 ? '1' : '0'} display="flex">
                    <DiscussionBox {...discussionBoxProps} />
                </TabPanel>
            </StyledCard>
        </Grid>
    );

    const renderDesktopContent = (
        <Grid container className="md-up">
            <Grid item container xs={12} md={7} lg={8}>
                <StyledCard>
                    <CardHeader title={title} action={!renderDesktopInfo && renderDesktopHeaderRight} />
                    {renderDesktopInfo}
                    <Divider />
                    {renderMainContent}
                </StyledCard>
            </Grid>
            <Grid item container xs={12} md={5} lg={4}>
                <StyledCard marginLeft>
                    <CardHeader title={t('common:discussion')} />
                    <Divider />
                    <DiscussionBox {...discussionBoxProps} />
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

    return (
        <MainLayout
            title={title}
            backUrl
            headerRight={renderMobileHeaderRight}
            customBottomNavbar={customBottomNavbar}
            {...props}
        >
            {renderMobileContent}
            {renderDesktopContent}
            {renderMobileDrawer}
            {renderDesktopDrawer}
        </MainLayout>
    );
};
