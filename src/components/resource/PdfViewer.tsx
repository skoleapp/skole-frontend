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
import { Document, Page } from 'react-pdf';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

import { MouseSelection } from '..';
import { useDeviceContext, usePDFViewerContext } from '../../context';
import { LTWH, PDFTranslation } from '../../types';
import { LoadingBox } from '../shared';

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

type StartPointers = TouchList | MouseEvent[];
type MouseOrTouch = MouseEvent | Touch;

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
        scaleRef,
        setScale,
        translation,
        setTranslation,
        resetTranslation,
        fullscreen,
        setFullscreen,
        handleRotate,
    } = usePDFViewerContext();

    const minScale = 1;
    const maxScale = 5;
    const minTransX = -Infinity;
    const minTransY = -Infinity;
    const maxTransX = Infinity;
    const maxTransY = Infinity;

    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const documentRef = useRef<Document>(null);
    const disableFullscreen = (): false | void => fullscreen && setFullscreen(false);
    const [ctrlKey, setCtrlKey] = useState(false);

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
        setScale(scale => (scale < 2.5 ? scale + 0.05 : scale));
    };

    // Scale down by 10% if over limit.
    const handleScaleDown = (): void => {
        disableFullscreen();
        setScale(scale => (scale > 0.5 ? scale - 0.05 : scale));
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

    const [startPointersRef, setStartPointers] = useStateRef<StartPointers>([]);

    const handleSetStartPointers = (pointers: TouchList | MouseEvent[]): void =>
        setStartPointers(() => (!!pointers.length ? pointers : startPointersRef.current));

    // Return touch point on element.
    const getTouchPoint = (t: MouseOrTouch): PDFTranslation => ({ x: t.clientX, y: t.clientY });

    // Return distance between points.
    const getDistance = (p1: PDFTranslation, p2: PDFTranslation): number => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };

    // Get distance between fingers.
    const touchDistance = (t0: MouseOrTouch, t1: MouseOrTouch): number => {
        const p0 = getTouchPoint(t0);
        const p1 = getTouchPoint(t1);
        return getDistance(p0, p1);
    };

    // Get clamped scale if maximum scale has been exceeded.
    const getClampedScale = (min: number, value: number, max: number): number => Math.max(min, Math.min(value, max));

    // Get clamped translation if translation bounds have been exceeded.
    const getClampedTranslation = (desiredTranslation: PDFTranslation): PDFTranslation => {
        const { x, y } = desiredTranslation;

        return {
            x: getClampedScale(minTransX, x, maxTransX),
            y: getClampedScale(minTransY, y, maxTransY),
        };
    };

    // Get mid point between translation points.
    const getMidPoint = (p1: PDFTranslation, p2: PDFTranslation): PDFTranslation => ({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    });

    const getContainerBoundingClientRect = (): DOMRect => {
        const containerNode = document.querySelector('.react-pdf__Document') as HTMLDivElement;
        return containerNode.getBoundingClientRect();
    };

    // Return calculated translation from container position.
    const getTranslatedOrigin = (): PDFTranslation => {
        const clientOffset = getContainerBoundingClientRect();

        return {
            x: clientOffset.left + translation.x,
            y: clientOffset.top + translation.y,
        };
    };

    // From a given screen point return it as a point in the coordinate system of the given translation.
    const getClientPosToTranslatedPos = ({ x, y }: PDFTranslation): PDFTranslation => {
        const origin = getTranslatedOrigin();

        return {
            x: x - origin.x,
            y: y - origin.y,
        };
    };

    // The amount that a value of a dimension will change given a new scale.
    const coordChange = (coordinate: number, scaleRatio: number): number => scaleRatio * coordinate - coordinate;

    // Given the start touches and new e.touches, scale and translation such that the initial midpoint remains as the new midpoint.
    // This is to achieve the effect of keeping the content that was directly in the middle of the two fingers as the focal point throughout the zoom.
    const scaleFromMultiTouch = (e: TouchEvent): void => {
        const startPointers = startPointersRef.current;
        const scale = scaleRef.current;
        const newTouches = e.touches;

        // Calculate new scale.
        const dist0 = touchDistance(startPointers[0], startPointers[1]);
        const dist1 = touchDistance(newTouches[0], newTouches[1]);
        const scaleChange = dist1 / dist0;
        const targetScale = scale + (scaleChange - 1) * scale;
        const newScale = getClampedScale(minScale, targetScale, maxScale);

        // Calculate mid points.
        const startMidpoint = getMidPoint(getTouchPoint(startPointers[0]), getTouchPoint(startPointers[1]));
        const newMidPoint = getMidPoint(getTouchPoint(newTouches[0]), getTouchPoint(newTouches[1]));

        // The amount we need to translate by in order for the mid point to stay in the middle (before thinking about scaling factor).
        const dragDelta = {
            x: newMidPoint.x - startMidpoint.x,
            y: newMidPoint.y - startMidpoint.y,
        };

        const scaleRatio = newScale / scale;

        // The point originally in the middle of the fingers on the initial zoom start
        const focalPoint = getClientPosToTranslatedPos(startMidpoint);

        // The amount that the middle point has changed from this scaling
        const focalPtDelta = {
            x: coordChange(focalPoint.x, scaleRatio),
            y: coordChange(focalPoint.y, scaleRatio),
        };

        // Translation is the original translation, plus the amount we dragged, minus what the scaling will do to the focal point.
        // Subtracting the scaling factor keeps the midpoint in the middle of the touch points.
        const newTranslation = {
            x: translation.x - focalPtDelta.x + dragDelta.x,
            y: translation.y - focalPtDelta.y + dragDelta.y,
        };

        setScale(() => newScale);
        setTranslation(() => getClampedTranslation(newTranslation));
    };

    // Scale the document from a given point where cursor is upon mouse wheel press.
    const scaleFromPoint = (newScale: number, focalPoint: PDFTranslation): void => {
        const scale = scaleRef.current;
        const scaleRatio = newScale / (scale !== 0 ? scale : 1);

        const focalPointDelta = {
            x: coordChange(focalPoint.x, scaleRatio),
            y: coordChange(focalPoint.y, scaleRatio),
        };

        const newTranslation = {
            x: translation.x - focalPointDelta.x,
            y: translation.y - focalPointDelta.y,
        };

        setScale(() => newScale);
        setTranslation(() => getClampedTranslation(newTranslation));
    };

    // Update document scale based on mouse wheel events.
    const onWheel = (e: WheelEvent): void => {
        if (e.ctrlKey) {
            // e.preventDefault();
            // deltaY < 0 ? handleScaleUp() : handleScaleDown();

            disableFullscreen();
            e.preventDefault(); // Disables scroll behavior.
            e.stopPropagation();
            // const scaleChange = 2 ** (e.deltaY * 0.002);
            const scaleChange = e.deltaY < 0 ? 0.05 : -0.05;
            const newScale = getClampedScale(minScale, scaleRef.current + scaleChange, maxScale);
            const mousePos = getClientPosToTranslatedPos({ x: e.clientX, y: e.clientY });
            scaleFromPoint(newScale, mousePos);
        }
    };

    const onTouchStart = (e: TouchEvent): void => handleSetStartPointers(e.touches);

    const onMouseDown = (e: MouseEvent): void => {
        e.preventDefault();
        handleSetStartPointers([e]);
    };

    const onTouchMove = (e: TouchEvent): void => {
        // e.preventDefault();
        const isPinchAction = e.touches.length === 2 && startPointersRef.current.length > 1;

        if (isPinchAction) {
            scaleFromMultiTouch(e);
        }
    };

    const onTouchEnd = (e: TouchEvent): void => handleSetStartPointers(e.touches);

    const isElementInViewport = (el: Element): boolean => {
        const rect = el.getBoundingClientRect();

        return (
            rect.bottom >= 0 &&
            rect.right >= 0 &&
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.left <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    const onScroll = (): void => {
        const pages = document.querySelectorAll('.react-pdf__Page');
        const currentPage = Array.from(pages).find(el => !!isElementInViewport(el));

        console.log(currentPage);

        if (!!currentPage) {
            const pageNumber = currentPage.getAttribute('data-page-number');
            console.log('number', pageNumber);
            setPageNumber(Number(pageNumber));
        }
    };

    useEffect(() => {
        const documentNode = document.querySelector('.react-pdf__Document');

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        if (!!documentNode) {
            // Update current page when scrolling/resizing.
            documentNode.addEventListener('scroll', onScroll);
            documentNode.addEventListener('resize', onScroll);

            documentNode.addEventListener('wheel', onWheel as EventListener);
            documentNode.addEventListener('touchstart', onTouchStart as EventListener);
            documentNode.addEventListener('mousedown', onMouseDown as EventListener);
            documentNode.addEventListener('touchmove', onTouchMove as EventListener);
            documentNode.addEventListener('touchend', onTouchEnd as EventListener);
        }

        return (): void => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);

            if (!!documentNode) {
                documentNode.removeEventListener('wheel', onWheel as EventListener);
                documentNode.removeEventListener('touchstart', onTouchStart as EventListener);
                documentNode.removeEventListener('mousedown', onMouseDown as EventListener);
                documentNode.removeEventListener('touchmove', onTouchMove as EventListener);
                documentNode.removeEventListener('touchend', onTouchEnd as EventListener);
            }
        };
    }, []);

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

    const renderPages = Array.from(new Array(numPages), (_, i) => (
        <Page key={`page_${i + 1}`} pageNumber={i + 1} scale={scaleRef.current} renderTextLayer={false} />
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
            scale={scaleRef.current}
            translation={translation}
            fullscreen={fullscreen}
            drawMode={drawMode}
            isMobile={isMobile}
            ctrlKey={ctrlKey}
            id="document-container"
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

    .react-pdf__Document {
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--gray-light);
        position: relative;

        // On desktop show different cursor when CTRL key is pressed.
        cursor: ${({ ctrlKey }): string => (ctrlKey ? 'all-scroll' : 'inherit')};

        // Disable scrolling when draw mode is on on mobile.
        overflow: ${({ drawMode, isMobile }): string => (drawMode && isMobile ? 'hidden' : 'auto')};

        .react-pdf__Page {
            position: static !important;
            margin: 0 auto;
            display: flex;

            // Automatically update width based on scale and fullscreen state.
            width: ${({ scale, fullscreen }): string => (fullscreen ? '100%' : `calc(100% * ${scale})`)};

            // transform: ${({ scale, translation }): string =>
                `translate(${translation.x}px, ${translation.y}px) scale(${scale})`};

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
