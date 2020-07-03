import { Box } from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { PDFTranslation } from 'src/types';
import { defaultScale, defaultTranslation, maxScale, minScale } from 'src/utils';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { MapControls } from '.';

interface StartPointersInfo {
    translation: PDFTranslation;
    scale: number;
    pointers: TouchList;
}

// TODO: Add a listener that updates the page number based on scroll position.
// TODO: Find a way to improve the performance as the animations are now a bit laggy at least on mobile.
// TODO: Improve zoom on mobile when user has scrolled down to a point.
export const MapInteraction: React.FC = ({ children }) => {
    const isMobile = useDeviceContext();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [startPointersInfo, setStartPointersInfo] = useState<StartPointersInfo | null>(null); // We must use a mutable ref object instead of immutable state to keep track with the start pointer state during gestures.

    const {
        drawMode,
        setFullscreen,
        ctrlKey,
        setCtrlKey,
        scale,
        setScale,
        translation,
        setTranslation,
    } = usePDFViewerContext();

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

    const setPointerState = (pointers: TouchList): void => {
        if (!!pointers.length) {
            setStartPointersInfo({
                pointers,
                scale,
                translation,
            });
        }
    };

    // Return touch point on element.
    const getTouchPoint = (t: Touch): PDFTranslation => ({ x: t.clientX, y: t.clientY });

    // Return distance between points.
    const getDistance = (p1: PDFTranslation, p2: PDFTranslation): number => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    };

    // Get distance between fingers.
    const getTouchDistance = (t0: Touch, t1: Touch): number => {
        const p0 = getTouchPoint(t0);
        const p1 = getTouchPoint(t1);
        return getDistance(p0, p1);
    };

    // Get clamped scale if maximum scale has been exceeded.
    const getClampedScale = (min: number, value: number, max: number): number => Math.max(min, Math.min(value, max));

    // Ignore: Ref is always set on container element.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const getContainerNode = (): HTMLDivElement => containerRef.current!;
    const getContainerBoundingClientRect = (): DOMRect => getContainerNode().getBoundingClientRect();
    const getMapInteractionNode = (): HTMLDivElement => document.querySelector('#map-interaction') as HTMLDivElement;

    // Get clamped translation if translation bounds have been exceeded.
    const getClampedTranslation = (desiredTranslation: PDFTranslation): PDFTranslation => {
        const { x, y } = desiredTranslation;
        const xMin = -Infinity;
        const xMax = Infinity;
        const yMin = -Infinity;
        const yMax = Infinity;

        return {
            x: getClampedScale(xMin, x, xMax),
            y: getClampedScale(yMin, y, yMax),
        };
    };

    // Get mid point between translation points.
    const getMidPoint = (p1: PDFTranslation, p2: PDFTranslation): PDFTranslation => ({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    });

    // Return calculated translation from container position.
    const getTranslatedOrigin = (translation: PDFTranslation): PDFTranslation => {
        const clientOffset = getContainerBoundingClientRect();

        return {
            x: clientOffset.left + translation.x,
            y: clientOffset.top + translation.y,
        };
    };

    // From a given screen point return it as a point in the coordinate system of the given translation.
    const getClientPosToTranslatedPos = (
        { x, y }: PDFTranslation,
        _translation: PDFTranslation = translation,
    ): PDFTranslation => {
        const origin = getTranslatedOrigin(_translation);

        return {
            x: x - origin.x,
            y: y - origin.y,
        };
    };

    // The amount that a value of a dimension will change given a new scale.
    const getCoordChange = (coordinate: number, scaleRatio: number): number => scaleRatio * coordinate - coordinate;

    // Given the start touches and new e.touches, scale and translation such that the initial midpoint remains as the new midpoint.
    // This is to achieve the effect of keeping the content that was directly in the middle of the two fingers as the focal point throughout the zoom.
    const scaleFromMultiTouch = (e: TouchEvent): void => {
        // Ignore: This function is only called when the start pointers info exists.
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const { pointers: startTouches, scale: startScale, translation: startTranslation } = startPointersInfo!;
        const newTouches = e.touches;

        // Calculate new scale.
        const dist0 = getTouchDistance(startTouches[0], startTouches[1]);
        const dist1 = getTouchDistance(newTouches[0], newTouches[1]);
        const scaleChange = dist1 / dist0;
        const targetScale = startScale + (scaleChange - 1) * startScale;
        const newScale = getClampedScale(minScale, targetScale, maxScale);
        const scaleRatio = newScale / startScale;

        // Calculate mid points.
        const startMidpoint = getMidPoint(getTouchPoint(startTouches[0]), getTouchPoint(startTouches[1]));
        const newMidPoint = getMidPoint(getTouchPoint(newTouches[0]), getTouchPoint(newTouches[1]));

        // The amount we need to translate by in order for the mid point to stay in the middle (before thinking about scaling factor.
        const dragDelta = {
            x: newMidPoint.x - startMidpoint.x,
            y: newMidPoint.y - startMidpoint.y,
        };

        // The point originally in the middle of the fingers on the initial zoom start
        const focalPoint = getClientPosToTranslatedPos(startMidpoint, startTranslation);

        // The amount that the middle point has changed from this scaling
        const focalPtDelta = {
            x: getCoordChange(focalPoint.x, scaleRatio),
            y: getCoordChange(focalPoint.y, scaleRatio),
        };

        // Translation is the original translation, plus the amount we dragged, minus what the scaling will do to the focal point.
        // Subtracting the scaling factor keeps the midpoint in the middle of the touch points.
        const newTranslation = {
            x: startTranslation.x - focalPtDelta.x + dragDelta.x,
            y: startTranslation.y - focalPtDelta.y + dragDelta.y,
        };

        setScale(newScale);
        setTranslation(getClampedTranslation(newTranslation));
    };

    // TODO: Find a way to set X-axis translation so that the zooming in won't cut out areas.
    // Scale the document from a given point where cursor is upon mouse wheel press.
    const scaleFromPoint = (newScale: number, focalPoint: PDFTranslation): void => {
        const scaleRatio = newScale / scale;

        const focalPointDelta = {
            x: getCoordChange(focalPoint.x, scaleRatio),
            y: getCoordChange(focalPoint.y, scaleRatio),
        };

        const newTranslation = {
            x: translation.x - focalPointDelta.x,
            y: translation.y - focalPointDelta.y,
        };

        setScale(newScale);
        setTranslation(getClampedTranslation(newTranslation));
    };

    // Update document scale based on mouse wheel events.
    const onWheel = (e: WheelEvent): void => {
        if (e.ctrlKey) {
            setFullscreen(false);
            e.preventDefault(); // Disables scroll behavior.
            const scaleChange = 2 ** (e.deltaY * 0.002);
            const newScale = getClampedScale(minScale, scale + (1 - scaleChange), maxScale);
            const mousePos = getClientPosToTranslatedPos({ x: 0, y: e.clientY });
            scaleFromPoint(newScale, mousePos);
        }
    };

    const onTouchStart = (e: TouchEvent): void => setPointerState(e.touches);

    const onTouchMove = (e: TouchEvent): void => {
        if (!!startPointersInfo) {
            const isPinchAction = e.touches.length === 2 && startPointersInfo.pointers.length > 1;

            if (isPinchAction) {
                e.preventDefault(); // Prevent scrolling.
                scaleFromMultiTouch(e);
            }
        }
    };

    const onTouchEnd = (e: TouchEvent): void => {
        setPointerState(e.touches);

        // Bounce back to original size if pinched out.
        if (scale < defaultScale) {
            setScale(defaultScale);
            setTranslation(defaultTranslation);
        }
    };

    useEffect(() => {
        const containerNode = getContainerNode();

        if (!!containerNode && !drawMode) {
            containerNode.addEventListener('wheel', onWheel as EventListener);
            containerNode.addEventListener('touchstart', onTouchStart as EventListener, { passive: true });
            containerNode.addEventListener('touchmove', onTouchMove as EventListener);
            containerNode.addEventListener('touchend', onTouchEnd as EventListener, { passive: true });
        }

        return (): void => {
            containerNode.removeEventListener('wheel', onWheel as EventListener);
            containerNode.removeEventListener('touchstart', onTouchStart as EventListener);
            containerNode.removeEventListener('touchmove', onTouchMove as EventListener);
            containerNode.removeEventListener('touchend', onTouchEnd as EventListener);
        };
    }, [startPointersInfo, translation, scale, drawMode]);

    // Listen for key presses in order to show different cursor when CTRL key is pressed.
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return (): void => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // Automatically scroll to center when zooming in on desktop.
    useEffect(() => {
        const mapInteractionNode = getMapInteractionNode();
        mapInteractionNode.scrollLeft = (mapInteractionNode.scrollWidth - mapInteractionNode.clientWidth) / 2;
    }, [scale]);

    const cursor = `${drawMode ? 'pointer' : ctrlKey ? 'all-scroll' : 'default'}`; // On desktop show different cursor when CTRL key is pressed.
    const overflow = `${drawMode && isMobile ? 'hidden' : 'auto'}`; // Disable scrolling when draw mode is on on mobile.
    const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`; // Translate first and then scale. Otherwise, the scale would affect the translation.
    const transformOrigin = scale < 1 ? '50% 0' : '0 0'; // When in fullscreen and zooming in from that, we set the transform origin to top left. Otherwise we center the document.
    const width = `calc(100% * ${scale})`;
    const mapInteractionProps = { cursor, overflow };
    const containerProps = { transform, transformOrigin, width };

    const renderMapInteractionCSS = (
        <StyledMapInteractionCSS id="map-interaction" {...mapInteractionProps}>
            <StyledContainer {...containerProps}>{children}</StyledContainer>
        </StyledMapInteractionCSS>
    );

    const renderControls = !isMobile && !drawMode && <MapControls scaleFromPoint={scaleFromPoint} />;

    return (
        // Ignore: This is an issue with MUI: https://github.com/mui-org/material-ui/issues/17010#issuecomment-584223410
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        <StyledMapInteraction ref={containerRef}>
            {renderMapInteractionCSS}
            {renderControls}
        </StyledMapInteraction>
    );
};

const StyledMapInteraction = styled(Box)`
    flex-grow: 1;
    display: flex;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledMapInteractionCSS = styled(({ cursor, overflow, ...props }) => <Box {...props} />).attrs(
    ({ cursor, overflow }) => ({
        style: {
            cursor,
            overflow,
        },
    }),
)`
    flex-grow: 1;
    background-color: var(--gray-light);
    display: flex;
    justify-content: center;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledContainer = styled(({ transform, transformOrigin, width, ...props }) => <Box {...props} />).attrs(
    ({ transform, transformOrigin, width }) => ({
        style: {
            transform,
            transformOrigin,
            width,
        },
    }),
)``;
