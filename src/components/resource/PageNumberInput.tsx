import { Box, makeStyles, TextField, Typography } from '@material-ui/core';
import { usePdfViewerContext } from 'context';
import React, { ChangeEvent } from 'react';
import * as R from 'ramda';

const useStyles = makeStyles(({ spacing }) => ({
  pageNumbers: {
    position: 'absolute',
    bottom: '-2.5rem',
    left: 0,
    right: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageNumberInputRoot: {
    width: '2.5rem',
    margin: `0 ${spacing(1)} 0 0`,
    borderRadius: '0.25rem',
  },
  pageNumberInput: {
    height: '2rem',
    padding: 0,
    paddingLeft: spacing(1),
  },
  numPages: {
    paddingLeft: spacing(1),
  },
}));

export const PageNumberInput: React.FC = () => {
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
      classes={{ root: classes.pageNumberInputRoot }}
      value={pageNumber}
      onChange={handleChangePage}
      type="number"
      inputProps={{ min: 1, max: numPages, ref: pageNumberInputRef }}
      InputProps={{ className: classes.pageNumberInput }}
      disabled={controlsDisabled}
      variant="standard"
    />
  );

  const renderNumPages = (
    <Typography className={classes.numPages} variant="subtitle1" color="textSecondary">
      / {numPages}
    </Typography>
  );

  return (
    <Box className={classes.pageNumbers}>
      {renderPageNumberInput} {renderNumPages}
    </Box>
  );
};
