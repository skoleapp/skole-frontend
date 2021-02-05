import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ArrowForwardOutlined from '@material-ui/icons/ArrowForwardOutlined';
import ClearOutlined from '@material-ui/icons/ClearOutlined';
import { useDiscussionContext, usePdfViewerContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { Emoji, SkoleButton } from '../shared';

export const DrawingModeControls: React.FC = () => {
  const { t } = useTranslation();
  const { isTabletOrDesktop } = useMediaQueries();
  const { setDrawingMode, screenshot, setScreenshot } = usePdfViewerContext();
  const { setCreateCommentDialogOpen } = useDiscussionContext();

  const handleExitButtonClick = (): void => {
    setDrawingMode(false);
    setScreenshot(null);
  };

  const handleContinueButtonClick = (): void => {
    setDrawingMode(false);
    setCreateCommentDialogOpen(true);
  };

  const renderExitButton = (
    <Grid item xs={6} md={2} container justify="flex-start">
      <Tooltip title={t('resource-tooltips:exitDrawingMode')}>
        <IconButton onClick={handleExitButtonClick} size="small">
          <ClearOutlined />
        </IconButton>
      </Tooltip>
    </Grid>
  );

  const renderHeader = isTabletOrDesktop && (
    <Grid item md={8}>
      <Typography className="MuiCardHeader-title" variant="h5">
        {t('resource:drawingMode')}
        <Emoji emoji="✏️" />
      </Typography>
    </Grid>
  );

  const renderContinueButton = (
    <Grid item xs={6} md={2} container justify="flex-end">
      <SkoleButton
        onClick={handleContinueButtonClick}
        endIcon={<ArrowForwardOutlined />}
        disabled={!screenshot}
        size="small"
      >
        {t('common:continue')}
      </SkoleButton>
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
