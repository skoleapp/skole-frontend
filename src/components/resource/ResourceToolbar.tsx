import { Box, Grid, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import { CloudDownloadOutlined, PrintOutlined, RotateRightOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React, { ChangeEvent, SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { usePDFViewerContext } from 'src/context';
import styled from 'styled-components';

import { DrawModeButton, DrawModeControls } from '.';

interface Props {
    title: string;
    handleDownloadButtonClick: (e: SyntheticEvent) => Promise<void>;
    handlePrintButtonClick: (e: SyntheticEvent) => Promise<void>;
}

export const ResourceToolbar: React.FC<Props> = ({ title, handleDownloadButtonClick, handlePrintButtonClick }) => {
    const { t } = useTranslation();

    const {
        pageNumber,
        numPages,
        setPageNumber,
        rotate,
        setRotate,
        drawMode,
        documentRef,
        documentLoaded,
    } = usePDFViewerContext();

    const disabled = !documentLoaded;
    const handleRotateButtonClick = (): void => (rotate === 270 ? setRotate(0) : setRotate(rotate + 90));

    // Scroll into page from given page number.
    const handleChangePage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const val = Number(e.target.value);
        setPageNumber(val);
        const page: HTMLDivElement | undefined = R.path(['current', 'pages', val - 1], documentRef);
        page && page.scrollIntoView(); // TODO: Find a way to use the `smooth` behavior.
        window.scrollTo(0, 0); // Prevent window scrolling.
    };

    const renderPageNumberInput = (
        <TextField
            value={pageNumber}
            onChange={handleChangePage}
            type="number"
            color="secondary"
            inputProps={{ min: 1, max: numPages }}
            disabled={disabled}
        />
    );

    const renderNumPages = (
        <Typography id="num-pages" variant="subtitle1">
            {numPages}
        </Typography>
    );

    const renderPageNumbers = (
        <Box id="page-numbers">
            {renderPageNumberInput} / {renderNumPages}
        </Box>
    );

    const renderDrawModeButton = <DrawModeButton />;
    const renderDrawModeControls = <DrawModeControls />;

    const renderDownloadButton = (
        <Tooltip title={t('tooltips:download')}>
            <span>
                <IconButton onClick={handleDownloadButtonClick} size="small" color="secondary" disabled={disabled}>
                    <CloudDownloadOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderPrintButton = (
        <Tooltip title={t('tooltips:print')}>
            <span>
                <IconButton onClick={handlePrintButtonClick} size="small" color="secondary" disabled={disabled}>
                    <PrintOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderRotateButton = (
        <Tooltip title={t('tooltips:rotate')}>
            <span>
                <IconButton size="small" color="inherit" onClick={handleRotateButtonClick} disabled={disabled}>
                    <RotateRightOutlined />
                </IconButton>
            </span>
        </Tooltip>
    );

    const renderResourceTitle = (
        <Typography className="custom-header-text truncate" variant="subtitle1">
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
                {renderDrawModeButton}
                {renderRotateButton}
                {renderDownloadButton}
                {renderPrintButton}
            </Grid>
        </Grid>
    );

    return (
        <StyledToolbar className="custom-header">
            {drawMode ? renderDrawModeControls : renderPreviewToolbarControls}
        </StyledToolbar>
    );
};

const StyledToolbar = styled(Box)`
    background-color: var(--gray);
    color: var(--secondary);
    width: 100%;

    #page-numbers {
        display: flex;
        justify-content: center;
        align-items: center;

        .MuiTextField-root {
            width: 2.5rem;
            height: 2rem;
            background-color: var(--gray-dark);
            margin: 0 0.25rem 0 0;
            border-radius: 0.1rem;

            .MuiInputBase-root {
                color: var(--white) !important;
            }
        }

        #num-pages {
            margin-left: 0.25rem;
        }
    }
`;
