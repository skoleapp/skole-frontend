import React { useState, useRef, useEffect, ReactElement } from "react";
import ReactDOM from "react-dom";
import {
  PDFViewer,
  PDFLinkService,
} from "pdfjs-dist/web/pdf_viewer";

import "pdfjs-dist/web/pdf_viewer.css";
import { getBoundingRect, getClientRects, getAreaAsPNG,  getPageFromRange,
    getPageFromElement,
    findOrCreateContainerLayer, scaledToViewport, viewportToScaled } from "../../lib";

import { TipContainer } from "./TipContainer";
import { MouseSelection } from "./MouseSelection";
import { PDFJSViewer, PDFJSLinkService, Highlight, ViewportHighlight, LTWH, Scaled, ScaledPosition, Position } from "../../types";
import { usePrevious } from "../../utils";
import { PDFDocumentProxy } from "pdfjs-dist";
import { ReactElement } from "react";

interface Props {
  highlightTransform: (
    highlight: ViewportHighlight<Highlight>,
    index: number,
    setTip: (
      highlight: ViewportHighlight<Highlight>,
      callback: (highlight: ViewportHighlight<Highlight>) => ReactElement
    ) => void,
    hideTip: () => void,
    viewportToScaled: (rect: LTWH) => Scaled,
    screenshot: (position: LTWH) => string,
    isScrolledTo: boolean
  ) => ReactElement,
  highlights: Array<Highlight>,
  onScrollChange: () => void,
  scrollRef: (scrollTo: (highlight: Highlight) => void) => void,
  pdfDocument: PDFDocumentProxy,
  onSelectionFinished: (
    position: ScaledPosition,
    content: { text?: string, image?: string },
    hideTipAndSelection: () => void,
    transformSelection: () => void
  ) => ReactElement,
  enableAreaSelection: (event: MouseEvent) => boolean
};

