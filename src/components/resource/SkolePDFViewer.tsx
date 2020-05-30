import { Box, Button, Fab, Grid, IconButton, TextField, Tooltip, Typography } from '@material-ui/core';
import {
    AddOutlined,
    CancelOutlined,
    CloudDownloadOutlined,
    FullscreenExit,
    FullscreenOutlined,
    KeyboardArrowRightOutlined,
    PrintOutlined,
    RemoveOutlined,
    RotateRightOutlined,
    TabUnselectedOutlined,
} from '@material-ui/icons';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page } from 'react-pdf';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

import { useCommentModalContext, useDeviceContext, useNotificationsContext, usePDFViewerContext } from '../../context';
import { LoadingBox } from '../shared';

interface Coords {
    x: number;
    y: number;
}

interface State {
    locked: boolean;
    start: Coords | null;
    end: Coords | null;
}

export interface LTWH {
    left: number;
    top: number;
    width: number;
    height: number;
}

interface MouseSelectionProps {
    onSelection: (startTarget: HTMLElement, boundingRect: LTWH) => void;
}

const initialState = { start: null, end: null, locked: false };

const MouseSelection: React.FC<MouseSelectionProps> = ({ onSelection }) => {
    const { drawMode, setDrawMode, setScreenshot } = usePDFViewerContext();
    const [stateRef, setState] = useStateRef<State>(initialState); // Need to use mutable ref instead of immutable state.
    const [drawingAllowedRef, setDrawingAllowedRef] = useStateRef(false);
    const { start, end } = stateRef.current;
    // const drawing = !!start && !!end;
    const reset = (): void => setState(initialState);

    const getBoundingRect = (start: Coords, end: Coords): LTWH => ({
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    });

    useEffect(() => {
        const container = document.querySelector('.react-pdf__Document');

        if (!!container) {
            // Get coordinates on container element.
            const containerCoords = (pageX: number, pageY: number): Coords => {
                const { left, top } = container.getBoundingClientRect();

                return {
                    x: pageX - left + container.scrollLeft,
                    y: pageY - top + container.scrollTop,
                };
            };

            const onMouseMove = (e: MouseEvent): void => {
                const { start, locked } = stateRef.current;

                if (!!start && !locked) {
                    setState({
                        ...stateRef.current,
                        end: containerCoords(e.pageX, e.pageY),
                    });
                }
            };

            const onMouseDown = (e: MouseEvent): void => {
                const startTarget = e.target;

                const onMouseUp = (e: MouseEvent): void => {
                    const { start } = stateRef.current;

                    if (!!start) {
                        const end = containerCoords(e.pageX, e.pageY);
                        const boundingRect = getBoundingRect(start, end);

                        if (container.contains(e.target as Node) && (!!e.altKey || drawingAllowedRef.current)) {
                            // Lock state.
                            setState({
                                ...stateRef.current,
                                end,
                                locked: true,
                            });

                            if (!!end) {
                                onSelection(startTarget as HTMLElement, boundingRect);
                            }
                        } else {
                            reset();
                        }
                    } else {
                        reset();
                    }
                };

                console.log('allowed', drawingAllowedRef.current);

                if (!!e.altKey || drawingAllowedRef.current) {
                    setState({
                        start: containerCoords(e.pageX, e.pageY),
                        end: null,
                        locked: false,
                    });

                    document.addEventListener('mouseup', onMouseUp);
                }
            };

            container.addEventListener('mousemove', onMouseMove as EventListener);
            container.addEventListener('mousedown', onMouseDown as EventListener);

            return (): void => {
                container.removeEventListener('mousemove', onMouseMove as EventListener);
                container.removeEventListener('mousedown', onMouseDown as EventListener);
            };
        }
    }, []);

    // Only toggle draw mode on here.
    useEffect(() => {
        const { start, end } = stateRef.current;
        const drawing = !!start && !!end;
        drawing && setDrawMode(drawing);
    }, [stateRef.current]);

    // Update mutable drawing allowed state based on context state.
    useEffect(() => {
        setDrawingAllowedRef(drawMode);

        if (!drawMode) {
            reset();
            setScreenshot(null);
        }
    }, [drawMode]);

    return drawMode && !!start && !!end ? <StyledMouseSelection style={getBoundingRect(start, end)} /> : null;
};

const StyledMouseSelection = styled(Box)`
    position: absolute;
    border: 0.05rem dashed #000000;
    background-color: rgba(252, 232, 151, 0.5);
`;

interface PDFViewerProps {
    file: string;
}

interface PageFromElement {
    node: HTMLElement;
    number: number;
}

interface PDFPage {
    scrollIntoView: () => void;
}

