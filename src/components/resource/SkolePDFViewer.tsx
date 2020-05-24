import { Box, Fab, Grid, IconButton, Typography } from '@material-ui/core';
import {
    AddOutlined,
    CloudDownloadOutlined,
    FullscreenOutlined,
    PhotoSizeSelectActualOutlined,
    PrintOutlined,
    RemoveOutlined,
    RotateLeftOutlined,
    TabUnselectedOutlined,
} from '@material-ui/icons';
import { PDFDocumentProxy } from 'pdfjs-dist';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Document, Page } from 'react-pdf';
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
    numPages: number | null;
    drawing: boolean;
}

interface PageFromElement {
    node: HTMLElement;
    number: number;
}

export const SkolePDFViewer: React.FC<PDFViewerProps> = ({ file }) => {
    const { t } = useTranslation();
    const documentRef = useRef<PDFDocumentProxy | null>(null);

    const [state, setState] = useState<PDFViewerState>({
        numPages: null,
        drawing: false,
    });

    const onDocumentLoadSuccess = (document: PDFDocumentProxy): void => {
        const { numPages } = document;
        setState({ ...state, numPages });
        documentRef.current = document;
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
        const pdfDocument = documentRef.current;

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

    const renderPages = Array.from(new Array(state.numPages), (_, index) => (
        <Page key={`page_${index + 1}`} pageNumber={index + 1} renderTextLayer={false} />
    ));

    const renderMouseSelection = <MouseSelection onChange={handleMouseSelectionChange} onSelection={handleSelection} />;
    const renderLoading = <LoadingBox text={t('resource:loadingResource')} />;

    const renderToolbar = (
        <Box id="toolbar">
            <Grid container alignItems="center">
                <Grid item xs={4} container justify="flex-start">
                    <Typography variant="subtitle1">test_resource.pdf</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="subtitle1">1 / 1</Typography>
                </Grid>
                <Grid item xs={4} container justify="flex-end">
                    <IconButton size="small" color="inherit">
                        <TabUnselectedOutlined />
                    </IconButton>
                    <IconButton size="small" color="inherit">
                        <RotateLeftOutlined />
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

    const renderPdfControls = (
        <Box id="pdf-controls">
            <Fab size="small">
                <FullscreenOutlined />
            </Fab>
            <Fab size="small">
                <AddOutlined />
            </Fab>
            <Fab size="small">
                <RemoveOutlined />
            </Fab>
        </Box>
    );

    return (
        <StyledSkolePDFViewer
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={renderLoading}
            error={t('resource:resourceError')}
        >
            {renderPages}
            {renderMouseSelection}
            {renderToolbar}
            {renderPdfControls}
        </StyledSkolePDFViewer>
    );
};

const StyledSkolePDFViewer = styled(Document)`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgb(82, 86, 89);
    height: 100%;

    #toolbar {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        background-color: rgb(50, 54, 57);
        color: var(--white);
        padding: 0.5rem;

        .MuiButtonBase-root {
            padding: 0.25rem;
        }
    }

    #pdf-controls {
        position: absolute;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        padding: 0.5rem;

        .MuiFab-root {
            margin: 0.5rem;
        }
    }

    .react-pdf__message--loading {
        background-color: var(--white);
    }
`;
