import { Button, Grid, IconButton, Typography } from '@material-ui/core';
import { ArrowForwardOutlined, ClearOutlined } from '@material-ui/icons';
import { useDeviceContext, useDiscussionContext, usePDFViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawModeControls: React.FC = () => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const colWidth = isMobile ? 6 : 5;
    const { setDrawMode, screenshot } = usePDFViewerContext();
    const { toggleCommentModal } = useDiscussionContext();
    const handleExitButtonClick = (): void => setDrawMode(false);

    const handleContinueButtonClick = (): void => {
        setDrawMode(false);
        toggleCommentModal(true);
    };

    const renderExitButton = (
        <Grid item xs={colWidth} container justify="flex-start">
            <IconButton onClick={handleExitButtonClick} size="small" color={isMobile ? 'default' : 'secondary'}>
                <ClearOutlined />
            </IconButton>
        </Grid>
    );

    const renderHeader = !isMobile && (
        <Grid item xs={2}>
            <Typography variant="subtitle1">{t('resource:drawMode')}</Typography>
        </Grid>
    );

    const renderContinueButton = (
        <Grid item xs={colWidth} container justify="flex-end">
            <Button
                onClick={handleContinueButtonClick}
                endIcon={<ArrowForwardOutlined />}
                disabled={!screenshot}
                color={isMobile ? 'primary' : 'secondary'}
            >
                {t('common:continue')}
            </Button>
        </Grid>
    );

    return (
        <Grid container alignItems="center">
            {renderExitButton}
            {renderHeader}
            {renderContinueButton}
        </Grid>
    );
};
