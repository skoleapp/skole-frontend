import { Box, Fab, Tooltip } from '@material-ui/core';
import { AddOutlined, FullscreenExitOutlined, FullscreenOutlined, RemoveOutlined } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { MapInteractionProps, PDFTranslation } from '../../types';

type StartPointers = TouchList | MouseEvent[];
type MouseOrTouch = MouseEvent | Touch;

export const MapInteraction: React.FC<MapInteractionProps> = ({ translation, scale, onChange, children }) => {
    const { t } = useTranslation();
    const { drawMode } = usePDFViewerContext();
    const isMobile = useDeviceContext();
    const [fullscreen, setFullscreen] = useState(false);
    const [startPointers, setStartPointers] = useState<StartPointers>([]);
    const minScale = 0.75;
    const maxScale = 1.75;
    const minTransX = -Infinity;
    const maxTransX = Infinity;
    const minTransY = 0;
    const maxTransY = -Infinity;
    const defaultTranslation = { x: 0, y: 0 };

    const disableFullscreen = (): false | void => setFullscreen(fullscreen => fullscreen && false);

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

    const getContainerNode = (): HTMLDivElement => document.querySelector('#container') as HTMLDivElement;
    const getContainerBoundingClientRect = (): DOMRect => getContainerNode().getBoundingClientRect();
    const getMapInteractionNode = (): HTMLDivElement => document.querySelector('#map-interaction') as HTMLDivElement;

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
    const getCoordChange = (coordinate: number, scaleRatio: number): number => scaleRatio * coordinate - coordinate;

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
        const scaleRatio = newScale / scale;

        // Calculate mid points.
        const startMidpoint = getMidPoint(getTouchPoint(startPointers[0]), getTouchPoint(startPointers[1]));
        const newMidPoint = getMidPoint(getTouchPoint(newTouches[0]), getTouchPoint(newTouches[1]));

        // The amount we need to translate by in order for the mid point to stay in the middle (before thinking about scaling factor).
        const dragDelta = {
            x: newMidPoint.x - startMidpoint.x,
            y: newMidPoint.y - startMidpoint.y,
        };

        // The point originally in the middle of the fingers on the initial zoom start
        const focalPoint = getClientPosToTranslatedPos(startMidpoint);

        // The amount that the middle point has changed from this scaling
        const focalPtDelta = {
            x: getCoordChange(focalPoint.x, scaleRatio),
            y: getCoordChange(focalPoint.y, scaleRatio),
        };

        // Translation is the original translation, plus the amount we dragged, minus what the scaling will do to the focal point.
        // Subtracting the scaling factor keeps the midpoint in the middle of the touch points.
        const newTranslation = {
            x: translation.x - focalPtDelta.x + dragDelta.x,
            y: translation.y - focalPtDelta.y + dragDelta.y,
        };

        onChange({ scale: newScale, translation: getClampedTranslation(newTranslation) });
    };

    // Scale the document from a given point where cursor is upon mouse wheel press.
    const scaleFromPoint = (newScale: number, focalPoint: PDFTranslation): void => {
        const scaleRatio = newScale / scale;
        // const { width: containerWidth } = getContainerBoundingClientRect();

        // Prevent transform cutting areas when zooming in on desktop.
        if (newScale > 1.0) {
            // focalPoint.x = -containerWidth * scale;
            focalPoint.x = 0;
            focalPoint.y = defaultTranslation.y;
        } else {
            focalPoint.x = defaultTranslation.x;
        }

        const focalPointDelta = {
            x: getCoordChange(focalPoint.x, scaleRatio),
            y: getCoordChange(focalPoint.y, scaleRatio),
        };

        const newTranslation = {
            x: translation.x - focalPointDelta.x,
            y: translation.y - focalPointDelta.y,
        };

        onChange({ scale: newScale, translation: getClampedTranslation(newTranslation) });
    };

    // Update document scale based on mouse wheel events.
    const onWheel = (e: WheelEvent): void => {
        if (e.ctrlKey) {
            disableFullscreen();
            e.preventDefault(); // Disables scroll behavior.
            e.stopPropagation();
            const scaleChange = 2 ** (e.deltaY * 0.002);
            const newScale = getClampedScale(minScale, scale + (1 - scaleChange), maxScale);
            const mousePos = getClientPosToTranslatedPos({ x: 0, y: e.clientY });
            scaleFromPoint(newScale, mousePos);
        }
    };

    const onTouchStart = (e: TouchEvent): void => handleSetStartPointers(e.touches);

    const onMouseDown = (e: MouseEvent): void => {
        e.preventDefault();
        handleSetStartPointers([e]);
    };

    const onTouchMove = (e: TouchEvent): void => {
        e.preventDefault();
        const isPinchAction = e.touches.length === 2 && startPointers.length > 1;

        if (isPinchAction) {
            scaleFromMultiTouch(e);
        }
    };

    const onTouchEnd = (e: TouchEvent): void => handleSetStartPointers(e.touches);

    useEffect(() => {
        const containerNode = getContainerNode();

        if (!!containerNode) {
            // TODO: Add a listener that updates the page number based on scroll position.
            containerNode.addEventListener('wheel', onWheel as EventListener);
            containerNode.addEventListener('touchstart', onTouchStart as EventListener);
            containerNode.addEventListener('mousedown', onMouseDown as EventListener);
            containerNode.addEventListener('touchmove', onTouchMove as EventListener);
            containerNode.addEventListener('touchend', onTouchEnd as EventListener);

            return (): void => {
                containerNode.removeEventListener('wheel', onWheel as EventListener);
                containerNode.removeEventListener('touchstart', onTouchStart as EventListener);
                containerNode.removeEventListener('mousedown', onMouseDown as EventListener);
                containerNode.removeEventListener('touchmove', onTouchMove as EventListener);
                containerNode.removeEventListener('touchend', onTouchEnd as EventListener);
            };
        }
    }, [translation, scale]);

    // Automatically scroll to center when zooming in on desktop.
    useEffect(() => {
        const mapInteractionNode = getMapInteractionNode();
        mapInteractionNode.scrollLeft = (mapInteractionNode.scrollWidth - mapInteractionNode.clientWidth) / 2;
    }, [scale]);

    const toggleFullScreen = (): void => {
        let scale;

        if (fullscreen) {
            scale = minScale;
        } else {
            scale = 1.0;
        }

        setFullscreen(!fullscreen);
        onChange({ translation: defaultTranslation, scale });
    };

    // Scale up by 5% if under limit.
    const scaleUp = (): void => {
        disableFullscreen();
        const newScale = scale < maxScale ? scale + 0.05 : scale;
        scaleFromPoint(newScale, defaultTranslation);
    };

    // Scale down by 5% if over limit.
    const scaleDown = (): void => {
        disableFullscreen();
        const newScale = scale > minScale ? scale - 0.05 : scale;
        scaleFromPoint(newScale, defaultTranslation);
    };

    const renderFullscreenButton = (
        <Tooltip title={fullscreen ? t('tooltips:exitFullscreen') : t('tooltips:enterFullscreen')}>
            <Fab size="small" color="secondary" onClick={toggleFullScreen}>
                {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Fab>
        </Tooltip>
    );

    const renderDownscaleButton = (
        <Tooltip title={t('tooltips:zoomIn')}>
            <Fab size="small" color="secondary" onClick={scaleUp}>
                <AddOutlined />
            </Fab>
        </Tooltip>
    );

    const renderUpscaleButton = (
        <Tooltip title={t('tooltips:zoomOut')}>
            <Fab size="small" color="secondary" onClick={scaleDown}>
                <RemoveOutlined />
            </Fab>
        </Tooltip>
    );

    const renderControls = !isMobile && !drawMode && (
        <Box id="controls">
            {renderFullscreenButton}
            {renderDownscaleButton}
            {renderUpscaleButton}
        </Box>
    );

    // This is a little trick to allow the following UX:
    // We want the parent of this component to decide if elements inside the map are clickable.
    // Normally, you wouldn't want to trigger a click event when the user *drags* on an element (only if they click and then release w/o dragging at all).
    // However we don't want to assume this behavior here, so we call `preventDefault` and then let the parent check `e.defaultPrevented`.
    // That value being true means that we are signalling that a drag event ended, not a click.
    // const handleEventCapture = () => {};

    return (
        <StyledMapInteraction
            // onClickCapture={handleEventCapture}
            // onTouchEndCapture={handleEventCapture}
            id="container"
        >
            {children({ translation: getClampedTranslation(translation), scale })}
            {renderControls}
        </StyledMapInteraction>
    );
};

const StyledMapInteraction = styled(Box)`
    flex-grow: 1;
    display: flex;
    position: relative;

    #controls {
        position: absolute;
        bottom: 1rem;
        right: 1rem;
        display: flex;
        flex-direction: column;
        padding: 0.5rem;

        .MuiFab-root {
            margin: 0.5rem;
        }
    }
`;