const EMPTY_ID = "empty-id";
const PDFHighlighter: React.FC<{}> => ({ highlightTransform, highlights, onScrollChange, scrollRef, pdfDocument, onSelectionFinished, enableAreaSelection }) => {
  const [state, setState] = useState({
    ghostHighlight: null,
    isCollapsed: true,
    range: null,
    scrolledToHighlightId: EMPTY_ID,
    isAreaSelectionInProgress: false,
    tip: null
  })

  const viewerRef = useRef<PDFJSViewer>(null);
  const linkServiceRef = useRef<PDFJSLinkService>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const prevHighlights = usePrevious(highlights)

  // debouncedAfterSelection: () => void;

  const groupHighlightsByPage = (
    highlights: Array<Highlight>
  ): { [pageNumber: string]: Array<Highlight> } => {
    return [...highlights, state.ghostHighlight]
      .filter(Boolean)
      .reduce((res, highlight) => {
        const { pageNumber } = highlight.position;
        res[pageNumber] = res[pageNumber] || [];
        res[pageNumber].push(highlight);
        return res;
      }, {});
  }

  const findOrCreateHighlightLayer = (page: number) => {
    const viewer = viewerRef.current as PDFJSViewer
    const textLayer = viewer.getPageView(page - 1).textLayer;

    if (!textLayer) {
      return null;
    }

    return findOrCreateContainerLayer(
      textLayer.textLayerDiv,
      "PdfHighlighter__highlight-layer"
    );
  }

  const scaledPositionToViewport = ({
    pageNumber,
    boundingRect,
    rects,
    usePdfCoordinates
  }: ScaledPosition): Position => {
    const viewer = viewerRef.current as PDFJSViewer
    const viewport = viewer.getPageView(pageNumber - 1).viewport;

    return {
      boundingRect: scaledToViewport(boundingRect, viewport, usePdfCoordinates),
      rects: (rects || []).map(rect =>
        scaledToViewport(rect, viewport, usePdfCoordinates)
      ),
      pageNumber
    };
  }

const showTip = (highlight: ViewportHighlight<Highlight>, content: ReactElement) => {
  const {
    isCollapsed,
    ghostHighlight,
    isAreaSelectionInProgress
  } = this.state;

  const highlightInProgress = !isCollapsed || ghostHighlight;

  if (highlightInProgress || isAreaSelectionInProgress) {
    return;
  }

  this.renderTipAtPosition(highlight.position, content);
}

  const renderHighlights = () => {
    const { tip, scrolledToHighlightId } = state;
    const highlightsByPage = groupHighlightsByPage(highlights);

    for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber++) {
      const highlightLayer = findOrCreateHighlightLayer(pageNumber);
      const viewer = viewerRef.current as PDFJSViewer

      if (highlightLayer) {
        ReactDOM.render(
          <div>
            {(highlightsByPage[String(pageNumber)] || []).map(
              (highlight, index) => {
                const { position, ...rest } = highlight;

                const viewportHighlight = {
                  position: scaledPositionToViewport(position),
                  ...rest
                };

                if (tip && tip.highlight.id === String(highlight.id)) {
                  showTip(tip.highlight, tip.callback(viewportHighlight));
                }

                const isScrolledTo = Boolean(
                  scrolledToHighlightId === highlight.id
                );

                return highlightTransform(
                  viewportHighlight,
                  index,
                  (highlight, callback) => {
                    setState({
                      tip: { highlight, callback }
                    });

                    showTip(highlight, callback(highlight));
                  },
                  hideTipAndSelection,
                  rect => {
                    const viewport = viewer.getPageView(pageNumber - 1)
                      .viewport;

                    return viewportToScaled(rect, viewport);
                  },
                  boundingRect => this.screenshot(boundingRect, pageNumber),
                  isScrolledTo
                );
              }
            )}
          </div>,
          highlightLayer
        );
      }
    }
  }

  useEffect(() => {
    if (prevHighlights !== highlights) {
      renderHighlights();
    }
  }, [highlights, prevHighlights])

  componentDidMount() {
    const { pdfDocument } = this.props;

    this.debouncedAfterSelection = _.debounce(500, this.afterSelection);
    this.linkService = new PDFLinkService();

    this.viewer = new PDFViewer({
      container: this.containerNode,
      enhanceTextSelection: true,
      removePageBorders: true,
      linkService: this.linkService
    });

    this.viewer.setDocument(pdfDocument);
    this.linkService.setDocument(pdfDocument);
    this.linkService.setViewer(this.viewer);

    // debug
    window.PdfViewer = this;

    document.addEventListener("selectionchange", this.onSelectionChange);
    document.addEventListener("keydown", this.handleKeyDown);

    document.addEventListener("pagesinit", () => {
      this.onDocumentReady();
    });

    document.addEventListener("textlayerrendered", this.onTextLayerRendered);
  }

  componentWillUnmount() {
    document.removeEventListener("selectionchange", this.onSelectionChange);
    document.removeEventListener("keydown", this.handleKeyDown);
    document.removeEventListener("textlayerrendered", this.onTextLayerRendered);
  }

  viewportPositionToScaled({
    pageNumber,
    boundingRect,
    rects
  }: T_Position): T_ScaledPosition {
    const viewport = this.viewer.getPageView(pageNumber - 1).viewport;

    return {
      boundingRect: viewportToScaled(boundingRect, viewport),
      rects: (rects || []).map(rect => viewportToScaled(rect, viewport)),
      pageNumber
    };
  }

  screenshot(position: T_LTWH, pageNumber: number) {
    const canvas = this.viewer.getPageView(pageNumber - 1).canvas;

    return getAreaAsPng(canvas, position);
  }

  hideTipAndSelection = () => {
    const tipNode = findOrCreateContainerLayer(
      this.viewer.viewer,
      "PdfHighlighter__tip-layer"
    );

    ReactDom.unmountComponentAtNode(tipNode);

    this.setState({ ghostHighlight: null, tip: null }, () =>
      this.renderHighlights()
    );
  };

  renderTipAtPosition(position: T_Position, inner: ?React$Element<*>) {
    const { boundingRect, pageNumber } = position;

    const page = {
      node: this.viewer.getPageView(pageNumber - 1).div
    };

    const pageBoundingRect = page.node.getBoundingClientRect();

    const tipNode = findOrCreateContainerLayer(
      this.viewer.viewer,
      "PdfHighlighter__tip-layer"
    );

    ReactDom.render(
      <TipContainer
        scrollTop={this.viewer.container.scrollTop}
        pageBoundingRect={pageBoundingRect}
        style={{
          left:
            page.node.offsetLeft + boundingRect.left + boundingRect.width / 2,
          top: boundingRect.top + page.node.offsetTop,
          bottom: boundingRect.top + page.node.offsetTop + boundingRect.height
        }}
        children={inner}
      />,
      tipNode
    );
  }

  onTextLayerRendered = () => {
    this.renderHighlights();
  };

  scrollTo = (highlight: T_Highlight) => {
    const { pageNumber, boundingRect, usePdfCoordinates } = highlight.position;

    this.viewer.container.removeEventListener("scroll", this.onScroll);

    const pageViewport = this.viewer.getPageView(pageNumber - 1).viewport;

    const scrollMargin = 10;

    this.viewer.scrollPageIntoView({
      pageNumber,
      destArray: [
        null,
        { name: "XYZ" },
        ...pageViewport.convertToPdfPoint(
          0,
          scaledToViewport(boundingRect, pageViewport, usePdfCoordinates).top -
            scrollMargin
        ),
        0
      ]
    });

    this.setState(
      {
        scrolledToHighlightId: highlight.id
      },
      () => this.renderHighlights()
    );
    // wait for scrolling to finish
    setTimeout(() => {
      this.viewer.container.addEventListener("scroll", this.onScroll);
    }, 100);
  };

  onDocumentReady = () => {
    const { scrollRef } = this.props;

    this.viewer.currentScaleValue = "auto";

    scrollRef(this.scrollTo);
  };

  onSelectionChange = () => {
    const selection: Selection = window.getSelection();

    if (selection.isCollapsed) {
      this.setState({ isCollapsed: true });
      return;
    }

    const range = selection.getRangeAt(0);

    if (!range) {
      return;
    }

    this.setState({
      isCollapsed: false,
      range
    });

    this.debouncedAfterSelection();
  };

  onScroll = () => {
    const { onScrollChange } = this.props;

    onScrollChange();

    this.setState(
      {
        scrolledToHighlightId: EMPTY_ID
      },
      () => this.renderHighlights()
    );

    this.viewer.container.removeEventListener("scroll", this.onScroll);
  };

  onMouseDown = (event: MouseEvent) => {
    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    if (event.target.closest(".PdfHighlighter__tip-container")) {
      return;
    }

    this.hideTipAndSelection();
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Escape") {
      this.hideTipAndSelection();
    }
  };

  afterSelection = () => {
    const { onSelectionFinished } = this.props;

    const { isCollapsed, range } = this.state;

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
      text: range.toString()
    };
    const scaledPosition = this.viewportPositionToScaled(viewportPosition);

    this.renderTipAtPosition(
      viewportPosition,
      onSelectionFinished(
        scaledPosition,
        content,
        () => this.hideTipAndSelection(),
        () =>
          this.setState(
            {
              ghostHighlight: { position: scaledPosition }
            },
            () => this.renderHighlights()
          )
      )
    );
  };

  toggleTextSelection(flag: boolean) {
    this.viewer.viewer.classList.toggle(
      "PdfHighlighter--disable-selection",
      flag
    );
  }

    const { onSelectionFinished, enableAreaSelection } = this.props;

    return (
      <Pointable onPointerDown={this.onMouseDown}>
        <div
          ref={node => (this.containerNode = node)}
          className="PdfHighlighter"
          onContextMenu={e => e.preventDefault()}
        >
          <div className="pdfViewer" />
          {typeof enableAreaSelection === "function" ? (
            <MouseSelection
              onDragStart={() => this.toggleTextSelection(true)}
              onDragEnd={() => this.toggleTextSelection(false)}
              onChange={isVisible =>
                this.setState({ isAreaSelectionInProgress: isVisible })
              }
              shouldStart={event =>
                enableAreaSelection(event) &&
                event.target instanceof HTMLElement &&
                Boolean(event.target.closest(".page"))
              }
              onSelection={(startTarget, boundingRect, resetSelection) => {
                const page = getPageFromElement(startTarget);

                if (!page) {
                  return;
                }

                const pageBoundingRect = {
                  ...boundingRect,
                  top: boundingRect.top - page.node.offsetTop,
                  left: boundingRect.left - page.node.offsetLeft
                };

                const viewportPosition = {
                  boundingRect: pageBoundingRect,
                  rects: [],
                  pageNumber: page.number
                };

                const scaledPosition = this.viewportPositionToScaled(
                  viewportPosition
                );

                const image = this.screenshot(pageBoundingRect, page.number);

                this.renderTipAtPosition(
                  viewportPosition,
                  onSelectionFinished(
                    scaledPosition,
                    { image },
                    () => this.hideTipAndSelection(),
                    () =>
                      this.setState(
                        {
                          ghostHighlight: {
                            position: scaledPosition,
                            content: { image }
                          }
                        },
                        () => {
                          resetSelection();
                          this.renderHighlights();
                        }
                      )
                  )
                );
              }}
            />
          ) : null}
        </div>
      </Pointable>
    );
}
