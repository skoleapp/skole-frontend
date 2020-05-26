import { Box, Fab, Grid, IconButton, TextField, Typography } from '@material-ui/core';
import {
    AddOutlined,
    CloudDownloadOutlined,
    FullscreenOutlined,
    PrintOutlined,
    RemoveOutlined,
    RotateRightOutlined,
    TabUnselectedOutlined,
} from '@material-ui/icons';
import { PDFDocumentProxy } from 'pdfjs-dist';
import * as R from 'ramda';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page } from 'react-pdf';
import { useDeviceContext } from 'src/context';
import { LTWH, Position, Scaled, ScaledPosition, WH } from 'src/types';
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
    const containerRef = useRef<HTMLDivElement>(null);

    const getBoundingRect = (start: Coords, end: Coords): LTWH => ({
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    });

    useEffect(() => {
        const container = !!containerRef.current && containerRef.current.parentElement;

        if (!!container) {
            // Get coordinates on container element.
            const containerCoords = (pageX: number, pageY: number): Coords => {
                const { left, top } = container.getBoundingClientRect();

                return {
                    x: pageX - left + container.scrollLeft,
                    y: pageY - top + container.scrollTop,
                };
            };

            container.addEventListener('mousemove', (e: MouseEvent) => {
                const { start, locked } = stateRef.current;

                if (!!start && !locked) {
                    setState({
                        ...stateRef.current,
                        end: containerCoords(e.pageX, e.pageY),
                    });
                }
            });

            container.addEventListener('mousedown', (e: MouseEvent) => {
                const startTarget = e.target;

                if (!!e.altKey) {
                    setState({
                        start: containerCoords(e.pageX, e.pageY),
                        end: null,
                        locked: false,
                    });

                    document.addEventListener('mouseup', (e: MouseEvent): void => {
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
                    });
                }
            });
        }
    }, []);

    useEffect(() => {
        const drawing = !!start && !!end;
        onChange(drawing);
    }, [start, end]);

    return (
        <StyledMouseSelection ref={containerRef}>
            {!!start && !!end && <Box style={getBoundingRect(start, end)} />}
        </StyledMouseSelection>
    );
};

const StyledMouseSelection = styled.div`
    > div {
        position: absolute;
        border: 0.05rem dashed #000000;
        background-color: rgba(252, 232, 151, 0.5);
    }
`;

interface PDFViewerProps {
    file: string;
}

interface PDFViewerState {
    drawing: boolean;
    rotate: number;
    scale: number;
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
    const pdfDocument: PDFDocumentProxy | undefined = R.path(['state', 'pdf'], documentRef.current);
    const [numPages, setNumPages] = useState(1);
    const [pageNumber, setPageNumber] = useState(1);

    const [state, setState] = useState<PDFViewerState>({
        drawing: false,
        rotate: 0,
        scale: 1,
    });

    const { rotate, scale } = state;

    useEffect(() => {
        const documentSelector = document.getElementById('pdf-viewer-container');

        if (!!documentSelector) {
            documentSelector.addEventListener('gestureend', (e: any): void => setState({ ...state, scale: e.scale }));
        }
    }, []);

    const handleRotate = (): void => {
        if (rotate === 270) {
            setState({ ...state, rotate: 0 });
        } else {
            setState({ ...state, rotate: rotate + 90 });
        }
    };

    const toggleFullScreen = (): void => {
        if (scale === 1.5) {
            setState({ ...state, scale: 1 });
        } else {
            setState({ ...state, scale: 1.5 });
        }
    };

    const handleScaleUp = (): void => {
        if (scale < 2) {
            setState({ ...state, scale: scale + 0.1 });
        }
    };

    const handleScaleDown = (): void => {
        if (scale > 0.1) {
            setState({ ...state, scale: scale - 0.1 });
        }
    };

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

    const handleMouseSelectionChange = (drawing: boolean): void => {
        setState({ ...state, drawing });
    };

    const getPageFromElement = (target: HTMLElement): PageFromElement | null => {
        const node = target.closest('.react-pdf__Page');

        if (!!(node instanceof HTMLElement)) {
            const number = Number(node.dataset.pageNumber);
            return { node, number };
        } else {
            return null;
        }
    };

    const viewportToScaled = (rect: LTWH, { width, height }: WH): Scaled => ({
        x1: rect.left,
        y1: rect.top,
        x2: rect.left + rect.width,
        y2: rect.top + rect.height,
        width,
        height,
    });

    const viewportPositionToScaled = async ({
        pageNumber,
        boundingRect,
        rects,
    }: Position): Promise<ScaledPosition | null> => {
        if (!!pdfDocument) {
            const viewport = (await pdfDocument.getPage(pageNumber)).getViewport({ scale: 1 });

            return {
                boundingRect: viewportToScaled(boundingRect, viewport),
                rects: (rects || []).map(rect => viewportToScaled(rect, viewport)),
                pageNumber,
            };
        } else {
            return null;
        }
    };

    // Get closest PDF page and take screenshot of selected area.
    const screenshot = (target: HTMLElement, position: LTWH): string | void => {
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
        }
    };

    const handleSelection = async (startTarget: HTMLElement, boundingRect: LTWH): Promise<void> => {
        const page = getPageFromElement(startTarget);

        if (!!page) {
            const pageNumber = page.number;

            const pageBoundingRect = {
                ...boundingRect,
                top: boundingRect.top - page.node.offsetTop,
                left: boundingRect.left - page.node.offsetLeft,
            };

            const viewportPosition = {
                boundingRect: pageBoundingRect,
                rects: [],
                pageNumber,
            };

            const scaledPosition = await viewportPositionToScaled(viewportPosition);
            const image = screenshot(startTarget, pageBoundingRect);

            console.log('scaled position', scaledPosition);
            console.log('image', image);

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

    const renderPages = Array.from(new Array(numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
    ));

    const renderMouseSelection = <MouseSelection onChange={handleMouseSelectionChange} onSelection={handleSelection} />;
    const renderLoading = <LoadingBox text={t('resource:loadingResource')} />;

    const renderToolbar = !isMobile && (
        <Box id="toolbar">
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
        </Box>
    );

    const renderDocument = (
        <PinchZoomPan>
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
        </PinchZoomPan>
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
        <StyledSkolePDFViewer id="pdf-viewer-container">
            {renderToolbar}
            {renderDocument}
            {renderScaleControls}
        </StyledSkolePDFViewer>
    );
};

const StyledSkolePDFViewer = styled(Box)`
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;

    #toolbar {
        background-color: rgb(50, 54, 57);
        color: var(--secondary);
        padding: 0.5rem;

        .MuiButtonBase-root {
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
        overflow-y: auto;
        overflow-x: hidden;
        padding: 0.25rem 0;

        .react-pdf__Page {
            margin: 0.25rem 0;

            .react-pdf__Page__canvas {
                // width: 100% !important;
                // height: auto !important;
            }
        }

        .react-pdf__message--loading {
            height: 100%;
            width: 100%;
            background-color: var(--white);
            display: flex;
            margin: -0.5rem 0;
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
