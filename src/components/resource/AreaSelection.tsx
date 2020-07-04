import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

import { usePDFViewerContext } from '../../context';
import { LTWH, PDFTranslation } from '../../types';

interface State {
    locked: boolean;
    start: PDFTranslation | null;
    end: PDFTranslation | null;
}

interface PageFromElement {
    node: HTMLElement;
    number: number;
}

const initialState = { start: null, end: null, locked: false };

export const AreaSelection: React.FC = () => {
    const { setScreenshot } = usePDFViewerContext();
    const [stateRef, setState] = useStateRef<State>(initialState); // We must use a mutable ref object instead of immutable state to keep track with the state during gestures and mouse selection.
    const { start, end } = stateRef.current;

    // Ignore: Document node is always defined even if the PDF fails to load.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const getDocumentNode = (): Element => document.querySelector('.react-pdf__Document')!;

    // Get rectangle coordinates on container element.
    const getBoundingRect = (start: PDFTranslation, end: PDFTranslation): LTWH => ({
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    });

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

        if (!!newCanvas && !!newCanvasContext && !!canvas && !!width && !!height) {
            // FIXME: This might cause issues on some small devices, resulting in misaligned screenshots.
            const dpr: number = window.devicePixelRatio;
            newCanvasContext.drawImage(canvas, left * dpr, top * dpr, width * dpr, height * dpr, 0, 0, width, height);
            return newCanvas.toDataURL('image/jpeg');
        } else {
            return null;
        }
    };

    const onSelection = (startTarget: HTMLElement, boundingRect: LTWH): void => {
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

    // Get coordinates on container element.
    const getContainerCoords = (pageX: number, pageY: number): PDFTranslation => {
        const documentNode = getDocumentNode();
        const { left, top } = documentNode.getBoundingClientRect();

        return {
            x: pageX - left + documentNode.scrollLeft,
            y: pageY - top + documentNode.scrollTop,
        };
    };

    // Update mutable state when mouse moves (desktop).
    const onMouseMove = (e: MouseEvent): void => {
        const { start, locked } = stateRef.current;

        if (!!start && !locked) {
            setState({
                ...stateRef.current,
                end: getContainerCoords(e.pageX, e.pageY),
            });
        }
    };

    // Call selection function when a valid rectangle is drawn (desktop).
    const onMouseDown = (e: MouseEvent): (() => void) | void => {
        const startTarget = e.target;
        const documentNode = getDocumentNode();

        const onMouseUp = (e: MouseEvent): void => {
            const { start } = stateRef.current;
            const { currentTarget } = e;

            // Emulate listen once.
            !!currentTarget && currentTarget.removeEventListener('mouseup', onMouseUp as EventListener);

            if (!!start) {
                const end = getContainerCoords(e.pageX, e.pageY);
                const boundingRect = getBoundingRect(start, end);

                if (documentNode.contains(e.target as Node)) {
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
                    setState(initialState);
                }
            } else {
                setState(initialState);
            }
        };

        setState({
            start: getContainerCoords(e.pageX, e.pageY),
            end: null,
            locked: false,
        });

        document.body.addEventListener('mouseup', onMouseUp as EventListener);

        return (): void => {
            document.body.removeEventListener('mouseup', onMouseUp as EventListener);
        };
    };

    // Update mutable state when touch moves (mobile).
    const onTouchMove = (e: TouchEvent): void => {
        e.preventDefault(); // Prevent reloading page when panning down.
        const { start, locked } = stateRef.current;

        if (!!start && !locked) {
            setState({
                ...stateRef.current,
                end: getContainerCoords(e.changedTouches[0].pageX, e.changedTouches[0].pageY),
            });
        }
    };

    // Call selection function when a valid rectangle is drawn (mobile).
    const onTouchStart = (e: TouchEvent): (() => void) | void => {
        e.preventDefault(); // Prevent screen flashing when starting to draw rectangle.
        const documentNode = getDocumentNode();
        const startTarget = e.target;

        const onTouchUp = (e: TouchEvent): void => {
            const { start } = stateRef.current;
            const { currentTarget } = e;

            // Emulate listen once.
            !!currentTarget && currentTarget.removeEventListener('mouseup', onTouchUp as EventListener);

            if (!!start) {
                const end = getContainerCoords(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
                const boundingRect = getBoundingRect(start, end);

                if (documentNode.contains(e.target as Node)) {
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
                    setState(initialState);
                }
            } else {
                setState(initialState);
            }
        };

        setState({
            start: getContainerCoords(e.targetTouches[0].pageX, e.targetTouches[0].pageY),
            end: null,
            locked: false,
        });

        document.body.addEventListener('touchend', onTouchUp as EventListener);

        return (): void => {
            document.body.removeEventListener('touchend', onTouchUp as EventListener);
        };
    };

    useEffect(() => {
        const documentNode = getDocumentNode();

        if (!!documentNode) {
            documentNode.addEventListener('touchmove', onTouchMove as EventListener);
            documentNode.addEventListener('touchstart', onTouchStart as EventListener);
            documentNode.addEventListener('mousemove', onMouseMove as EventListener, { passive: true });
            documentNode.addEventListener('mousedown', onMouseDown as EventListener, { passive: true });
        }

        return (): void => {
            documentNode.removeEventListener('touchmove', onTouchMove as EventListener);
            documentNode.removeEventListener('touchstart', onTouchStart as EventListener);
            documentNode.removeEventListener('mousemove', onMouseMove as EventListener);
            documentNode.removeEventListener('mousedown', onMouseDown as EventListener);
            setState(initialState);
        };
    }, []);

    return !!start && !!end ? <StyledAreaSelection style={getBoundingRect(start, end)} /> : null;
};

const StyledAreaSelection = styled(Box)`
    position: absolute;
    border: 0.05rem dashed #000000;
    background-color: rgba(173, 54, 54, 0.5); // Primary color with opacity.
`;
