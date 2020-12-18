import { Box, Grid, IconButton, makeStyles, Tooltip, Typography } from '@material-ui/core';
import { CloudDownloadOutlined, PrintOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';

// import { DrawModeButton } from './DrawModeButton';
import { DrawModeControls } from './DrawModeControls';
import { RotateButton } from './RotateButton';

const useStyles = makeStyles(({ palette }) => ({
  root: {
    color: palette.secondary.main,
    width: '100%',
    backgroundColor: palette.grey[800],
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
  //   const renderDrawModeButton = <DrawModeButton />;
  const renderDrawModeControls = <DrawModeControls />;
  const renderRotateButton = <RotateButton />;

  const renderDownloadButton = (
    <Tooltip title={t('tooltips:download')}>
      <Typography component="span">
        <IconButton
          onClick={handleDownloadButtonClick}
          size="small"
          color="secondary"
          disabled={controlsDisabled}
        >
          <CloudDownloadOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderPrintButton = (
    <Tooltip title={t('tooltips:print')}>
      <Typography component="span">
        <IconButton
          onClick={handlePrintButtonClick}
          size="small"
          color="secondary"
          disabled={controlsDisabled}
        >
          <PrintOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderResourceTitle = (
    <Typography className="truncate-text" variant="subtitle1">
      {title}
    </Typography>
  );

  const renderPreviewToolbarControls = (
    <Grid container>
      <Grid item xs={8} lg={9} xl={10} container justify="flex-start" alignItems="center">
        {renderResourceTitle}
      </Grid>
      <Grid item xs={4} lg={3} xl={2} container justify="flex-end" alignItems="center">
        {/* {renderDrawModeButton} Hidden for now. */}
        {renderRotateButton}
        {renderDownloadButton}
        {renderPrintButton}
      </Grid>
    </Grid>
  );

  return (
    <Box className={clsx('MuiCardHeader-root', classes.root)}>
      {drawMode ? renderDrawModeControls : renderPreviewToolbarControls}
    </Box>
  );
};
