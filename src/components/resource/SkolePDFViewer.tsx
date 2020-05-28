import { Box, Button, Fab, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import {
    AddOutlined,
    CancelOutlined,
    CloudDownloadOutlined,
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
import { useCommentModalContext, useDeviceContext, usePDFViewerContext } from 'src/context';
import { LTWH } from 'src/types';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

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

interface MouseSelectionProps {
    onSelection: (startTarget: HTMLElement, boundingRect: LTWH) => void;
    onChange: (drawing: boolean) => void;
}

const initialState = { start: null, end: null, locked: false };

const MouseSelection: React.FC<MouseSelectionProps> = ({ onSelection, onChange }) => {
    const [stateRef, setState] = useStateRef<State>(initialState); // Need to use mutable ref instead of immutable state.
    const reset = (): void => setState(initialState);
    const { start, end } = stateRef.current;
    const drawing = !!start && !!end;

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

                        if (container.contains(e.target as Node) && !!e.altKey) {
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

                if (!!e.altKey) {
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

    useEffect(() => {
        onChange(drawing);
    }, [start, end]);

    return drawing && !!start && !!end ? <StyledMouseSelection style={getBoundingRect(start, end)} /> : null;
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

export const SkolePDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
    const { t } = useTranslation();
    const isMobile = useDeviceContext();
    const documentRef = useRef<Document>(null);
    const { toggleCommentModal } = useCommentModalContext();

    const {
        numPages,
        setNumPages,
        pageNumber,
        setPageNumber,
        rotate,
        drawing,
        setDrawing,
        setScreenshot,
        scale,
        setScale,
        handleRotate,
    } = usePDFViewerContext();

    const handleScaleUp = (): false | void => setScale(scale => (scale < 3.0 ? scale + 0.1 : scale));
    const handleScaleDown = (): false | void => setScale(scale => (scale > 0.5 ? scale - 0.1 : scale));
    const handleMouseSelectionChange = (drawing: boolean): void => setDrawing(drawing);
    const handleCancelDraw = (): void => setDrawing(false);

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

    // Some magic.
    // const viewportToScaled = (rect: LTWH, { width, height }: WH): Scaled => ({
    //     x1: rect.left,
    //     y1: rect.top,
    //     x2: rect.left + rect.width,
    //     y2: rect.top + rect.height,
    //     width,
    //     height,
    // });

    // Get scaled position based on document viewport.
    // const viewportPositionToScaled = async ({
    //     pageNumber,
    //     boundingRect,
    //     rects,
    // }: Position): Promise<ScaledPosition | null> => {
    //     const pdfDocument: PDFDocumentProxy | undefined = R.path(['state', 'pdf'], documentRef.current);

    //     if (!!pdfDocument) {
    //         const viewport = (await pdfDocument.getPage(pageNumber)).getViewport({ scale: 1 });

    //         return {
    //             boundingRect: viewportToScaled(boundingRect, viewport),
    //             rects: (rects || []).map(rect => viewportToScaled(rect, viewport)),
    //             pageNumber,
    //         };
    //     } else {
    //         return null;
    //     }
    // };

    // Get closest PDF page and take screenshot of selected area.
    const getScreenshot = (target: HTMLElement, position: LTWH): string | null => {
        const canvas = target.closest('canvas');
        const { left, top, width, height } = position;
        const newCanvas = document.createElement('canvas');

        newCanvas.width = width;
        newCanvas.height = height;
        const newCanvasContext = newCanvas.getContext('2d');

        if (!!newCanvasContext && !!canvas) {
            const dpr: number = window.devicePixelRatio;
            newCanvasContext.drawImage(canvas, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
            return newCanvas.toDataURL('image/png');
        } else {
            return null;
        }
    };

    const handleSelection = async (startTarget: HTMLElement, boundingRect: LTWH): Promise<void> => {
        const page = getPageFromElement(startTarget);

        if (!!page) {
            // const pageNumber = page.number;

            const pageBoundingRect = {
                ...boundingRect,
                top: boundingRect.top - page.node.offsetTop,
                left: boundingRect.left - page.node.offsetLeft,
            };

            // const viewportPosition = {
            //     boundingRect: pageBoundingRect,
            //     rects: [],
            //     pageNumber,
            // };

            // const scaledPosition = await viewportPositionToScaled(viewportPosition);
            const screenshot = getScreenshot(startTarget, pageBoundingRect);
            setScreenshot(screenshot);

            // console.log('scaled position', scaledPosition);
            // console.log('image', image);

            // renderTipAtPosition(
            //     viewportPosition,
            //     onSelectionFinished(
            //         scaledPosition,
            //         { image },
            //         () => hideTipAndSelection(),
            //         () =>
            //             setState({
            //                 ...state,
            //                 ghostHighlight: {
            //                     position: scaledPosition,
            //                     content: { image },
            //                 } as Highlight,
            //             }),
            //     ),
            // );

            // renderHighlights();
        }
    };

    const handleDrawContinue = (): void => {
        toggleCommentModal(true);
    };

    const renderPages = Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} renderTextLayer={false} />
    ));

    const renderMouseSelection = <MouseSelection onChange={handleMouseSelectionChange} onSelection={handleSelection} />;
    const renderLoading = <LoadingBox text={t('resource:loadingResource')} />;

    const renderDrawingToolbarContent = (
        <Grid container alignItems="center">
            <Grid item xs={6} container justify="flex-start">
                <Button onClick={handleCancelDraw} startIcon={<CancelOutlined />} color="primary">
                    {t('common:cancel')}
                </Button>
            </Grid>
            <Grid item xs={6} container justify="flex-end">
                <Button
                    onClick={handleDrawContinue}
                    endIcon={<KeyboardArrowRightOutlined />}
                    variant="contained"
                    color="primary"
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
                <IconButton size="small" color="inherit">
                    <TabUnselectedOutlined />
                </IconButton>
                <IconButton size="small" color="inherit" onClick={handleRotate}>
                    <RotateRightOutlined />
                </IconButton>
                <IconButton size="small" color="inherit">
                    <CloudDownloadOutlined />
                </IconButton>
                <IconButton size="small" color="inherit">
                    <PrintOutlined />
                </IconButton>
            </Grid>
        </Grid>
    );

    const renderToolbar = !isMobile && (
        <Box id="toolbar">{drawing ? renderDrawingToolbarContent : renderPreviewToolbarContent}</Box>
    );

    const renderDocument = (
        <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={renderLoading}
            error={t('resource:resourceError')}
            noData={t('resource:resourceError')}
            rotate={rotate}
            ref={documentRef}
        >
            {renderPages}
            {renderMouseSelection}
        </Document>
    );

    const renderScaleControls = !isMobile && (
        <Box id="pdf-controls">
            <Fab size="small" onClick={toggleFullScreen}>
                <FullscreenOutlined />
            </Fab>
            <Fab size="small" onClick={handleScaleUp}>
                <AddOutlined />
            </Fab>
            <Fab size="small" onClick={handleScaleDown}>
                <RemoveOutlined />
            </Fab>
        </Box>
    );

    return (
        <StyledSkolePDFViewer scale={scale} drawing={drawing}>
            {renderToolbar}
            {renderDocument}
            {renderScaleControls}
        </StyledSkolePDFViewer>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledSkolePDFViewer = styled(({ scale, drawing, ...props }) => <Box {...props} />)`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    #toolbar {
        background-color: ${({ drawing }): string => (drawing ? 'var(--white)' : 'rgb(50, 54, 57)')};
        color: var(--secondary);
        padding: 0.5rem;
        border-bottom: ${({ drawing }): string => (drawing ? 'var(--border)' : 'none')};

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

        .react-pdf__message--loading {
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
