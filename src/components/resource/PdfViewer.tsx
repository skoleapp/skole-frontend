import Hammer from '@egjs/hammerjs';
import { Box, Fab, Grid, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import {
    AddOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    RemoveOutlined,
    RotateRightOutlined,
} from '@material-ui/icons';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';

import { MouseSelection } from '..';
import { useDeviceContext, useNotificationsContext, usePDFViewerContext } from '../../context';
import { LTWH } from '../../types';
import { LoadingBox } from '../shared';

interface PDFViewerProps {
    file: string;
    title: string;
    renderStarButton: JSX.Element;
    renderUpVoteButton: JSX.Element | false;
    renderDownVoteButton: JSX.Element | false;
    renderMarkAreaButton: JSX.Element;
    renderDownloadButton: JSX.Element;
    renderPrintButton: JSX.Element;
    renderDrawModeContent: JSX.Element;
}

interface PageFromElement {
    node: HTMLElement;
    number: number;
}

interface PDFPage {
    scrollIntoView: () => void;
}

export const PdfViewer: React.FC<PDFViewerProps> = ({
    file,
    title,
    renderStarButton,
    renderUpVoteButton,
    renderDownVoteButton,
    renderMarkAreaButton,
    renderDownloadButton,
    renderPrintButton,
    renderDrawModeContent,
}) => {
    const {
        numPages,
        setNumPages,
        pageNumber,
        setPageNumber,
        rotate,
        drawMode,
        setScreenshot,
        scale,
        setScale,
        fullscreen,
        setFullscreen,
        handleRotate,
    } = usePDFViewerContext();

    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();
    const documentRef = useRef<Document>(null);
    const disableFullscreen = (): false | void => fullscreen && setFullscreen(false);

    const toggleFullScreen = (): void => {
        // Set scale to 75% when exiting fullscreen.
        if (fullscreen) {
            setScale(0.75);
        }

        setFullscreen(!fullscreen);
    };

    // Scale up by 10% if under limit.
    const handleScaleUp = (): void => {
        disableFullscreen();
        setScale(scale => (scale < 2.5 ? scale + 0.05 : scale));
    };

    // Scale down by 10% if over limit.
    const handleScaleDown = (): void => {
        disableFullscreen();
        setScale(scale => (scale > 0.5 ? scale - 0.05 : scale));
    };

    // Update document scale based on mouse wheel events.
    const onWheel = (e: WheelEvent): void => {
        const { ctrlKey, deltaY } = e;

        if (ctrlKey) {
            deltaY < 0 ? handleScaleUp() : handleScaleDown();
        }
    };

    useEffect(() => {
        const documentContainerNode = document.querySelector('#document-container');
        const documentNode = document.querySelector('.react-pdf__Document');

        // Update document scale based on pinch events (mobile).
        const hammer = new Hammer(documentContainerNode);
        hammer.get('pinch').set({ enable: true });
        hammer.on('pinchin', handleScaleDown);
        hammer.on('pinchout', handleScaleUp);

        if (!!documentNode) {
            documentNode.addEventListener('wheel', onWheel as EventListener);

            return (): void => {
                documentNode.removeEventListener('wheel', onWheel as EventListener);
            };
        }
    }, []);

    // Scroll into page from given page number.
    const handleChangePage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const val = Number(e.target.value);
        setPageNumber(val);
        const page: PDFPage | undefined = R.path(['pages', val - 1], documentRef.current);
        page && page.scrollIntoView();
    };

    const onDocumentLoadSuccess = (document: PDFDocumentProxy): void => {
        const { numPages } = document;
        setNumPages(numPages);
        setPageNumber(1);
    };

    // Find closest page canvas from DOM node.
    const getPageFromElement = (target: HTMLElement): PageFromElement | null => {
        const node = target.closest('.react-pdf__Page');

        if (!!(node instanceof HTMLElement)) {
            const number = Number(node.dataset.pageNumber);
            return { node, number };
        } else {
            return null;
        }
    };

    // Get closest PDF page and take screenshot of selected area.
    const getScreenshot = (target: HTMLElement, position: LTWH): string | null => {
        const canvas = target.closest('canvas');
        const { left, top, width, height } = position;
        const newCanvas = document.createElement('canvas');

        newCanvas.width = width;
        newCanvas.height = height;
        const newCanvasContext = newCanvas.getContext('2d');

        if (!!newCanvas && !!newCanvasContext && !!canvas) {
            const dpr: number = window.devicePixelRatio;
            newCanvasContext.drawImage(canvas, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
            return newCanvas.toDataURL('image/png');
        } else {
            toggleNotification(t('resource:markAreaError'));
            return null;
        }
    };

    const handleSelection = (startTarget: HTMLElement, boundingRect: LTWH): void => {
        const page = getPageFromElement(startTarget);

        if (!!page) {
            const pageBoundingRect = {
                ...boundingRect,
                top: boundingRect.top - page.node.offsetTop,
                left: boundingRect.left - page.node.offsetLeft,
            };

            const screenshot = getScreenshot(startTarget, pageBoundingRect);
            setScreenshot(screenshot);
        }
    };

    const renderPages = Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} renderTextLayer={false} />
    ));

    const renderMouseSelection = <MouseSelection onSelection={handleSelection} />;
    const renderLoading = <LoadingBox text={t('resource:loadingResource')} />;
    const renderTitle = <Typography variant="subtitle1">{title}</Typography>;

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
            inputProps={{ min: '1' }}
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
        <Tooltip title={t('resource:rotateTooltip')}>
            <IconButton size="small" color="inherit" onClick={handleRotate}>
                <RotateRightOutlined />
            </IconButton>
        </Tooltip>
    );

    const renderPreviewToolbarContent = (
        <Grid container alignItems="center">
            <Grid item xs={4} container justify="flex-start">
                {renderTitle}
            </Grid>
            <Grid item xs={4} container justify="center">
                {renderPageNumbers}
            </Grid>
            <Grid item xs={4} container justify="flex-end">
                {renderStarButton}
                {renderUpVoteButton}
                {renderDownVoteButton}
                {renderMarkAreaButton}
                {renderRotateButton}
                {renderDownloadButton}
                {renderPrintButton}
            </Grid>
        </Grid>
    );

    const renderToolbar = !isMobile && (
        <Box id="toolbar">{drawMode ? renderDrawModeContent : renderPreviewToolbarContent}</Box>
    );

    const renderDocument = (
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
            {renderMouseSelection}
        </Document>
    );

    const renderFullscreenButton = (
        <Tooltip title={fullscreen ? t('resource:exitFullscreenTooltip') : t('resource:enterFullscreenTooltip')}>
            <Fab size="small" color="secondary" onClick={toggleFullScreen}>
                {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Fab>
        </Tooltip>
    );

    const renderDownscaleButton = (
        <Tooltip title={t('resource:zoomInTooltip')}>
            <Fab size="small" color="secondary" onClick={handleScaleUp}>
                <AddOutlined />
            </Fab>
        </Tooltip>
    );

    const renderUpscaleButton = (
        <Tooltip title={t('resource:zoomOutTooltip')}>
            <Fab size="small" color="secondary" onClick={handleScaleDown}>
                <RemoveOutlined />
            </Fab>
        </Tooltip>
    );

    const renderScaleControls = !isMobile && !drawMode && (
        <Box id="pdf-controls">
            {renderFullscreenButton}
            {renderDownscaleButton}
            {renderUpscaleButton}
        </Box>
    );

    return (
        <StyledPdfViewer id="document-container" scale={scale} fullscreen={fullscreen} drawMode={drawMode}>
            {renderToolbar}
            {renderDocument}
            {renderScaleControls}
        </StyledPdfViewer>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledPdfViewer = styled(({ scale, fullscreen, drawMode, ...props }) => <Box {...props} />)`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    #toolbar {
        background-color: ${({ drawMode }): string => (drawMode ? 'var(--white)' : 'rgb(50, 54, 57)')};
        color: var(--secondary);
        padding: 0.5rem;
        border-bottom: ${({ drawMode }): string => (drawMode ? 'var(--border)' : 'none')};

        .MuiIconButton-root {
            padding: 0.25rem;
        }

        #page-numbers {
            display: flex;
            justify-content: center;
            align-items: center;

            .MuiTextField-root {
                width: 2rem;
                height: 2rem;
                background-color: rgb(38, 39, 41);
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
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: rgb(82, 86, 89);
        overflow: ${({ drawMode }): string => (drawMode ? 'hidden' : 'auto')};
        position: relative;

        .react-pdf__Page {
            position: static !important;
            margin: 0 auto;
            display: flex;

            // Automatically update width based on scale and fullscreen state.

            width: ${({ scale, fullscreen }): string => (fullscreen ? '100%' : `calc(100% * ${scale})`)};

            .react-pdf__Page__canvas {
                margin: 0 auto;
                height: auto !important;
                width: ${({ scale, fullscreen }): string => (fullscreen ? '100%' : `calc(100% * ${scale})`)} !important;
            }
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

    #pdf-controls {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        padding: 0.5rem;

        .MuiFab-root {
            margin: 0.5rem;
        }
    }
`;
