import { Button, Grid, IconButton, Tooltip, Typography } from '@material-ui/core';
import { ArrowForwardOutlined, ClearOutlined } from '@material-ui/icons';
import { useDiscussionContext, usePdfViewerContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

export const DrawModeControls: React.FC = () => {
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { setDrawMode, screenshot, setScreenshot } = usePdfViewerContext();
  const { toggleCommentModal } = useDiscussionContext();

  const handleExitButtonClick = (): void => {
    setDrawMode(false);
    setScreenshot(null);
  };

  const handleContinueButtonClick = (): void => {
    setDrawMode(false);
    toggleCommentModal(true);
  };

  const renderExitButton = (
    <Grid item xs={6} md={2} container justify="flex-start">
      <Tooltip title={t('resource-tooltips:exitDrawMode')}>
        <IconButton onClick={handleExitButtonClick} size="small">
          <ClearOutlined />
        </IconButton>
      </Tooltip>
    </Grid>
  );

  const renderHeader = isTabletOrDesktop && (
    <Grid item md={8}>
      <Typography className="MuiCardHeader-title" variant="h5">
        {t('resource:drawMode')}
      </Typography>
    </Grid>
  );

  const renderContinueButton = (
    <Grid item xs={6} md={2} container justify="flex-end">
      <Button
        onClick={handleContinueButtonClick}
        endIcon={<ArrowForwardOutlined />}
        disabled={!screenshot}
        color="primary"
        size="small"
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
