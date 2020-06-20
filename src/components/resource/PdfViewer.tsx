import { Box, Fab, Grid, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import {
    AddOutlined,
    AssignmentOutlined,
    FullscreenExitOutlined,
    FullscreenOutlined,
    RemoveOutlined,
    RotateRightOutlined,
} from '@material-ui/icons';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MapInteractionCSS } from 'react-map-interaction';
import { Document, Page } from 'react-pdf';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { LTWH } from '../../types';
import { LoadingBox } from '../shared';
import { MouseSelection } from '.';

interface PDFViewerProps {
    file: string;
    title: string;
    renderMarkAreaButton: JSX.Element;
    renderDrawModeContent: JSX.Element;
    renderDownloadButton: JSX.Element;
    renderPrintButton: JSX.Element;
}

interface PageFromElement {
    node: HTMLElement;
    number: number;
}

interface PDFPage {
    scrollIntoView: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({
    file,
    title,
    renderMarkAreaButton,
    renderDrawModeContent,
    renderDownloadButton,
    renderPrintButton,
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
        resetTranslation,
        fullscreen,
        setFullscreen,
        handleRotate,
        translation,
        setTranslation,
        ctrlKey,
        setCtrlKey,
    } = usePDFViewerContext();

    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const documentRef = useRef<Document>(null);
    const disableFullscreen = (): false | void => fullscreen && setFullscreen(false);

    const toggleFullScreen = (): void => {
        // Set scale to 75% when exiting fullscreen.
        if (fullscreen) {
            setScale(0.75);
        } else {
            setScale(1.0);
        }

        resetTranslation();
        setFullscreen(!fullscreen);
    };

    // Scale up by 10% if under limit.
    const handleScaleUp = (): void => {
        disableFullscreen();
        const newScale = scale < 2.5 ? scale + 0.05 : scale;
        setScale(newScale);
    };

    // Scale down by 10% if over limit.
    const handleScaleDown = (): void => {
        disableFullscreen();
        const newScale = scale > 0.5 ? scale - 0.05 : scale;
        setScale(newScale);
    };

    // Scroll into page from given page number.
    const handleChangePage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        const val = Number(e.target.value);
        setPageNumber(val);
        const page: PDFPage | undefined = R.path(['pages', val - 1], documentRef.current);
        page && page.scrollIntoView(); // TODO: Find a way to use the `smooth` behavior.
        window.scrollTo(0, 0); // Prevent window scrolling.
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
            // FIXME: This might cause issues on some small devices, resulting in misaligned screenshots.
            const dpr: number = window.devicePixelRatio;
            newCanvasContext.drawImage(canvas, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
            return newCanvas.toDataURL('image/jpeg');
        } else {
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

    const handleMapChange = ({ scale, translation }: any): void => {
        disableFullscreen();
        setScale(scale);
        setTranslation(translation);
    };

    // Change cursor mode when CTRL key is pressed.
    const onKeyDown = (e: KeyboardEvent): void => {
        if (e.ctrlKey) {
            setCtrlKey(true);
        }
    };

    // Reset cursor mode when CTRL key is released.
    const onKeyUp = (e: KeyboardEvent): void => {
        if (e.key == 'Control') {
            setCtrlKey(false);
        }
    };

    useEffect(() => {
        // const documentContainer = document.querySelector('#document-container');
        // const { height, width } = documentContainer!.getBoundingClientRect();
        // setTranslationBounds({
        //     ...translationBounds,
        //     xMin: -width / 4,
        //     xMax: width / 4,
        //     yMin: -height / 4,
        //     yMax: height / 4,
        // });

        // TODO: Add a listener that updates the page number based on scroll position.
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return (): void => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    const renderPages = Array.from(new Array(numPages), (_, i) => (
        <Page key={`page_${i + 1}`} pageNumber={i + 1} scale={scale} renderTextLayer={false} />
    ));

    const renderMouseSelection = <MouseSelection onSelection={handleSelection} />;
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
            <IconButton size="small" color="inherit" onClick={handleRotate}>
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
                <AssignmentOutlined color="secondary" /> {renderResourceTitle}
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

    const disableMapInteraction = !isMobile && !ctrlKey;

    const renderDocument = (
        <MapInteractionCSS
            scale={scale}
            translation={translation}
            onChange={handleMapChange}
            defaultScale={1}
            defaultTranslation={{ x: 0, y: 0 }}
            minScale={1.0}
            maxScale={2.5}
            disablePan={disableMapInteraction}
            disableZoom={disableMapInteraction}
        >
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
        </MapInteractionCSS>
    );

    const renderFullscreenButton = (
        <Tooltip title={fullscreen ? t('tooltips:exitFullscreen') : t('tooltips:enterFullscreen')}>
            <Fab size="small" color="secondary" onClick={toggleFullScreen}>
                {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Fab>
        </Tooltip>
    );

    const renderDownscaleButton = (
        <Tooltip title={t('tooltips:zoomIn')}>
            <Fab size="small" color="secondary" onClick={handleScaleUp}>
                <AddOutlined />
            </Fab>
        </Tooltip>
    );

    const renderUpscaleButton = (
        <Tooltip title={t('tooltips:zoomOut')}>
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
        <StyledPDFViewer
            scale={scale}
            translation={translation}
            fullscreen={fullscreen}
            drawMode={drawMode}
            isMobile={isMobile}
            ctrlKey={ctrlKey}
        >
            {renderToolbar}
            {renderDocument}
            {renderScaleControls}
        </StyledPDFViewer>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledPDFViewer = styled(({ scale, translation, fullscreen, drawMode, isMobile, ctrlKey, ...props }) => (
    <Box {...props} />
))`
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

    // Map interaction container.
    > div {
        > div {
            // On desktop show different cursor when CTRL key is pressed.
            cursor: ${({ ctrlKey }): string => (ctrlKey ? 'all-scroll' : 'inherit')} !important;

            // Disable scrolling when draw mode is on on mobile.
            overflow-y: ${({ drawMode, isMobile }): string => (drawMode && isMobile ? 'hidden' : 'scroll')} !important;

            background-color: var(--gray-light);

            .react-pdf__Document {
                // flex-grow: 1;
                // display: flex;
                // flex-direction: column;
                // align-items: center;
                // background-color: var(--gray-light);
                // position: relative;

                .react-pdf__Page {
                    // position: static !important;
                    // margin: 0 auto;
                    // display: flex;

                    // Automatically update width based on scale and fullscreen state.
                    // width: ${({ scale, fullscreen }): string => (fullscreen ? '100%' : `calc(100% * ${scale})`)};

                    .react-pdf__Page__canvas {
                        margin: 0 auto;
                        height: auto !important;
                        width: ${({ scale, fullscreen }): string =>
                            fullscreen ? '100%' : `calc(100% * ${scale})`} !important;
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
