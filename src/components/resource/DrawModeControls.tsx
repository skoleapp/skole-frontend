import { Button, Grid, Typography } from '@material-ui/core';
import { CancelOutlined, KeyboardArrowRightOutlined } from '@material-ui/icons';
import { useDeviceContext, useDiscussionContext, usePDFViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawModeControls: React.FC = () => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const colWidth = isMobile ? 6 : 5;
    const { setDrawMode, screenshot } = usePDFViewerContext();
    const { toggleCommentModal } = useDiscussionContext();
    const handleCancelButtonClick = (): void => setDrawMode(false);

    const handleContinueButtonClick = (): void => {
        setDrawMode(false);
        toggleCommentModal(true);
    };

    const renderCancelButton = (
        <Grid item xs={colWidth} container justify="flex-start">
            <Button
                onClick={handleCancelButtonClick}
                startIcon={<CancelOutlined />}
                color={isMobile ? 'default' : 'secondary'}
            >
                {t('common:cancel')}
            </Button>
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
                endIcon={<KeyboardArrowRightOutlined />}
                disabled={!screenshot}
                color={isMobile ? 'primary' : 'secondary'}
            >
                {t('common:continue')}
            </Button>
        </Grid>
    );

    return (
        <Grid container alignItems="center">
            {renderCancelButton}
            {renderHeader}
            {renderContinueButton}
        </Grid>
    );
};
