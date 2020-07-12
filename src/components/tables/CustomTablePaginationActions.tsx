import { Box, IconButton, Tooltip } from '@material-ui/core';
import {
    FirstPageOutlined,
    KeyboardArrowLeftOutlined,
    KeyboardArrowRightOutlined,
    LastPageOutlined,
} from '@material-ui/icons';
import { useResponsiveIconButtonProps } from 'hooks';
import React, { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
    count: number;
    page: number;
    rowsPerPage: number;
    onChangePage: (e: MouseEvent<HTMLButtonElement> | null, newPage: number) => void;
}

export const CustomTablePaginationActions: React.FC<Props> = ({ count, page, rowsPerPage, onChangePage }) => {
    const { t } = useTranslation();
    const { size } = useResponsiveIconButtonProps();
    const handleFirstPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, 0);
    const handleBackButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, page - 1);
    const handleNextButtonClick = (e: MouseEvent<HTMLButtonElement>): void => onChangePage(e, page + 1);

    const handleLastPageButtonClick = (e: MouseEvent<HTMLButtonElement>): void => {
        onChangePage(e, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
    };

    return (
        <Box display="flex" margin="0.5rem">
            <Tooltip title={t('tooltips:firstPage')}>
                <span>
                    <IconButton onClick={handleFirstPageButtonClick} disabled={page === 0} size={size}>
                        <FirstPageOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:previousPage')}>
                <span>
                    <IconButton onClick={handleBackButtonClick} disabled={page === 0} size={size}>
                        <KeyboardArrowLeftOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:nextPage')}>
                <span>
                    <IconButton
                        onClick={handleNextButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        size={size}
                    >
                        <KeyboardArrowRightOutlined />
                    </IconButton>
                </span>
            </Tooltip>
            <Tooltip title={t('tooltips:lastPage')}>
                <span>
                    <IconButton
                        onClick={handleLastPageButtonClick}
                        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                        size={size}
                    >
                        <LastPageOutlined />
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    );
};
