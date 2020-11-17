import { Box, IconButton, Tooltip, Typography } from '@material-ui/core';
import {
  FirstPageOutlined,
  KeyboardArrowLeftOutlined,
  KeyboardArrowRightOutlined,
  LastPageOutlined,
} from '@material-ui/icons';
import { useTranslation } from 'lib';
import React, { MouseEvent } from 'react';

interface Props {
  count: number;
  page: number;
  rowsPerPage: number;
  onChangePage: (
    e: MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => void;
}

export const CustomTablePaginationActions: React.FC<Props> = ({
  count,
  page,
  rowsPerPage,
  onChangePage,
}) => {
  const { t } = useTranslation();
  const handleFirstPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void =>
    onChangePage(e, 0);
  const handleBackButtonClick = (e: MouseEvent<HTMLButtonElement>): void =>
    onChangePage(e, page - 1);
  const handleNextButtonClick = (e: MouseEvent<HTMLButtonElement>): void =>
    onChangePage(e, page + 1);

  const handleLastPageButtonClick = (
    e: MouseEvent<HTMLButtonElement>
  ): void => {
    onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box display="flex" margin="0.5rem">
      <Tooltip title={t('tooltips:firstPage')}>
        <Typography component="span">
          <IconButton
            onClick={handleFirstPageButtonClick}
            disabled={page === 0}
            size="small"
          >
            <FirstPageOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
      <Tooltip title={t('tooltips:previousPage')}>
        <Typography component="span">
          <IconButton
            onClick={handleBackButtonClick}
            disabled={page === 0}
            size="small"
          >
            <KeyboardArrowLeftOutlined />
          </IconButton>
        </Typography>
      </Tooltip>
      <Tooltip title={t('tooltips:nextPage')}>
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
      <Tooltip title={t('tooltips:lastPage')}>
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
    </Box>
  );
};
