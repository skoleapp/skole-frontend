import 'pdfjs-dist/web/pdf_viewer.css';
import 'pdfjs-dist/web/pdf_viewer.js';

import { Box } from '@material-ui/core';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import React, { PointerEvent, SyntheticEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import {
    Highlight,
    LTWH,
    PDFJSLinkService,
    PDFJSViewer,
    Position,
    Scaled,
    ScaledPosition,
    ViewPort,
    ViewportHighlight,
} from '../../types';
import { usePrevious } from '../../utils';
import { MouseSelection } from './MouseSelection';
import { TipContainer } from './TipContainer';

interface Tip {
    highlight: ViewportHighlight;
    callback: (highlight: ViewportHighlight) => JSX.Element;
}

interface State {
    ghostHighlight: Highlight | null;
    isCollapsed: boolean;
    range: Range | null;
    tip: Tip | null;
    isAreaSelectionInProgress: boolean;
    scrolledToHighlightId: string;
}

type HighlightTransform = (
    highlight: ViewportHighlight,
    index: number,
    setTip: (highlight: ViewportHighlight, callback: (highlight: ViewportHighlight) => JSX.Element) => void,
    hideTip: () => void,
    viewportToScaled: (rect: LTWH) => Scaled,
    screenshot: (position: LTWH) => string,
    isScrolledTo: boolean,
) => JSX.Element;

type OnSelectionFinished = (
    position: ScaledPosition,
    content: { text?: string; image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void,
) => JSX.Element;

interface Props {
    highlightTransform: HighlightTransform;
    highlights: Highlight[];
    onScrollChange: () => void;
    scrollRef: (scrollTo: (highlight: Highlight) => void) => void;
    pdfDocument: PDFDocumentProxy;
    onSelectionFinished: OnSelectionFinished;
    enableAreaSelection: (e: MouseEvent) => boolean;
}

type PageFromElement = { node: HTMLElement; number: number } | null;
const EMPTY_ID = 'empty-id';

export const PDFHighlighter: React.FC<Props> = ({
    highlightTransform,
    highlights,
    onScrollChange,
    scrollRef,
    pdfDocument,
    onSelectionFinished,
    enableAreaSelection,
}) => {
    const prevHighlights = usePrevious(highlights);
    const [state, setState] = useState<State>({
        ghostHighlight: null,
        isCollapsed: true,
        range: null,
        scrolledToHighlightId: EMPTY_ID,
        isAreaSelectionInProgress: false,
        tip: null,
    });

    const viewerRef = useRef<PDFJSViewer | null>(null);
    const viewer = viewerRef.current as PDFJSViewer;
    const linkServiceRef = useRef<PDFJSLinkService | null>(null);
    const linkService = linkServiceRef.current as PDFJSLinkService;
    const containerRef = useRef<HTMLDivElement>(null);
    const handleContextMenu = (e: SyntheticEvent): void => e.preventDefault();

    const viewportToScaled = (rect: LTWH, { width, height }: { width: number; height: number }): Scaled => ({
        x1: rect.left,
        y1: rect.top,
        x2: rect.left + rect.width,
        y2: rect.top + rect.height,
        width,
        height,
    });

    const viewportPositionToScaled = ({ pageNumber, boundingRect, rects }: Position): ScaledPosition => {
        const viewport = viewer.getPageView(pageNumber - 1).viewport;

        return {
            boundingRect: viewportToScaled(boundingRect, viewport),
            rects: (rects || []).map(rect => viewportToScaled(rect, viewport)),
            pageNumber,
        };
    };

    const findOrCreateContainerLayer = (container: HTMLElement, className: string): Element => {
        let layer = container.querySelector(`.${className}`);

        if (!layer) {
            layer = document.createElement('div');
            layer.className = className;
            container.appendChild(layer);
        }

        return layer;
    };

    const renderTipAtPosition = (position: Position, inner: JSX.Element): void => {
        const { boundingRect, pageNumber } = position;

        const page = {
            node: viewer.getPageView(pageNumber - 1).div,
        };

        const pageBoundingRect = page.node.getBoundingClientRect();

        const tipNode = findOrCreateContainerLayer(viewer.viewer, 'PdfHighlighter__tip-layer');

        const style = {
            left: page.node.offsetLeft + boundingRect.left + boundingRect.width / 2,
            top: boundingRect.top + page.node.offsetTop,
            bottom: boundingRect.top + page.node.offsetTop + boundingRect.height,
        };

        ReactDOM.render(
            <TipContainer scrollTop={viewer.container.scrollTop} pageBoundingRect={pageBoundingRect} style={style}>
                {inner}
            </TipContainer>,
            tipNode,
        );
    };

    const groupHighlightsByPage = (highlights: Highlight[]): { [pageNumber: string]: Highlight[] } => {
        return [...highlights, state.ghostHighlight]
            .filter(Boolean)
            .reduce((res: { [pageNumber: number]: Highlight[] }, highlight) => {
                const { pageNumber } = (highlight as Highlight).position;
                res[pageNumber] = res[pageNumber] || [];
                res[pageNumber].push(highlight as Highlight);
                return res;
            }, {});
    };

    const findOrCreateHighlightLayer = (page: number): Element | null => {
        const textLayer = viewer.getPageView(page - 1).textLayer;

        if (!textLayer) {
            return null;
        }

        return findOrCreateContainerLayer(textLayer.textLayerDiv, 'PdfHighlighter__highlight-layer');
    };

    const pdfToViewport = (pdf: Scaled, viewport: ViewPort): LTWH => {
        const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([pdf.x1, pdf.y1, pdf.x2, pdf.y2]);

        return {
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y1 - y2,
        };
    };

    const scaledToViewport = (scaled: Scaled, viewport: ViewPort, usePdfCoordinates = false): LTWH => {
        const { width, height } = viewport;

        if (usePdfCoordinates) {
            return pdfToViewport(scaled, viewport);
        }

        if (scaled.x1 === undefined) {
            throw new Error('You are using old position format, please update');
        }

        const x1 = (width * scaled.x1) / scaled.width;
        const y1 = (height * scaled.y1) / scaled.height;
        const x2 = (width * scaled.x2) / scaled.width;
        const y2 = (height * scaled.y2) / scaled.height;

        return {
            left: x1,
            top: y1,
            width: x2 - x1,
            height: y2 - y1,
        };
    };

    const scaledPositionToViewport = ({
        pageNumber,
        boundingRect,
        rects,
        usePdfCoordinates,
    }: ScaledPosition): Position => {
        const viewport = viewer.getPageView(pageNumber - 1).viewport;

        return {
            boundingRect: scaledToViewport(boundingRect, viewport, usePdfCoordinates),
            rects: (rects || []).map(rect => scaledToViewport(rect, viewport, usePdfCoordinates)),
            pageNumber,
        };
    };

    const showTip = (highlight: ViewportHighlight, content: JSX.Element): void => {
        const { isCollapsed, ghostHighlight, isAreaSelectionInProgress } = state;

        const highlightInProgress = !isCollapsed || ghostHighlight;

        if (highlightInProgress || isAreaSelectionInProgress) {
            return;
        }

        renderTipAtPosition(highlight.position, content);
    };

    const hideTipAndSelection = (): void => {
        const tipNode = findOrCreateContainerLayer(viewer.viewer, 'PdfHighlighter__tip-layer');
        ReactDOM.unmountComponentAtNode(tipNode);
        setState({ ...state, ghostHighlight: null, tip: null });
        renderHighlights(); // eslint-disable-line @typescript-eslint/no-use-before-define
    };

    const screenshot = (position: LTWH, pageNumber: number): string => {
        const canvas = viewer.getPageView(pageNumber - 1).canvas;
        const { left, top, width, height } = position;

        // TODO: Cache this?
        const newCanvas = document.createElement('canvas');

        if (!(newCanvas instanceof HTMLCanvasElement)) {
            return '';
        }

        newCanvas.width = width;
        newCanvas.height = height;
        const newCanvasContext = newCanvas.getContext('2d');

        if (!newCanvasContext || !canvas) {
            return '';
        }

        const dpr: number = window.devicePixelRatio;
        newCanvasContext.drawImage(canvas, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
        return newCanvas.toDataURL('image/png');
    };

    const renderHighlights = (): void => {
        const { tip, scrolledToHighlightId } = state;
        const highlightsByPage = groupHighlightsByPage(highlights);

        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
            const highlightLayer = findOrCreateHighlightLayer(pageNumber);

            if (highlightLayer) {
                ReactDOM.render(
                    <div>
                        {(highlightsByPage[String(pageNumber)] || []).map((highlight, index) => {
                            const { position, ...rest } = highlight;

                            const viewportHighlight = {
                                position: scaledPositionToViewport(position),
                                ...rest,
                            };

                            if (!!tip && tip.highlight.id === String(highlight.id)) {
                                showTip(tip.highlight, tip.callback(viewportHighlight as ViewportHighlight));
                            }

                            const isScrolledTo = Boolean(scrolledToHighlightId === highlight.id);

                            return highlightTransform(
                                viewportHighlight as ViewportHighlight,
                                index,
                                (highlight, callback) => {
                                    setState({
                                        ...state,
                                        tip: { highlight, callback },
                                    });

                                    showTip(highlight, callback(highlight));
                                },
                                hideTipAndSelection,
                                rect => {
                                    const viewport = viewer.getPageView(pageNumber - 1).viewport;

                                    return viewportToScaled(rect, viewport);
                                },
                                boundingRect => screenshot(boundingRect, pageNumber),
                                isScrolledTo,
                            );
                        })}
                    </div>,
                    highlightLayer,
                );
            }
        }
    };

    const getBoundingRect = (clientRects: LTWH[]): LTWH => {
        const rects = Array.from(clientRects).map(rect => {
            const { left, top, width, height } = rect;
            const X0 = left;
            const X1 = left + width;
            const Y0 = top;
            const Y1 = top + height;
            return { X0, X1, Y0, Y1 };
        });

        const optimal = rects.reduce(
            (res, rect) => ({
                X0: Math.min(res.X0, rect.X0),
                X1: Math.max(res.X1, rect.X1),

                Y0: Math.min(res.Y0, rect.Y0),
                Y1: Math.max(res.Y1, rect.Y1),
            }),
            rects[0],
        );

        const { X0, X1, Y0, Y1 } = optimal;

        return {
            left: X0,
            top: Y0,
            width: X1 - X0,
            height: Y1 - Y0,
        };
    };

    const optimizeClientRects = (clientRects: LTWH[]): LTWH[] => {
        const sort = (rects: LTWH[]): LTWH[] => {
            return rects.sort((A, B) => {
                const top = A.top - B.top;

                if (top === 0) {
                    return A.left - B.left;
                }

                return top;
            });
        };

        const rects = sort(clientRects);
        const toRemove = new Set();

        const inside = (A: LTWH, B: LTWH): boolean => {
            return (
                A.top > B.top &&
                A.left > B.left &&
                A.top + A.height < B.top + B.height &&
                A.left + A.width < B.left + B.width
            );
        };

        const firstPass = rects.filter(rect => {
            return rects.every(otherRect => {
                return !inside(rect, otherRect);
            });
        });

        let passCount = 0;

        const sameLine = (A: LTWH, B: LTWH, yMargin = 5): boolean => {
            return Math.abs(A.top - B.top) < yMargin && Math.abs(A.height - B.height) < yMargin;
        };

        const overlaps = (A: LTWH, B: LTWH): boolean => A.left <= B.left && B.left <= A.left + A.width;

        const nextTo = (A: LTWH, B: LTWH, xMargin = 10): boolean => {
            const Aright = A.left + A.width;
            const Bright = B.left + B.width;
            return A.left <= B.left && Aright <= Bright && B.left - Aright <= xMargin;
        };

        // Extend width of A to cover B.
        const extendWidth = (A: LTWH, B: LTWH): void => {
            A.width = Math.max(B.width - A.left + B.left, A.width);
        };

        while (passCount <= 2) {
            firstPass.forEach(A => {
                firstPass.forEach(B => {
                    if (A === B || toRemove.has(A) || toRemove.has(B)) {
                        return;
                    }

                    if (!sameLine(A, B)) {
                        return;
                    }

                    if (overlaps(A, B)) {
                        extendWidth(A, B);
                        A.height = Math.max(A.height, B.height);
                        toRemove.add(B);
                    }

                    if (nextTo(A, B)) {
                        extendWidth(A, B);
                        toRemove.add(B);
                    }
                });
            });

            passCount += 1;
        }

        return firstPass.filter(rect => !toRemove.has(rect));
    };

    const getClientRects = (range: Range, containerEl: HTMLElement, shouldOptimize = true): LTWH[] => {
        const clientRects = Array.from(range.getClientRects());
        const offset = containerEl.getBoundingClientRect();

        const rects = clientRects.map(rect => ({
            top: rect.top + containerEl.scrollTop - offset.top,
            left: rect.left + containerEl.scrollLeft - offset.left,
            width: rect.width,
            height: rect.height,
        }));

        return shouldOptimize ? optimizeClientRects(rects) : rects;
    };

    const getPageFromElement = (target: HTMLElement): PageFromElement => {
        const node = target.closest('.page');

        if (!(node instanceof HTMLElement)) {
            return null;
        }

        const number = Number(node.dataset.pageNumber);
        return { node, number };
    };

    const getPageFromRange = (range: Range): PageFromElement | void => {
        const parentElement = range.startContainer.parentElement;

        if (!(parentElement instanceof HTMLElement)) {
            return;
        }

        return getPageFromElement(parentElement);
    };

    const afterSelection = (): void => {
        const { isCollapsed, range } = state;

        if (!range || isCollapsed) {
            return;
        }

        const page = getPageFromRange(range);

        if (!page) {
            return;
        }

        const rects = getClientRects(range, page.node);

        if (rects.length === 0) {
            return;
        }

        const boundingRect = getBoundingRect(rects);
        const viewportPosition = { boundingRect, rects, pageNumber: page.number };

        const content = {
            text: range.toString(),
        };

        const scaledPosition = viewportPositionToScaled(viewportPosition);

        renderTipAtPosition(
            viewportPosition,
            onSelectionFinished(
                scaledPosition,
                content,
                () => hideTipAndSelection(),
                () =>
                    setState({
                        ...state,
                        ghostHighlight: { position: scaledPosition } as Highlight,
                    }),
            ),
        );

        renderHighlights();
    };

    const debouncedAfterSelection = (): void => {
        setTimeout(() => {
            afterSelection();
        }, 500);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (event.code === 'Escape') {
            hideTipAndSelection();
        }
    };

    const onSelectionChange = (): void => {
        const selection = window.getSelection();

        if (!selection || selection.isCollapsed) {
            setState({ ...state, isCollapsed: true });
            return;
        }

        const range = selection.getRangeAt(0);

        if (!range) {
            return;
        }

        setState({
            ...state,
            isCollapsed: false,
            range,
        });

        debouncedAfterSelection();
    };

    const onScroll = (): void => {
        onScrollChange();
        setState({ ...state, scrolledToHighlightId: EMPTY_ID });
        renderHighlights();
        viewer.container.removeEventListener('scroll', onScroll);
    };

    const scrollTo = (highlight: Highlight): void => {
        const { pageNumber, boundingRect, usePdfCoordinates } = highlight.position;
        viewer.container.removeEventListener('scroll', onScroll);
        const pageViewport = viewer.getPageView(pageNumber - 1).viewport;
        const scrollMargin = 10;

        viewer.scrollPageIntoView({
            pageNumber,
            destArray: [
                null,
                { name: 'XYZ' },
                ...pageViewport.convertToPdfPoint(
                    0,
                    scaledToViewport(boundingRect, pageViewport, usePdfCoordinates).top - scrollMargin,
                ),
                0,
            ],
        });

        setState({ ...state, scrolledToHighlightId: highlight.id });
        renderHighlights();

        // Wait for scrolling to finish.
        setTimeout(() => {
            viewer.container.addEventListener('scroll', onScroll);
        }, 100);
    };

    const onDocumentReady = (): void => {
        viewer.currentScaleValue = 'auto';
        scrollRef(scrollTo);
    };

    useEffect(() => {
        if (prevHighlights !== highlights) {
            renderHighlights();
        }
    }, [highlights, prevHighlights]);

    useEffect(() => {
        linkServiceRef.current = new PDFLinkService();

        viewerRef.current = new PDFViewer({
            container: containerRef.current,
            enhanceTextSelection: true,
            removePageBorders: true,
            linkService: linkServiceRef.current,
        });

        viewer.setDocument(pdfDocument);
        linkService.setDocument(pdfDocument);
        linkService.setViewer(viewer);
        document.addEventListener('selectionchange', onSelectionChange);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('pagesinit', onDocumentReady);
        document.addEventListener('textlayerrendered', renderHighlights);

        return (): void => {
            document.removeEventListener('selectionchange', onSelectionChange);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('textlayerrendered', renderHighlights);
        };
    }, []);

    const onMouseDown = (e: PointerEvent<HTMLElement>): void => {
        if (!(e.target instanceof HTMLElement)) {
            return;
        }

        if (e.target.closest('.PdfHighlighter__tip-container')) {
            return;
        }

        hideTipAndSelection();
    };

    const toggleTextSelection = (flag: boolean) => (): void => {
        viewer.viewer.classList.toggle('PdfHighlighter--disable-selection', flag);
    };

    const handleMouseSelectionChange = (isVisible: boolean): void => {
        setState({ ...state, isAreaSelectionInProgress: isVisible });
    };

    const handleShouldStart = (e: MouseEvent): boolean => {
        return enableAreaSelection(e) && e.target instanceof HTMLElement && Boolean(e.target.closest('.page'));
    };

    const handleSelection = (startTarget: HTMLElement, boundingRect: LTWH, resetSelection: () => void): void => {
        const page = getPageFromElement(startTarget);

        if (!page) {
            return;
        }

        const pageBoundingRect = {
            ...boundingRect,
            top: boundingRect.top - page.node.offsetTop,
            left: boundingRect.left - page.node.offsetLeft,
        };

        const viewportPosition = {
            boundingRect: pageBoundingRect,
            rects: [],
            pageNumber: page.number,
        };

        const scaledPosition = viewportPositionToScaled(viewportPosition);

        const image = screenshot(pageBoundingRect, page.number);

        renderTipAtPosition(
            viewportPosition,
            onSelectionFinished(
                scaledPosition,
                { image },
                () => hideTipAndSelection(),
                () =>
                    setState({
                        ...state,
                        ghostHighlight: {
                            position: scaledPosition,
                            content: { image },
                        } as Highlight,
                    }),
            ),
        );

        resetSelection();
        renderHighlights();
    };

    return (
        <Box onPointerDown={onMouseDown}>
            <div ref={containerRef} className="PdfHighlighter" onContextMenu={handleContextMenu}>
                <div className="pdfViewer" />
                {typeof enableAreaSelection === 'function' ? (
                    <MouseSelection
                        onDragStart={toggleTextSelection(true)}
                        onDragEnd={toggleTextSelection(false)}
                        onChange={handleMouseSelectionChange}
                        shouldStart={handleShouldStart}
                        onSelection={handleSelection}
                    />
                ) : null}
            </div>
        </Box>
    );
};