export const SkolePdfViewer: React.FC<PDFViewerProps> = ({ file }) => {
    const {
        numPages,
        setNumPages,
        pageNumber,
        setPageNumber,
        rotate,
        drawMode,
        setDrawMode,
        screenshot,
        setScreenshot,
        scale,
        setScale,
        handleRotate,
    } = usePDFViewerContext();

    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const { toggleNotification } = useNotificationsContext();
    const documentRef = useRef<Document>(null);
    const { toggleCommentModal } = useCommentModalContext();
    const isFullscreen = scale > 1;
    const handleCancelDraw = (): void => setDrawMode(false);
    const handleStartDrawing = (): void => setDrawMode(true);

    // Scale up by 10% if under limit.
    const handleScaleUp = (): false | void => setScale(scale => (scale < 2.5 ? scale + 0.1 : scale));

    // Scale down by 10% if over limit.
    const handleScaleDown = (): false | void => setScale(scale => (scale > 0.5 ? scale - 0.1 : scale));

    const handleContinueDraw = (): void => {
        setDrawMode(false);
        toggleCommentModal(true);
    };

    // On mobile scale down and on desktop scale up.
    const toggleFullScreen = (): false | void => (scale === 1.0 ? setScale(isMobile ? 0.75 : 1.25) : setScale(1.0));

    // Update document scale based on mouse wheel events.
    const onWheel = (e: WheelEvent): void => {
        const { ctrlKey, deltaY } = e;

        if (ctrlKey) {
            deltaY < 0 ? handleScaleUp() : handleScaleDown();
        }
    };

    useEffect(() => {
        const documentNode = document.querySelector('.react-pdf__Document');
        !!documentNode && documentNode.addEventListener('wheel', onWheel as EventListener);

        return (): void => {
            !!documentNode && documentNode.removeEventListener('wheel', onWheel as EventListener);
        };
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
        console.log('page', page);

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

    const renderError = (
        <Box flexGrow="1" display="flex" justifyContent="center" alignItems="center">
            <Typography variant="body2" color="textSecondary">
                {t('resource:errorLoadingResource')}
            </Typography>
        </Box>
    );

    const renderDrawModeToolbarContent = (
        <Grid container alignItems="center">
            <Grid item xs={3} container justify="flex-start">
                <Button onClick={handleCancelDraw} startIcon={<CancelOutlined />} color="primary">
                    {t('common:cancel')}
                </Button>
            </Grid>
            <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">
                    {t('resource:drawModeInfo')}
                </Typography>
            </Grid>
            <Grid item xs={3} container justify="flex-end">
                <Button
                    onClick={handleContinueDraw}
                    endIcon={<KeyboardArrowRightOutlined />}
                    variant="contained"
                    color="primary"
                    disabled={!screenshot}
                >
                    {t('common:continue')}
                </Button>
            </Grid>
        </Grid>
    );

    const renderPreviewToolbarContent = (
        <Grid container alignItems="center">
            <Grid item xs={4} container justify="flex-start">
                <Typography variant="subtitle1">test_resource.pdf</Typography>
            </Grid>
            <Grid item xs={4} container justify="center">
                <Box id="page-numbers">
                    <TextField
                        value={pageNumber}
                        onChange={handleChangePage}
                        type="number"
                        color="secondary"
                        inputProps={{ min: '1' }}
                    />{' '}
                    /{' '}
                    <Typography id="num-pages" variant="subtitle1">
                        {numPages}
                    </Typography>
                </Box>
            </Grid>
            <Grid item xs={4} container justify="flex-end">
                <Tooltip title={t('resource:markAreaTooltip')}>
                    <IconButton onClick={handleStartDrawing} size="small" color="inherit">
                        <TabUnselectedOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('resource:rotateTooltip')}>
                    <IconButton size="small" color="inherit" onClick={handleRotate}>
                        <RotateRightOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('resource:downloadResourceTooltip')}>
                    <IconButton size="small" color="inherit">
                        <CloudDownloadOutlined />
                    </IconButton>
                </Tooltip>
                <Tooltip title={t('resource:printResourceTooltip')}>
                    <IconButton size="small" color="inherit">
                        <PrintOutlined />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );

    const renderToolbar = !isMobile && (
        <Box id="toolbar">{drawMode ? renderDrawModeToolbarContent : renderPreviewToolbarContent}</Box>
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

    const renderScaleControls = !isMobile && (
        <Box id="pdf-controls">
            <Tooltip title={isFullscreen ? t('resource:exitFullscreenTooltip') : t('resource:enterFullscreenTooltip')}>
                <Fab size="small" color="secondary" onClick={toggleFullScreen}>
                    {isFullscreen ? <FullscreenExit /> : <FullscreenOutlined />}
                </Fab>
            </Tooltip>
            <Tooltip title={t('resource:zoomInTooltip')}>
                <Fab size="small" color="secondary" onClick={handleScaleUp}>
                    <AddOutlined />
                </Fab>
            </Tooltip>
            <Tooltip title={t('resource:zoomOutTooltip')}>
                <Fab size="small" color="secondary" onClick={handleScaleDown}>
                    <RemoveOutlined />
                </Fab>
            </Tooltip>
        </Box>
    );

    return (
        <StyledSkolePDFViewer scale={scale} drawMode={drawMode}>
            {renderToolbar}
            {renderDocument}
            {renderScaleControls}
        </StyledSkolePDFViewer>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledSkolePDFViewer = styled(({ scale, drawMode, ...props }) => <Box {...props} />)`
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
        overflow: auto;
        position: relative;

        .react-pdf__Page {
            position: static !important;
            margin: 0 auto;
            display: flex;

            .react-pdf__Page__canvas {
                margin: 0 auto;
                width: ${({ scale }): string =>
                    `calc(100% * ${scale})`} !important; // Automatically update width based on scale.
                height: auto !important;
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
