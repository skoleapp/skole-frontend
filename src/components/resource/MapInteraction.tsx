import { Box } from '@material-ui/core';
import React, { ReactElement, useEffect, useState } from 'react';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { PDFTranslation } from '../../types';

type MouseOrTouch = MouseEvent | Touch;

interface Props {
    children: ReactElement;
}

export const MapInteraction: React.FC<Props> = ({ children }) => {
    const {
        translation,
        setTranslation,
        scale,
        setScale,
        setCtrlKey,
        drawMode,
        fullscreen,
        ctrlKey,
        startPointers,
        setStartPointers,
    } = usePDFViewerContext();

    const isMobile = useDeviceContext();
    const minScale = 1;
    const maxScale = 5;
    const minTransX = -Infinity;
    const minTransY = -Infinity;
    const maxTransX = Infinity;
    const maxTransY = Infinity;

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

    const handleSetStartPointers = (pointers: TouchList | MouseEvent[]): void =>
        setStartPointers(() => (!!pointers.length ? pointers : startPointers));

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
            // e.deltaY < 0 ? handleScaleUp() : handleScaleDown();

            // disableFullscreen();
            e.preventDefault(); // Disables scroll behavior.
            e.stopPropagation();
            const scaleChange = 2 ** (e.deltaY * 0.002);
            // const scaleChange = e.deltaY < 0 ? 0.05 : -0.05;
            const newScale = getClampedScale(minScale, scale + scaleChange, maxScale);
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
        const isPinchAction = e.touches.length === 2 && startPointers.length > 1;

        if (isPinchAction) {
            scaleFromMultiTouch(e);
        }
    };

    const onTouchEnd = (e: TouchEvent): void => handleSetStartPointers(e.touches);

    useEffect(() => {
        const documentNode = document.querySelector('.react-pdf__Document');

        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        if (!!documentNode) {
            // TODO: Add a listener that updates the page number based on scroll position.
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

    return (
        <StyledMapInteraction
            scale={scale}
            translation={translation}
            fullscreen={fullscreen}
            drawMode={drawMode}
            isMobile={isMobile}
            ctrlKey={ctrlKey}
        >
            {children}
        </StyledMapInteraction>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledMapInteraction = styled(({ scale, translation, fullscreen, drawMode, isMobile, ctrlKey, ...props }) => (
    <Box {...props} />
))`
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
}
`;
