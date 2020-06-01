import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

import { useDeviceContext, usePDFViewerContext } from '../../context';
import { LTWH } from '../../types';

interface Coords {
    x: number;
    y: number;
}

interface State {
    locked: boolean;
    start: Coords | null;
    end: Coords | null;
}

interface MouseSelectionProps {
    onSelection: (startTarget: HTMLElement, boundingRect: LTWH) => void;
}

const initialState = { start: null, end: null, locked: false };

export const MouseSelection: React.FC<MouseSelectionProps> = ({ onSelection }) => {
    const isMobile = useDeviceContext();
    const { drawMode, setDrawMode } = usePDFViewerContext();
    const [stateRef, setState] = useStateRef<State>(initialState); // Need to use mutable ref instead of immutable state.
    const [drawingAllowedRef, setDrawingAllowedRef] = useStateRef(false);
    const { start, end } = stateRef.current;
    const reset = (): void => setState(initialState);

    // Get rectangle coordinates on container element.
    const getBoundingRect = (start: Coords, end: Coords): LTWH => ({
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    });

    useEffect(() => {
        const container = document.querySelector('.react-pdf__Document');

        if (!!container) {
            // Get coordinates on container element.
            const containerCoords = (pageX: number, pageY: number): Coords => {
                const { left, top } = container.getBoundingClientRect();

                return {
                    x: pageX - left + container.scrollLeft,
                    y: pageY - top + container.scrollTop,
                };
            };

            // Update mutable state when mouse moves (desktop).
            const onMouseMove = (e: MouseEvent): void => {
                const { start, locked } = stateRef.current;

                if (!!start && !locked) {
                    setState({
                        ...stateRef.current,
                        end: containerCoords(e.pageX, e.pageY),
                    });
                }
            };

            // Call selection function when a valid rectangle is drawn (desktop).
            const onMouseDown = (e: MouseEvent): (() => void) | void => {
                const startTarget = e.target;

                const onMouseUp = (e: MouseEvent): void => {
                    const { start } = stateRef.current;
                    const { currentTarget } = e;

                    // Emulate listen once.
                    !!currentTarget && currentTarget.removeEventListener('mouseup', onMouseUp as EventListener);

                    if (!!start) {
                        const end = containerCoords(e.pageX, e.pageY);
                        const boundingRect = getBoundingRect(start, end);

                        if (container.contains(e.target as Node) && drawingAllowedRef.current) {
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
                            reset();
                        }
                    } else {
                        reset();
                    }
                };

                if (drawingAllowedRef.current) {
                    setState({
                        start: containerCoords(e.pageX, e.pageY),
                        end: null,
                        locked: false,
                    });

                    document.body.addEventListener('mouseup', onMouseUp as EventListener);

                    return (): void => {
                        document.body.removeEventListener('mouseup', onMouseUp as EventListener);
                    };
                }
            };

            // Update mutable state when touch moves (mobile).
            const onTouchMove = (e: TouchEvent): void => {
                const { start, locked } = stateRef.current;

                if (!!start && !locked) {
                    setState({
                        ...stateRef.current,
                        end: containerCoords(e.changedTouches[0].pageX, e.changedTouches[0].pageY),
                    });
                }
            };

            // Call selection function when a valid rectangle is drawn (mobile).
            const onTouchStart = (e: TouchEvent): (() => void) | void => {
                const startTarget = e.target;

                const onTouchUp = (e: TouchEvent): void => {
                    const { start } = stateRef.current;
                    const { currentTarget } = e;

                    // Emulate listen once.
                    !!currentTarget && currentTarget.removeEventListener('mouseup', onTouchUp as EventListener);

                    if (!!start) {
                        const end = containerCoords(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
                        const boundingRect = getBoundingRect(start, end);

                        if (container.contains(e.target as Node) && drawingAllowedRef.current) {
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
                            reset();
                        }
                    } else {
                        reset();
                    }
                };

                if (drawingAllowedRef.current) {
                    setState({
                        start: containerCoords(e.targetTouches[0].pageX, e.targetTouches[0].pageY),
                        end: null,
                        locked: false,
                    });

                    document.body.addEventListener('touchend', onTouchUp as EventListener);

                    return (): void => {
                        document.body.removeEventListener('touchend', onTouchUp as EventListener);
                    };
                }
            };

            if (isMobile) {
                container.addEventListener('touchmove', onTouchMove as EventListener);
                container.addEventListener('touchstart', onTouchStart as EventListener);

                return (): void => {
                    container.removeEventListener('touchmove', onTouchMove as EventListener);
                    container.removeEventListener('touchstart', onTouchStart as EventListener);
                };
            } else {
                container.addEventListener('mousemove', onMouseMove as EventListener);
                container.addEventListener('mousedown', onMouseDown as EventListener);

                return (): void => {
                    container.removeEventListener('mousemove', onMouseMove as EventListener);
                    container.removeEventListener('mousedown', onMouseDown as EventListener);
                };
            }
        }
    }, [isMobile]);

    // Update mutable drawing allowed state based on context state.
    useEffect(() => {
        setDrawingAllowedRef(drawMode);

        // Draw mode manually toggle off.
        if (!drawMode) {
            reset();
            // setScreenshot(null);
        }
    }, [drawMode]);

    useEffect(() => {
        // Reset when demounting.
        return (): void => {
            reset();
            // setScreenshot(null);
            setDrawMode(false);
        };
    }, []);

    return drawMode && !!start && !!end ? <StyledMouseSelection style={getBoundingRect(start, end)} /> : null;
};

const StyledMouseSelection = styled(Box)`
    position: absolute;
    border: 0.05rem dashed #000000;
    background-color: rgba(173, 54, 54, 0.5); // Primary color with opacity.
`;
