import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import { Size } from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import ArrowBackOutlined from '@material-ui/icons/ArrowBackOutlined';
import CloudDownloadOutlined from '@material-ui/icons/CloudDownloadOutlined';
import PrintOutlined from '@material-ui/icons/PrintOutlined';
import clsx from 'clsx';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';
import { BORDER } from 'styles';
import { urls } from 'utils';

import { Emoji, Link } from '../shared';
import { DrawingModeButton } from './DrawingModeButton';
import { DrawingModeControls } from './DrawingModeControls';
import { RotateButton } from './RotateButton';

const useStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    width: '100%',
    borderBottom: BORDER,
  },
  backButton: {
    marginRight: spacing(2),
  },
  cardHeaderTitle: {
    color: palette.text.secondary,
    flexGrow: 1,
  },
}));

interface Props {
  title: string;
  emoji: string;
  courseSlug: string;
  renderStarButton: JSX.Element | false;
  renderUpvoteButton: JSX.Element | false;
  renderScore: JSX.Element | false;
  renderDownvoteButton: JSX.Element | false;
  handleDownloadButtonClick: () => Promise<void>;
  handlePrintButtonClick: () => Promise<void>;
}

export const ResourceTopToolbar: React.FC<Props> = ({
  title,
  emoji,
  courseSlug,
  renderStarButton,
  renderUpvoteButton,
  renderScore,
  renderDownvoteButton,
  handleDownloadButtonClick,
  handlePrintButtonClick,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { drawingMode, controlsDisabled } = usePdfViewerContext();

  const renderDrawingModeButton = <DrawingModeButton />;
  const renderDrawingModeControls = <DrawingModeControls />;
  const renderRotateButton = <RotateButton />;

  const renderBackButton = (
    <Link href={urls.course(courseSlug)}>
      <Tooltip title={t('resource-tooltips:backToCourse')}>
        <IconButton className={classes.backButton} size="small">
          <ArrowBackOutlined />
        </IconButton>
      </Tooltip>
    </Link>
  );

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

  const renderEmoji = <Emoji emoji={emoji} />;

  const renderResourceTitle = (
    <Typography
      className={clsx('MuiCardHeader-title', classes.cardHeaderTitle, 'truncate-text')}
      variant="h5"
      align="left"
    >
      {title}
      {renderEmoji}
    </Typography>
  );

  const renderDefaultToolbarControls = (
    <Grid container wrap="nowrap" alignItems="center">
      {renderBackButton}
      {renderResourceTitle}
      {renderStarButton}
      {renderUpvoteButton}
      {renderScore}
      {renderDownvoteButton}
      {renderDrawingModeButton}
      {renderRotateButton}
      {renderDownloadButton}
      {renderPrintButton}
    </Grid>
  );

  const renderControls = drawingMode ? renderDrawingModeControls : renderDefaultToolbarControls;
  return <Box className={clsx('MuiCardHeader-root', classes.root)}>{renderControls}</Box>;
};
