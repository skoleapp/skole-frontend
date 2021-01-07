import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { usePdfViewerContext } from 'context';
import React, { ChangeEvent } from 'react';
import * as R from 'ramda';
import { BORDER } from 'theme';

const useStyles = makeStyles(({ spacing }) => ({
  root: {
    borderTop: BORDER,
    padding: `${spacing(3)} ${spacing(4)}`,
  },
  pageNumberInput: {
    margin: 0,
    marginRight: spacing(2),
  },
  pageNumberInputProps: {
    padding: spacing(2),
  },
}));

export const ResourceBottomToolbar: React.FC = () => {
  const classes = useStyles();

  const {
    setPageNumber,
    documentRef,
    pageNumber,
    numPages,
    pageNumberInputRef,
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
      className={classes.pageNumberInput}
      value={pageNumber}
      onChange={handleChangePage}
      type="number"
      inputProps={{
        className: classes.pageNumberInputProps,
        min: 1,
        max: numPages,
        ref: pageNumberInputRef,
      }}
      disabled={controlsDisabled}
      fullWidth={false}
    />
  );

  const renderNumPages = (
    <Typography variant="subtitle1" color="textSecondary">
      / {numPages}
    </Typography>
  );

  return (
    <Grid className={classes.root} container justify="center" alignItems="center">
      {renderPageNumberInput} {renderNumPages}
    </Grid>
  );
};
