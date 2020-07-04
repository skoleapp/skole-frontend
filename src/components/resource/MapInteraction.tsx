import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { PDFTranslation } from 'src/types';
import { defaultScale, defaultTranslation, maxScale, minScale, useStateRef } from 'src/utils';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { MapControls } from '.';

interface StartPointersInfo {
    translation: PDFTranslation;
    scale: number;
    pointers: TouchList;
}

// TODO: Add a listener that updates the page number based on scroll position.
// TODO: Find a way to improve the performance as the animations are now very slow.
// TODO: Improve mobile zoom so that it wont cut out areas on the left of the zoom container.
export const MapInteraction: React.FC = ({ children }) => {
    const isMobile = useDeviceContext();
    const [startPointersInfo, setStartPointersInfo] = useStateRef<StartPointersInfo | null>(null); // We must use a mutable ref object instead of immutable state to keep track with the start pointer state during gestures.

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

    const getMapContainerNode = (): HTMLDivElement => document.querySelector('#map-container') as HTMLDivElement;
    const getMapContainerBoundingClientRect = (): DOMRect => getMapContainerNode().getBoundingClientRect();

    // Get mid point between translation points.
    const getMidPoint = (p1: PDFTranslation, p2: PDFTranslation): PDFTranslation => ({
        x: (p1.x + p2.x) / 2,
        y: (p1.y + p2.y) / 2,
    });

    // Return calculated translation from page.
    const getTranslatedOrigin = (translation: PDFTranslation): PDFTranslation => {
        const clientOffset = getMapContainerBoundingClientRect();

        return {
            x: clientOffset.left + translation.x,
            y: clientOffset.top + translation.y,
        };
    };

    // From a given screen point return it as a point in the coordinate system of the map interaction component.
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
        const { pointers: startTouches, scale: startScale, translation: startTranslation } = startPointersInfo.current!;
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

        // The amount we need to translate by in order for the mid point to stay in the middle (before thinking about scaling factor).
        const dragDelta = {
            x: newMidPoint.x - startMidpoint.x,
            y: newMidPoint.y - startMidpoint.y,
        };

        // The point originally in the middle of the fingers on the initial zoom start.
        const focalPoint = getClientPosToTranslatedPos(startMidpoint, startTranslation);
        const { scrollTop } = getMapContainerNode();

        // The amount that the middle point has changed from this scaling.
        const focalPtDelta = {
            x: getCoordChange(focalPoint.x, scaleRatio),
            y: getCoordChange(focalPoint.y + scrollTop, scaleRatio),
        };

        // Translation is the original translation, plus the amount we dragged, minus what the scaling will do to the focal point.
        // Subtracting the scaling factor keeps the midpoint in the middle of the touch points.
        const newTranslation = {
            x: startTranslation.x - focalPtDelta.x + dragDelta.x,
            y: startTranslation.y - focalPtDelta.y + dragDelta.y,
        };

        setScale(newScale);
        setTranslation(newTranslation);
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
        setTranslation(newTranslation);
    };

    // Update document scale based on mouse wheel events.
    const onWheel = (e: WheelEvent): void => {
        if (e.ctrlKey) {
            setFullscreen(false);
            e.preventDefault(); // Disable scroll.
            const scaleChange = 2 ** (e.deltaY * 0.002);
            const newScale = getClampedScale(minScale, scale + (1 - scaleChange), maxScale);
            const { y: mousePosY } = getClientPosToTranslatedPos({ x: e.clientX, y: e.clientY });
            // Unlike on mobile, here we explicitly set X-axis focal point to 0 since we only care about Y-axis focal point.
            // This way we get similar scroll zoom behavior as on Google's PDF viewer.
            const mousePos = { x: defaultTranslation.x, y: mousePosY };
            scaleFromPoint(newScale, mousePos);
        }
    };

    const onTouchStart = (e: TouchEvent): void => setPointerState(e.touches);

    const onTouchMove = (e: TouchEvent): void => {
        if (!!startPointersInfo.current) {
            const isPinchAction = e.touches.length === 2 && startPointersInfo.current.pointers.length > 1;

            if (isPinchAction) {
                e.preventDefault(); // Prevent scrolling.
                scaleFromMultiTouch(e);
            }
        }
    };

    const onTouchEnd = (e: TouchEvent): void => {
        setPointerState(e.touches);

        // Reset original scale/translation if pinched out.
        if (scale < defaultScale) {
            setScale(defaultScale);
            setTranslation(defaultTranslation);
        }
    };

    useEffect(() => {
        const mapContainerNode = getMapContainerNode();

        // Automatically scroll to center when zooming in on desktop.
        if (!isMobile) {
            mapContainerNode.scrollLeft = (mapContainerNode.scrollWidth - mapContainerNode.clientWidth) / 2;
        }

        // Only apply listeners when not in draw mode.
        // Some listeners are not passive on purpose as we want to manually prevent some default behavior such as scrolling.
        if (!drawMode) {
            mapContainerNode.addEventListener('wheel', onWheel as EventListener);
            mapContainerNode.addEventListener('touchstart', onTouchStart as EventListener, { passive: true });
            mapContainerNode.addEventListener('touchmove', onTouchMove as EventListener);
            mapContainerNode.addEventListener('touchend', onTouchEnd as EventListener, { passive: true });
        }

        return (): void => {
            mapContainerNode.removeEventListener('wheel', onWheel as EventListener);
            mapContainerNode.removeEventListener('touchstart', onTouchStart as EventListener);
            mapContainerNode.removeEventListener('touchmove', onTouchMove as EventListener);
            mapContainerNode.removeEventListener('touchend', onTouchEnd as EventListener);
        };
    }, [scale, translation, drawMode]);

    // Listen for key presses in order to show different cursor when CTRL key is pressed.
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return (): void => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    const cursor = drawMode ? 'pointer' : ctrlKey ? 'all-scroll' : 'default'; // On desktop show different cursor when CTRL key is pressed.
    const overflow = drawMode && isMobile ? 'hidden' : 'auto'; // Disable scrolling when draw mode is on on mobile.
    const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`; // Translate first and then scale. Otherwise, the scale would affect the translation.
    const transformOrigin = scale < 1 ? '50% 0' : '0 0'; // When in fullscreen and zooming in from that, we set the transform origin to top left. Otherwise we center the document.
    const width = `calc(100% * ${scale})`;
    const mapInteractionContainerProps = { cursor, overflow };
    const transformContainerProps = { transform, transformOrigin, width };
    const renderTransformContainer = <TransformContainer {...transformContainerProps}>{children}</TransformContainer>;
    const renderMapControls = !isMobile && !drawMode && <MapControls scaleFromPoint={scaleFromPoint} />;

    return (
        <MapInteractionContainer id="map-container" {...mapInteractionContainerProps}>
            {renderTransformContainer}
            {renderMapControls}
        </MapInteractionContainer>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const MapInteractionContainer = styled(({ cursor, overflow, ...props }) => <Box {...props} />).attrs(
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
const TransformContainer = styled(({ transform, transformOrigin, width, ...props }) => <Box {...props} />).attrs(
    ({ transform, transformOrigin, width }) => ({
        style: {
            transform,
            transformOrigin,
            width,
        },
    }),
)``;
