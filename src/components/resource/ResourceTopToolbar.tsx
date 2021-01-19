import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { Size } from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import PrintOutlined from '@material-ui/icons/PrintOutlined';
import clsx from 'clsx';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React, { SyntheticEvent } from 'react';
import { BORDER } from 'theme';

import { BackButton } from '../shared';
import { DrawModeButton } from './DrawModeButton';
import { DrawModeControls } from './DrawModeControls';
import { RotateButton } from './RotateButton';

const useStyles = makeStyles({
  root: {
    width: '100%',
    borderBottom: BORDER,
  },
});

interface Props {
  title: string;
  handleDownloadButtonClick: (e: SyntheticEvent) => Promise<void>;
  handlePrintButtonClick: (e: SyntheticEvent) => Promise<void>;
}

export const ResourceTopToolbar: React.FC<Props> = ({
  title,
  handleDownloadButtonClick,
  handlePrintButtonClick,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { drawingMode, controlsDisabled } = usePdfViewerContext();

  const renderDrawModeButton = <DrawModeButton />;
  const renderDrawModeControls = <DrawModeControls />;
  const renderRotateButton = <RotateButton />;
  const renderBackButton = <BackButton className="MuiCardHeader-avatar" />;

  const toolbarButtonProps = {
    size: 'small' as Size,
    disabled: controlsDisabled,
  };

  const renderDownloadButton = (
    <Tooltip title={t('resource-tooltips:downloadPdf')}>
      <Typography component="span">
        <IconButton {...toolbarButtonProps} onClick={handleDownloadButtonClick}>
          <CloudDownloadOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderPrintButton = (
    <Tooltip title={t('resource-tooltips:printPdf')}>
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

  const renderDefaultToolbarControls = (
    <Grid container>
      <Grid item xs={8} lg={9} xl={10} container justify="flex-start" alignItems="center">
        {renderBackButton}
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

  const renderControls = drawingMode ? renderDrawModeControls : renderDefaultToolbarControls;
  return <Box className={clsx('MuiCardHeader-root', classes.root)}>{renderControls}</Box>;
};
