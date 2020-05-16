import { LTWH, Scaled, ViewPort } from '../types';

type WidthHeight = { width: number; height: number };

export const viewportToScaled = (rect: LTWH, { width, height }: WidthHeight): Scaled => ({
    x1: rect.left,
    y1: rect.top,
    x2: rect.left + rect.width,
    y2: rect.top + rect.height,
    width,
    height,
});

const pdfToViewport = (pdf: Scaled, viewport: ViewPort): LTWH => {
    const [x1, y1, x2, y2] = viewport.convertToViewportRectangle([pdf.x1, pdf.y1, pdf.x2, pdf.y2]);

    return {
        left: x1,
        top: y1,
        width: x2 - x1,
        height: y1 - y2,
    };
};

export const scaledToViewport = (scaled: Scaled, viewport: ViewPort, usePdfCoordinates = false): LTWH => {
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

export const getAreaAsPng = (canvas: HTMLCanvasElement, position: LTWH): string => {
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

export const getBoundingRect = (clientRects: Array<LTWH>): LTWH => {
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

export const optimizeClientRects = (clientRects: Array<LTWH>): Array<LTWH> => {
    const sort = (rects: Array<LTWH>): Array<LTWH> => {
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

export const getClientRects = (range: Range, containerEl: HTMLElement, shouldOptimize = true): Array<LTWH> => {
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

type PageFromElement = { node: HTMLElement; number: number } | null;

export const getPageFromElement = (target: HTMLElement): PageFromElement => {
    const node = target.closest('.page');

    if (!(node instanceof HTMLElement)) {
        return null;
    }

    const number = Number(node.dataset.pageNumber);
    return { node, number };
};

export const getPageFromRange = (range: Range): PageFromElement | void => {
    const parentElement = range.startContainer.parentElement;

    if (!(parentElement instanceof HTMLElement)) {
        return;
    }

    return getPageFromElement(parentElement);
};

export const findOrCreateContainerLayer = (container: HTMLElement, className: string): Element => {
    let layer = container.querySelector(`.${className}`);

    if (!layer) {
        layer = document.createElement('div');
        layer.className = className;
        container.appendChild(layer);
    }

    return layer;
};
