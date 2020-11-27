import { Box, makeStyles } from '@material-ui/core';
import { usePdfViewerContext } from 'context';
import { useMediaQueries, useStateRef } from 'hooks';
import { getClampedScale, getCoordChange, getMidPoint, getTouchDistance, getTouchPoint } from 'lib';
import throttle from 'lodash.throttle';
import React, { useEffect, useState } from 'react';
import { PdfTranslation } from 'types';
import { DEFAULT_SCALE, DEFAULT_TRANSLATION, MAX_SCALE, MIN_SCALE } from 'utils';

import { MapControls } from './MapControls';

const useStyles = makeStyles(({ palette }) => ({
  mapContainer: {
    flexGrow: 1,
    backgroundColor: palette.grey[600],
    display: 'flex',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bounceBack: {
    transform: 'none',
    transition: '0.5s ease-in-out',
  },
}));

interface StartPointersInfo {
  translation: PdfTranslation;
  scale: number;
  pointers: TouchList;
}

// This component adds map interaction functionality with mouse and touch events to its children.
// Inspired by: https://github.com/transcriptic/react-map-interaction
export const MapInteraction: React.FC = ({ children }) => {
  const classes = useStyles();
  const { isMobileOrTablet, isDesktop } = useMediaQueries();

  const {
    drawMode,
    setRotate,
    controlsDisabled,
    setPageNumber,
    pageNumberInputRef,
    setSwipingDisabled,
    swipeableViewsRef,
  } = usePdfViewerContext();

  const [startPointersInfo, setStartPointersInfo] = useStateRef<StartPointersInfo | null>(null); // We must use a mutable ref object instead of immutable state to keep track with the start pointer state during gestures.
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [translation, setTranslation] = useState(DEFAULT_TRANSLATION);
  const [ctrlKey, setCtrlKey] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [transformContainerClasses, setTransformContainerClasses] = useState('');

  // Change cursor mode when CTRL key is pressed.
  const onKeyDown = (e: KeyboardEvent): void => {
    if (e.ctrlKey) {
      setCtrlKey(true);
    }
  };

  // Reset cursor mode when CTRL key is released.
  const onKeyUp = (e: KeyboardEvent): void => {
    if (e.key === 'Control') {
      setCtrlKey(false);
    }
  };

  // Set mutable ref state to keep track of pointer state.
  const setPointerState = (pointers: TouchList): void => {
    if (pointers.length) {
      setStartPointersInfo({
        pointers,
        scale,
        translation,
      });
    }
  };

  const getMapContainerNode = (): HTMLDivElement =>
    document.querySelector('#map-container') as HTMLDivElement;

  const getMapContainerBoundingClientRect = (): DOMRect | ClientRect =>
    getMapContainerNode().getBoundingClientRect();

  // Return calculated translation from page.
  const getTranslatedOrigin = (translation: PdfTranslation): PdfTranslation => {
    const clientOffset = getMapContainerBoundingClientRect();

    return {
      x: clientOffset.left + translation.x,
      y: clientOffset.top + translation.y,
    };
  };

  // From a given screen point return it as a point in the coordinate system of the map interaction component.
  const getClientPosToTranslatedPos = (
    { x, y }: PdfTranslation,
    _translation: PdfTranslation = translation,
  ): PdfTranslation => {
    const origin = getTranslatedOrigin(_translation);

    return {
      x: x - origin.x,
      y: y - origin.y,
    };
  };

  // Given the start touches and new e.touches, scale and translation such that the initial midpoint remains as the new midpoint.
  // This is to achieve the effect of keeping the content that was directly in the middle of the two fingers as the focal point throughout the zoom.
  const scaleFromMultiTouch = (e: TouchEvent): void => {
    // Ignore: This function is only called when the start pointers info exists.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const {
      pointers: startTouches,
      scale: startScale,
      translation: startTranslation,
    } = startPointersInfo.current!;

    const newTouches = e.touches;

    // Calculate new scale.
    const dist0 = getTouchDistance(startTouches[0], startTouches[1]);
    const dist1 = getTouchDistance(newTouches[0], newTouches[1]);
    const scaleChange = dist1 / dist0;
    const targetScale = startScale + (scaleChange - 1) * startScale;
    const newScale = getClampedScale(targetScale);
    const scaleRatio = newScale / startScale;

    // Calculate mid points.
    const startMidpoint = getMidPoint(
      getTouchPoint(startTouches[0]),
      getTouchPoint(startTouches[1]),
    );
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

  // Change translation based on drag event.
  const onDrag = (pointer: Touch): void => {
    // Ignore: This function is only called when the start pointers info exists.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const { pointers: startTouches, translation: startTranslation } = startPointersInfo.current!;
    const startPointer = startTouches[0];
    const dragX = pointer.clientX - startPointer.clientX;
    const dragY = pointer.clientY - startPointer.clientY;

    const newTranslation = {
      x: startTranslation.x + dragX,
      y: startTranslation.y + dragY,
    };

    setTranslation(newTranslation);
  };

  // Set X-axis scroll to center when zooming in/out.
  const centerHorizontalScroll = (): void => {
    const mapContainerNode = getMapContainerNode();
    mapContainerNode.scrollLeft = (mapContainerNode.scrollWidth - mapContainerNode.clientWidth) / 2;
  };

  // Update document scale based on mouse wheel events.
  // TODO: Set Y-axis scroll position based on mouse position to we can zoom in to a point using mouse position.
  const onWheel = (e: WheelEvent): void => {
    if (e.ctrlKey) {
      setFullscreen(false);
      e.preventDefault(); // Prevent scrolling.
      const scaleChange = 2 ** (e.deltaY * 0.002);
      const newScale = getClampedScale(scale + (1 - scaleChange));
      setScale(newScale);
      centerHorizontalScroll();
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
    if (document.activeElement !== pageNumberInputRef.current) {
      const page = Array.from(document.querySelectorAll('.react-pdf__Page')).find(
        elementInViewport,
      );
      const newPageNumber = page && page.getAttribute('data-page-number');
      setPageNumber(Number(newPageNumber));
    }
  };

  const onTouchStart = (e: TouchEvent): void => {
    setTransformContainerClasses('');
    setPointerState(e.touches);
  };

  const onTouchMove = (e: TouchEvent): void => {
    if (startPointersInfo.current) {
      const isPinchAction = e.touches.length === 2 && startPointersInfo.current.pointers.length > 1;
      const isSwiping = swipeableViewsRef.current.state.isDragging;

      // Prevent swiping when pinching or panning as zoomed in.
      if (isPinchAction || translation !== DEFAULT_TRANSLATION) {
        setSwipingDisabled(true);
      }

      if (isPinchAction && !isSwiping) {
        e.preventDefault(); // Prevent scrolling.
        scaleFromMultiTouch(e);
      } else if (e.touches.length === 1 && scale > DEFAULT_SCALE) {
        e.preventDefault(); // Prevent scrolling.
        onDrag(e.touches[0]);
      }
    }
  };

  const onTouchEnd = (e: TouchEvent): void => {
    setPointerState(e.touches);
    setSwipingDisabled(false);

    // Reset original scale/translation if pinched out.
    if (scale < DEFAULT_SCALE) {
      setScale(DEFAULT_SCALE);
      setTranslation(DEFAULT_TRANSLATION);
      setTransformContainerClasses(classes.bounceBack);
    }
  };

  const handleFullscreenButtonClick = (): void => {
    let scale;

    if (fullscreen) {
      scale = MIN_SCALE;
    } else {
      scale = DEFAULT_SCALE;
    }

    setFullscreen(!fullscreen);
    setScale(scale);
    setTranslation(DEFAULT_TRANSLATION);
  };

  const handleScale = async (newScale: number): Promise<void> => {
    setFullscreen(false);
    newScale == DEFAULT_SCALE && setFullscreen(true);
    await setScale(newScale); // Wait until new scale has been applied and center horizontal scroll only after that to avoid lagginess.
    centerHorizontalScroll();
  };

  // Listen fot mouse and touch events to perform required CSS transforms for map interaction functions.
  // Some listeners are not passive on purpose as we want to manually prevent some default behavior such as scrolling.
  useEffect(() => {
    const mapContainerNode = getMapContainerNode();

    if (!drawMode && !controlsDisabled) {
      mapContainerNode.addEventListener('wheel', onWheel);

      mapContainerNode.addEventListener('touchstart', onTouchStart as EventListener, {
        passive: true,
      });

      mapContainerNode.addEventListener('touchmove', onTouchMove as EventListener);
      mapContainerNode.addEventListener('touchend', onTouchEnd as EventListener, { passive: true });
    }

    return (): void => {
      mapContainerNode.removeEventListener('wheel', onWheel as EventListener);
      mapContainerNode.removeEventListener('touchstart', onTouchStart as EventListener);
      mapContainerNode.removeEventListener('touchmove', onTouchMove as EventListener);
      mapContainerNode.removeEventListener('touchend', onTouchEnd as EventListener);
    };
  }, [scale, translation, drawMode, controlsDisabled]);

  // Listen for key presses in order to show different cursor when CTRL key is pressed.
  // Also listen for scroll and resize events to update the page number automatically.
  useEffect(() => {
    const mapContainerNode = getMapContainerNode();

    if (!drawMode && !controlsDisabled) {
      mapContainerNode.addEventListener('scroll', throttle(pageListener, 100), {
        passive: true,
      });
      mapContainerNode.addEventListener('resize', throttle(pageListener, 100), {
        passive: true,
      });
      document.addEventListener('keydown', onKeyDown, { passive: true });
      document.addEventListener('keyup', onKeyUp, { passive: true });
    }

    return (): void => {
      mapContainerNode.removeEventListener('scroll', pageListener as EventListener);
      mapContainerNode.removeEventListener('resize', pageListener as EventListener);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('keyup', onKeyUp);
    };
  }, [drawMode, controlsDisabled]);

  // When entering draw mode, reset scale/translation.
  useEffect(() => {
    if (drawMode) {
      setScale(DEFAULT_SCALE);
      setTranslation(DEFAULT_TRANSLATION);
      setRotate(0);
      setFullscreen(true);
    }
  }, [drawMode]);

  const handleScaleUpButtonClick = (): Promise<void> =>
    handleScale(scale < MAX_SCALE ? scale + 0.05 : scale); // Scale up by 5% if under maximum limit.

  const handleScaleDownButtonClick = (): Promise<void> =>
    handleScale(scale > MIN_SCALE ? scale - 0.05 : scale); // Scale down by 5% if over minimum limit.

  const cursor = !drawMode && ctrlKey ? 'all-scroll' : 'default'; // On desktop show different cursor when CTRL key is pressed.
  const overflow = drawMode && isMobileOrTablet ? 'hidden' : 'auto'; // Disable scrolling when draw mode is on on mobile.
  const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`; // Translate first and then scale. Otherwise, the scale would affect the translation.
  const transformOrigin = scale < 1 ? '50% 0' : '0 0'; // When in fullscreen and zooming in from that, we set the transform origin to top left. Otherwise we center the document.
  const width = `calc(100% * ${scale})`;
  const mapContainerStyle = { cursor, overflow };
  const transformContainerStyle = { transform, transformOrigin, width };

  const mapControlsProps = {
    handleFullscreenButtonClick,
    handleScaleUpButtonClick,
    handleScaleDownButtonClick,
    fullscreen,
    controlsDisabled,
  };

  const renderTransformContainer = (
    <Box className={transformContainerClasses} style={transformContainerStyle}>
      {children}
    </Box>
  );

  const renderMapControls = isDesktop && !drawMode && <MapControls {...mapControlsProps} />;

  return (
    <Box id="map-container" className={classes.mapContainer} style={mapContainerStyle}>
      {renderTransformContainer}
      {renderMapControls}
    </Box>
  );
};
