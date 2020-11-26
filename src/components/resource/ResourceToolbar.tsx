import {
  Box,
  Grid,
  IconButton,
  makeStyles,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import { CloudDownloadOutlined, PrintOutlined } from '@material-ui/icons';
import clsx from 'clsx';
import { usePdfViewerContext } from 'context';
import { useTranslation } from 'lib';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent } from 'react';

// import { DrawModeButton } from './DrawModeButton';
import { DrawModeControls } from './DrawModeControls';
import { RotateButton } from './RotateButton';

const useStyles = makeStyles(({ palette, spacing }) => ({
  root: {
    color: palette.secondary.main,
    width: '100%',
    backgroundColor: palette.grey[800],
  },
  pageNumbers: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberInputRoot: {
    width: '2.5rem',
    backgroundColor: palette.grey[900],
    margin: `0 ${spacing(1)} 0 0`,
    borderRadius: '0.25rem',
  },
  pageNumberInput: {
    height: '2rem',
    padding: 0,
    paddingLeft: spacing(1),
    color: palette.secondary.main,
  },
  numPages: {
    color: palette.secondary.main,
    paddingLeft: spacing(1),
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

  const {
    pageNumberInputRef,
    pageNumber,
    numPages,
    setPageNumber,
    drawMode,
    documentRef,
    controlsDisabled,
  } = usePdfViewerContext();

  // Scroll into page from given page number.
  // FIXME: Providing a custom value in the input won't work atm.
  const handleChangePage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const val = Number(e.target.value);
    !!val && setPageNumber(val);
    const page: HTMLDivElement | undefined = R.path(['current', 'pages', val - 1], documentRef);
    !!page &&
      page.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start',
      });
  };

  const renderPageNumberInput = (
    <TextField
      classes={{ root: classes.pageNumberInputRoot }}
      value={pageNumber}
      onChange={handleChangePage}
      type="number"
      color="secondary"
      inputProps={{ min: 1, max: numPages, ref: pageNumberInputRef }}
      InputProps={{ className: classes.pageNumberInput }}
      disabled={controlsDisabled}
      variant="standard"
    />
  );

  const renderNumPages = (
    <Typography className={classes.numPages} variant="subtitle1">
      {numPages}
    </Typography>
  );

  const renderPageNumbers = (
    <Box className={classes.pageNumbers}>
      {renderPageNumberInput} / {renderNumPages}
    </Box>
  );

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
      <Grid item xs={5} container justify="flex-start" alignItems="center">
        {renderResourceTitle}
      </Grid>
      <Grid item xs={2} container justify="center" alignItems="center">
        {renderPageNumbers}
      </Grid>
      <Grid item xs={5} container justify="flex-end" alignItems="center">
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
