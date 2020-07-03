import { Box, Grid, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import { RotateRightOutlined } from '@material-ui/icons';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as R from 'ramda';
import React, { ChangeEvent, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { LoadingBox } from '../shared';
import { AreaSelection, MapInteractionCSS } from '.';

interface PDFViewerProps {
    file: string;
    title: string;
    renderMarkAreaButton: JSX.Element;
    renderDrawModeContent: JSX.Element;
    renderDownloadButton: JSX.Element;
    renderPrintButton: JSX.Element;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
    file,
    title,
    renderMarkAreaButton,
    renderDrawModeContent,
    renderDownloadButton,
    renderPrintButton,
}) => {
    const { drawMode, rotate, setRotate } = usePDFViewerContext();
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const documentRef = useRef<Document>(null);
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);
    const handleRotateButtonClick = (): void => (rotate === 270 ? setRotate(0) : setRotate(rotate + 90));

    // Scroll into page from given page number.
    const handleChangePage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const val = Number(e.target.value);
        setPageNumber(val);
        const page: HTMLDivElement | undefined = R.path(['pages', val - 1], documentRef.current);
        page && page.scrollIntoView(); // TODO: Find a way to use the `smooth` behavior.
        window.scrollTo(0, 0); // Prevent window scrolling.
    };

    const onDocumentLoadSuccess = (document: PDFDocumentProxy): void => {
        const { numPages } = document;
        setNumPages(numPages);
        setPageNumber(1);
    };

    const renderPages = Array.from(new Array(numPages), (_, i) => (
        <Page key={`page_${i + 1}`} pageNumber={i + 1} renderTextLayer={false} />
    ));

    const renderAreaSelection = <AreaSelection />;
    const renderLoading = <LoadingBox text={t('resource:loadingResource')} />;

    const renderError = (
        <Box flexGrow="1" display="flex" justifyContent="center" alignItems="center">
            <Typography variant="body2" color="textSecondary">
                {t('resource:errorLoadingResource')}
            </Typography>
        </Box>
    );

    const renderPageNumberInput = (
        <TextField
            value={pageNumber}
            onChange={handleChangePage}
            type="number"
            color="secondary"
            inputProps={{ min: 1, max: numPages }}
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

    const renderRotateButton = (
        <Tooltip title={t('tooltips:rotate')}>
            <IconButton size="small" color="inherit" onClick={handleRotateButtonClick}>
                <RotateRightOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderResourceTitle = (
        <Typography className="custom-header-text truncate" variant="subtitle1">
            {title}
        </Typography>
    );

    const renderPreviewToolbarContent = (
        <Grid container>
            <Grid item xs={5} container justify="flex-start" alignItems="center">
                {renderResourceTitle}
            </Grid>
            <Grid item xs={2} container justify="center" alignItems="center">
                {renderPageNumbers}
            </Grid>
            <Grid item xs={5} container justify="flex-end" alignItems="center">
                {renderMarkAreaButton}
                {renderRotateButton}
                {renderDownloadButton}
                {renderPrintButton}
            </Grid>
        </Grid>
    );

    const renderToolbar = !isMobile && (
        <Box id="toolbar" className="custom-header">
            {drawMode ? renderDrawModeContent : renderPreviewToolbarContent}
        </Box>
    );

    const renderDocument = (
        <MapInteractionCSS>
            <Document
                file={file}
                onLoadSuccess={onDocumentLoadSuccess}
                loading={renderLoading}
                error={renderError}
                noData={renderError}
                rotate={rotate}
                ref={documentRef}
            >
                {renderPages}
                {renderAreaSelection}
            </Document>
        </MapInteractionCSS>
    );

    return (
        <StyledPDFViewer>
            {renderToolbar}
            {renderDocument}
        </StyledPDFViewer>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledPDFViewer = styled(Box)`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    #toolbar {
        background-color: var(--gray);
        color: var(--secondary);

        #page-numbers {
            display: flex;
            justify-content: center;
            align-items: center;

            .MuiTextField-root {
                width: 2rem;
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
    }

    .react-pdf__Document {
        display: flex;
        flex-direction: column;
        align-items: center;

        .react-pdf__Page,
        .react-pdf__Page__canvas {
            margin: 0 auto !important;
            height: auto !important;
            width: 100% !important;
        }

        .react-pdf__message--loading,
        .react-pdf__message--no-data,
        .react-pdf__message--error {
            height: 100%;
            width: 100%;
            background-color: var(--white);
            display: flex;
        }
    }
`;
