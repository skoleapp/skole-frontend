import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { usePdfViewerContext } from 'context';
import { useStateRef } from 'hooks';
import { getBoundingRect, getPageFromElement } from 'lib';
import React, { useEffect } from 'react';
import { LTWH, PdfTranslation } from 'types';

const useStyles = makeStyles({
  root: {
    position: 'absolute',
    backgroundColor: 'rgba(173, 54, 54, 0.5)', // Primary color with opacity.
  },
});

interface State {
  locked: boolean;
  start: PdfTranslation | null;
  end: PdfTranslation | null;
}

const initialState = { start: null, end: null, locked: false };

// This component allows the user to mark areas with a rectangle and take screenshots from the PDF document based on the marked area.
// Inspired by: https://github.com/agentcooper/react-pdf-highlighter
// TODO: Add a listener that cancels the draw mode from ESC key.
export const AreaSelection: React.FC = () => {
  const classes = useStyles();
  const { setScreenshot, drawMode } = usePdfViewerContext();
  const [stateRef, setState] = useStateRef<State>(initialState); // We must use a mutable ref object instead of immutable state to keep track with the state during gestures and mouse selection.
  const { start, end } = stateRef.current;

  // Ignore: Document node is always defined even if the PDF fails to load.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const getDocumentNode = (): Element => document.querySelector('.react-pdf__Document')!;

  // Get closest PDF page and take screenshot of selected area.
  // FIXME: Screenshots from this function end up being misaligned.
  // It clearly has something to do with the `window.devicePixelRatio` function since it messes up the dimensions.
  const getScreenshot = (target: HTMLElement, position: LTWH): string | null => {
    const { left, top, width, height } = position;
    const canvas = target.closest('canvas');
    const newCanvas = document.createElement('canvas');
    const newCanvasContext = newCanvas.getContext('2d');

    if (!!canvas && !!newCanvasContext && !!width && !!height) {
      newCanvas.width = width;
      newCanvas.height = height;
      const dpr = window.devicePixelRatio;
      newCanvasContext.drawImage(
        canvas,
        left * dpr,
        top * dpr,
        width * dpr,
        height * dpr,
        0,
        0,
        width,
        height,
      );
      return newCanvas.toDataURL();
    }
    return null;
  };

  const onSelection = (startTarget: HTMLElement, boundingRect: LTWH): void => {
    const page = getPageFromElement(startTarget);

    if (page) {
      const pageBoundingRect = {
        ...boundingRect,
        top: boundingRect.top - page.node.offsetTop,
        left: boundingRect.left - page.node.offsetLeft,
      };

      const screenshot = getScreenshot(startTarget, pageBoundingRect);
      setScreenshot(screenshot);
    }
  };

  // Get coordinates on document node.
  const getDocumentCoords = (pageX: number, pageY: number): PdfTranslation => {
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
        end: getDocumentCoords(e.pageX, e.pageY),
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

      if (start) {
        const end = getDocumentCoords(e.pageX, e.pageY);
        const boundingRect = getBoundingRect(start, end);

        if (documentNode.contains(e.target as Node)) {
          // Lock state.
          setState({
            ...stateRef.current,
            end,
            locked: true,
          });

          if (end) {
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
      start: getDocumentCoords(e.pageX, e.pageY),
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
        end: getDocumentCoords(e.changedTouches[0].pageX, e.changedTouches[0].pageY),
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

      if (start) {
        const end = getDocumentCoords(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        const boundingRect = getBoundingRect(start, end);

        if (documentNode.contains(e.target as Node)) {
          // Lock state.
          setState({
            ...stateRef.current,
            end,
            locked: true,
          });

          if (end) {
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
      start: getDocumentCoords(e.targetTouches[0].pageX, e.targetTouches[0].pageY),
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

    // Only apply listeners when in draw mode.
    // Some listeners are not passive on purpose as we want to manually prevent some default behavior such as scrolling.
    if (drawMode) {
      documentNode.addEventListener('touchmove', onTouchMove as EventListener);
      documentNode.addEventListener('touchstart', onTouchStart as EventListener);

      documentNode.addEventListener('mousemove', onMouseMove as EventListener, {
        passive: true,
      });

      documentNode.addEventListener('mousedown', onMouseDown as EventListener, {
        passive: true,
      });
    } else {
      setState(initialState); // Reset area selection when draw mode is toggled off.
    }

    return (): void => {
      documentNode.removeEventListener('touchmove', onTouchMove as EventListener);
      documentNode.removeEventListener('touchstart', onTouchStart as EventListener);
      documentNode.removeEventListener('mousemove', onMouseMove as EventListener);
      documentNode.removeEventListener('mousedown', onMouseDown as EventListener);
    };
  }, [drawMode]);

  return drawMode && !!start && !!end ? (
    <Box className={clsx('screenshot-border', classes.root)} style={getBoundingRect(start, end)} />
  ) : null;
};
