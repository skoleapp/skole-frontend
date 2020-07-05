import { Box } from '@material-ui/core';
import throttle from 'lodash.throttle';
import React, { useEffect, useState } from 'react';
import {
    defaultScale,
    defaultTranslation,
    getClampedScale,
    getCoordChange,
    getMidPoint,
    getTouchDistance,
    getTouchPoint,
    maxScale,
    minScale,
} from 'src/lib';
import { PDFTranslation } from 'src/types';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { MapControls } from '.';

interface StartPointersInfo {
    translation: PDFTranslation;
    scale: number;
    pointers: TouchList;
}

// TODO: Add a listener that updates the page number based on scroll position.
export const MapInteraction: React.FC = ({ children }) => {
    const isMobile = useDeviceContext();
    const { drawMode, setRotate, controlsDisabled, setPageNumber, pageNumberInputRef } = usePDFViewerContext();
    const [startPointersInfo, setStartPointersInfo] = useStateRef<StartPointersInfo | null>(null); // We must use a mutable ref object instead of immutable state to keep track with the start pointer state during gestures.
    const [scale, setScale] = useState(defaultScale);
    const [translation, setTranslation] = useState(defaultTranslation);
    const [ctrlKey, setCtrlKey] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);

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

    const getMapContainerNode = (): HTMLDivElement => document.querySelector('#map-container') as HTMLDivElement;
    const getMapContainerBoundingClientRect = (): DOMRect => getMapContainerNode().getBoundingClientRect();

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

    // Given the start touches and new e.touches, scale and translation such that the initial midpoint remains as the new midpoint.
    // This is to achieve the effect of keeping the content that was directly in the middle of the two fingers as the focal point throughout the zoom.
    // TODO: Improve this so that it wont cut out areas on the left of the zoom container.
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

    // Update document scale based on mouse wheel events.
    // TODO: Set Y-axis scroll position based on mouse position to we can zoom in to a point using mouse position.
    const onWheel = (e: WheelEvent): void => {
        if (e.ctrlKey) {
            setFullscreen(false);
            e.preventDefault(); // Disable scroll.
            const scaleChange = 2 ** (e.deltaY * 0.002);
            const newScale = getClampedScale(minScale, scale + (1 - scaleChange), maxScale);
            setScale(newScale);
            const mapContainerNode = getMapContainerNode();
            mapContainerNode.scrollLeft = (mapContainerNode.scrollWidth - mapContainerNode.clientWidth) / 2; // Automatically scroll to center.
        }
    };

    const elementInViewport = (el: Element): boolean => {
        const { bottom, right, top, left } = el.getBoundingClientRect();
        const { width: mapContainerWidth, top: mapContainerTop } = getMapContainerBoundingClientRect();
        return bottom >= 0 && right >= 0 && top <= mapContainerTop && left <= mapContainerWidth;
    };

    // Find current page from viewport and set page number according to it when page number input is not active.
    // This listener is so expensive to use that we throttle it to execute every 100 ms only.
    // TODO: Using intersection observers would probably lead to better performance: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API
    const pageListener = (): void => {
        if (!!pageNumberInputRef && document.activeElement !== pageNumberInputRef.current) {
            const page = Array.from(document.querySelectorAll('.react-pdf__Page')).find(elementInViewport);
            const newPageNumber = page && page.getAttribute('data-page-number');
            setPageNumber(Number(newPageNumber));
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
        // TODO: Add some animation so that the document `bounces` back to it's original state.
        if (scale < defaultScale) {
            setScale(defaultScale);
            setTranslation(defaultTranslation);
        }
    };

    const handleFullscreenButtonClick = (): void => {
        let scale;

        if (fullscreen) {
            scale = minScale;
        } else {
            scale = defaultScale;
        }

        setFullscreen(!fullscreen);
        setScale(scale);
        setTranslation(defaultTranslation);
    };

    const handleScale = (newScale: number): void => {
        setFullscreen(false);
        newScale == defaultScale && setFullscreen(true);
        setScale(newScale);
    };

    // Listen fot mouse and touch events to perform required CSS transforms for map interaction functions.
    // Some listeners are not passive on purpose as we want to manually prevent some default behavior such as scrolling.
    useEffect(() => {
        const mapContainerNode = getMapContainerNode();

        if (!drawMode) {
            mapContainerNode.addEventListener('wheel', onWheel);
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
    // Also listen for scroll and resize events to update the page number automatically.
    useEffect(() => {
        const mapContainerNode = getMapContainerNode();

        if (!drawMode && !controlsDisabled) {
            mapContainerNode.addEventListener('scroll', throttle(pageListener, 100), { passive: true });
            mapContainerNode.addEventListener('resize', throttle(pageListener, 100), { passive: true });
            document.addEventListener('keydown', onKeyDown, { passive: true });
            document.addEventListener('keyup', onKeyUp, { passive: true });
        }

        return (): void => {
            mapContainerNode.removeEventListener('scroll', pageListener as EventListener);
            mapContainerNode.removeEventListener('resize', pageListener as EventListener);
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    // When entering draw mode, reset scale/translation.
    useEffect(() => {
        if (drawMode) {
            setScale(defaultScale);
            setTranslation(defaultTranslation);
            setRotate(0);
            setFullscreen(true);
        }
    }, [drawMode]);

    const handleScaleUpButtonClick = (): void => handleScale(scale < maxScale ? scale + 0.05 : scale); // Scale up by 5% if under maximum limit.
    const handleScaleDownButtonClick = (): void => handleScale(scale > minScale ? scale - 0.05 : scale); // Scale down by 5% if over minimum limit.
    const cursor = drawMode ? 'pointer' : ctrlKey ? 'all-scroll' : 'default'; // On desktop show different cursor when CTRL key is pressed.
    const overflow = drawMode && isMobile ? 'hidden' : 'auto'; // Disable scrolling when draw mode is on on mobile.
    const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`; // Translate first and then scale. Otherwise, the scale would affect the translation.
    const transformOrigin = scale < 1 ? '50% 0' : '0 0'; // When in fullscreen and zooming in from that, we set the transform origin to top left. Otherwise we center the document.
    const width = `calc(100% * ${scale})`;
    const mapInteractionContainerProps = { cursor, overflow };
    const transformContainerProps = { transform, transformOrigin, width };

    const mapControlsProps = {
        handleFullscreenButtonClick,
        handleScaleUpButtonClick,
        handleScaleDownButtonClick,
        fullscreen,
        controlsDisabled,
    };

    const renderTransformContainer = <TransformContainer {...transformContainerProps}>{children}</TransformContainer>;
    const renderMapControls = !isMobile && !drawMode && <MapControls {...mapControlsProps} />;

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
