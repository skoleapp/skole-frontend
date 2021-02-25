import FormHelperText from '@material-ui/core/FormHelperText';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { usePdfViewerContext } from 'context';
import useTranslation from 'next-translate/useTranslation';
import * as R from 'ramda';
import React, { ChangeEvent } from 'react';
import { BORDER } from 'styles';

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
  const { t } = useTranslation();

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

  const renderHelperText = <FormHelperText>{t('resource:pdfViewerHelperText')}</FormHelperText>;

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
    <Grid className={classes.root} container alignItems="center">
      <Grid item xs={4}>
        {renderHelperText}
      </Grid>
      <Grid item xs={4} container justify="center" alignItems="center">
        {renderPageNumberInput} {renderNumPages}
      </Grid>
      <Grid item xs={4} />
    </Grid>
  );
};
