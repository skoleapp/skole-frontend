import { Button, Grid, IconButton, makeStyles, Typography } from '@material-ui/core';
import { ArrowForwardOutlined, ClearOutlined } from '@material-ui/icons';
import { useDiscussionContext, usePdfViewerContext } from 'context';
import { useMediaQueries } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

const useStyles = makeStyles(({ spacing }) => ({
  button: {
    padding: spacing(1),
  },
}));

export const DrawModeControls: React.FC = () => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { isMobileOrTablet } = useMediaQueries();
  const colWidth = isMobileOrTablet ? 6 : 5;
  const { setDrawMode, screenshot } = usePdfViewerContext();
  const { toggleCommentModal } = useDiscussionContext();
  const handleExitButtonClick = (): void => setDrawMode(false);

  const handleContinueButtonClick = (): void => {
    setDrawMode(false);
    toggleCommentModal(true);
  };

  const renderExitButton = (
    <Grid item xs={colWidth} container justify="flex-start">
      <IconButton
        onClick={handleExitButtonClick}
        size="small"
        color={isMobileOrTablet ? 'default' : 'secondary'}
      >
        <ClearOutlined />
      </IconButton>
    </Grid>
  );

  const renderHeader = !isMobileOrTablet && (
    <Grid item xs={2}>
      <Typography variant="subtitle1">{t('resource:drawMode')}</Typography>
    </Grid>
  );

  const renderContinueButton = (
    <Grid item xs={colWidth} container justify="flex-end">
      <Button
        className={classes.button}
        onClick={handleContinueButtonClick}
        endIcon={<ArrowForwardOutlined />}
        disabled={!screenshot}
        color={isMobileOrTablet ? 'primary' : 'secondary'}
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
