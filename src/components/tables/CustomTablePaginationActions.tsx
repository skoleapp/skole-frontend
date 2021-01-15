import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import FirstPageOutlined from '@material-ui/icons/FirstPageOutlined';
import KeyboardArrowLeftOutlined from '@material-ui/icons/KeyboardArrowLeftOutlined';
import KeyboardArrowRightOutlined from '@material-ui/icons/KeyboardArrowRightOutlined';
import LastPageOutlined from '@material-ui/icons/LastPageOutlined';
import { useTranslation } from 'lib';
import React, { MouseEvent } from 'react';

const useStyles = makeStyles({
  root: {
    width: 'auto',
  },
});

interface Props {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (e: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

export const CustomTablePaginationActions: React.FC<Props> = ({
  count,
  page,
  rowsPerPage,
  onChangePage,
}) => {
  const classes = useStyles();
  const { t } = useTranslation();

  const handleFirstPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, 0);

  const handleBackButtonClick = (e: MouseEvent<HTMLButtonElement>): void =>
    onChangePage(e, page - 1);

  const handleNextButtonClick = (e: MouseEvent<HTMLButtonElement>): void =>
    onChangePage(e, page + 1);

  const handleLastPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
    onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  const renderFirstPageButton = (
    <Tooltip title={t('common-tooltips:firstPage')}>
      <Typography component="span">
        <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} size="small">
          <FirstPageOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderPreviousPageButton = (
    <Tooltip title={t('common-tooltips:previousPage')}>
      <Typography component="span">
        <IconButton onClick={handleBackButtonClick} disabled={page === 0} size="small">
          <KeyboardArrowLeftOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderNextPageButton = (
    <Tooltip title={t('common-tooltips:nextPage')}>
      <Typography component="span">
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          size="small"
        >
          <KeyboardArrowRightOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  const renderLastPageButton = (
    <Tooltip title={t('common-tooltips:lastPage')}>
      <Typography component="span">
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          size="small"
        >
          <LastPageOutlined />
        </IconButton>
      </Typography>
    </Tooltip>
  );

  return (
    <Grid className={classes.root} container justify="center">
      {renderFirstPageButton}
      {renderPreviousPageButton}
      {renderNextPageButton}
      {renderLastPageButton}
    </Grid>
  );
};
