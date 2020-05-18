import 'pdfjs-dist/web/pdf_viewer.css';
import 'pdfjs-dist/web/pdf_viewer.js';

import { Box } from '@material-ui/core';
import { PDFDocumentProxy } from 'pdfjs-dist';
import { PDFLinkService, PDFViewer } from 'pdfjs-dist/web/pdf_viewer';
import React, { PointerEvent, ReactElement, SyntheticEvent, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';

import {
    findOrCreateContainerLayer,
    getAreaAsPng,
    getBoundingRect,
    getClientRects,
    getPageFromElement,
    getPageFromRange,
    scaledToViewport,
    viewportToScaled,
} from '../../lib';
import {
    Highlight,
    HighlightComment,
    LTWH,
    PDFJSLinkService,
    PDFJSViewer,
    Position,
    Scaled,
    ScaledPosition,
    ViewportHighlight,
} from '../../types';
import { usePrevious } from '../../utils';
import { MouseSelection } from './MouseSelection';
import { TipContainer } from './TipContainer';

interface State {
    ghostHighlight: Highlight | null;
    isCollapsed: boolean;
    range: Range | null;
    tip: {
        highlight: ViewportHighlight;
        callback: (highlight: ViewportHighlight) => HighlightComment;
    } | null;
    isAreaSelectionInProgress: boolean;
    scrolledToHighlightId: string;
}

interface Props {
    highlightTransform: (
        highlight: ViewportHighlight,
        index: number,
        setTip: (highlight: ViewportHighlight, callback: (highlight: ViewportHighlight) => ReactElement) => void,
        hideTip: () => void,
        viewportToScaled: (rect: LTWH) => Scaled,
        screenshot: (position: LTWH) => string,
        isScrolledTo: boolean,
    ) => ReactElement;
    highlights: Highlight[];
    onScrollChange: () => void;
    scrollRef: (scrollTo: (highlight: Highlight) => void) => void;
    pdfDocument: PDFDocumentProxy;
    onSelectionFinished: (
        position: ScaledPosition,
        content: { text?: string; image?: string },
        hideTipAndSelection: () => void,
        transformSelection: () => void,
    ) => ReactElement;
    enableAreaSelection: (e: MouseEvent) => boolean;
}

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

    const viewportPositionToScaled = ({ pageNumber, boundingRect, rects }: Position): ScaledPosition => {
        const viewport = viewer.getPageView(pageNumber - 1).viewport;

        return {
            boundingRect: viewportToScaled(boundingRect, viewport),
            rects: (rects || []).map(rect => viewportToScaled(rect, viewport)),
            pageNumber,
        };
    };

    const renderTipAtPosition = (position: Position, inner: ReactElement): void => {
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

    const showTip = (highlight: ViewportHighlight, content: ReactElement): void => {
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
        return getAreaAsPng(canvas, position);
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
