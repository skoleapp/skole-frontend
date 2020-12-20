import { Box, Grid, IconButton, makeStyles, Size, Tooltip, Typography } from '@material-ui/core';
import { CloudDownloadOutlined, PrintOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { BORDER } from 'theme';

import { DrawModeButton } from './DrawModeButton';
import { DrawModeControls } from './DrawModeControls';
import { RotateButton } from './RotateButton';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    width: '100%',
    borderBottom: BORDER,
  },
  drawMode: {
    // The left-most item is usually text, which looks good on the default padding.
    // During draw mode however, the left-most item is a button which looks better with a custom padding.
    paddingLeft: spacing(2),
  },
}));

interface Props {
  title: string;
  handleDownloadButtonClick: (e: SyntheticEvent) => Promise<void>;
  handlePrintButtonClick: (e: SyntheticEvent) => Promise<void>;
}

export const ResourceToolbar: React.FC<Props> = ({
  title,
  handleDownloadButtonClick,
  handlePrintButtonClick,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { drawMode, controlsDisabled } = usePdfViewerContext();
  const renderDrawModeButton = <DrawModeButton />;
  const renderDrawModeControls = <DrawModeControls />;
  const renderRotateButton = <RotateButton />;

  const toolbarButtonProps = {
    size: 'small' as Size,
    disabled: controlsDisabled,
  };

  const renderDownloadButton = (
    <Tooltip title={t('tooltips:downloadPdf')}>
      <Typography component="span">
        <IconButton {...toolbarButtonProps} onClick={handleDownloadButtonClick}>
          <CloudDownloadOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderPrintButton = (
    <Tooltip title={t('tooltips:printPdf')}>
      <Typography component="span">
        <IconButton {...toolbarButtonProps} onClick={handlePrintButtonClick}>
          <PrintOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderResourceTitle = (
    <Typography className={clsx('MuiCardHeader-title', 'truncate-text')} variant="h5">
      {title}
    </Typography>
  );

  const renderPreviewToolbarControls = (
    <Grid container>
      <Grid item xs={8} lg={9} xl={10} container justify="flex-start" alignItems="center">
        {renderResourceTitle}
      </Grid>
      <Grid item xs={4} lg={3} xl={2} container justify="flex-end" alignItems="center">
        {renderDrawModeButton}
        {renderRotateButton}
        {renderDownloadButton}
        {renderPrintButton}
      </Grid>
    </Grid>
  );

  return (
    <Box className={clsx('MuiCardHeader-root', classes.root, drawMode && classes.drawMode)}>
      {drawMode ? renderDrawModeControls : renderPreviewToolbarControls}
    </Box>
  );
};
