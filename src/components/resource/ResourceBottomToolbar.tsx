import { Grid, makeStyles, TextField, Typography } from '@material-ui/core';
import { usePdfViewerContext } from 'context';
import React, { ChangeEvent } from 'react';
import * as R from 'ramda';
import { BORDER } from 'theme';
import { urls } from 'utils';
import { useDayjs } from 'hooks';
import { useTranslation } from 'lib';
import { CloudDownloadOutlined, StarBorderOutlined, ThumbUpOutlined } from '@material-ui/icons';
import { MuiColor } from 'types';
import { TextLink } from '../shared';

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
  icon: {
    marginLeft: spacing(3),
    marginRight: spacing(1),
  },
}));

interface Props {
  creatorId: string;
  creatorUsername: string;
  date: string;
  score: string;
  stars: string;
  downloads: string;
}

export const ResourceBottomToolbar: React.FC<Props> = ({
  creatorId,
  creatorUsername,
  date,
  score,
  stars,
  downloads,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const time = useDayjs(date).startOf('day').fromNow();

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

  const renderCreatorLink = <TextLink href={urls.user(creatorId)}>{creatorUsername}</TextLink>;

  const iconProps = {
    className: classes.icon,
    color: 'disabled' as MuiColor,
  };

  const renderScoreIcon = <ThumbUpOutlined {...iconProps} />;
  const renderStarIcon = <StarBorderOutlined {...iconProps} />;
  const renderDownloadsIcon = <CloudDownloadOutlined {...iconProps} />;

  return (
    <Grid className={classes.root} container justify="center" alignItems="center">
      <Grid item xs={5}>
        <Typography variant="body2" color="textSecondary">
          {t('common:createdBy')} {renderCreatorLink} {time}
        </Typography>
      </Grid>
      <Grid item xs={2} container alignItems="center">
        {renderPageNumberInput} {renderNumPages}
      </Grid>
      <Grid item xs={5} container justify="flex-end">
        <Typography variant="body2" color="textSecondary">
          <Grid container alignItems="center">
            {renderScoreIcon}
            {score}
            {renderStarIcon}
            {stars}
            {renderDownloadsIcon}
            {downloads}
          </Grid>
        </Typography>
      </Grid>
    </Grid>
  );
};
