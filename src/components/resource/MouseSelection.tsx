import { Box } from '@material-ui/core';
import React, { useEffect } from 'react';
import { useStateRef } from 'src/utils';
import styled from 'styled-components';

import { usePDFViewerContext } from '../../context';
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
    const { drawMode, setDrawMode, setScreenshot } = usePDFViewerContext();
    const [stateRef, setState] = useStateRef<State>(initialState); // Need to use mutable ref instead of immutable state.
    const [drawingAllowedRef, setDrawingAllowedRef] = useStateRef(false);
    const { start, end } = stateRef.current;
    const reset = (): void => setState(initialState);

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

            // Update mutable state when mouse moves.
            const onMouseMove = (e: MouseEvent): void => {
                const { start, locked } = stateRef.current;

                if (!!start && !locked) {
                    setState({
                        ...stateRef.current,
                        end: containerCoords(e.pageX, e.pageY),
                    });
                }
            };

            // Call selection function when a valid rectangle is drawn.
            const onMouseDown = (e: MouseEvent): void => {
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

                    document.body.addEventListener('mouseup', onMouseUp);
                }
            };

            container.addEventListener('mousemove', onMouseMove as EventListener);
            container.addEventListener('mousedown', onMouseDown as EventListener);

            return (): void => {
                container.removeEventListener('mousemove', onMouseMove as EventListener);
                container.removeEventListener('mousedown', onMouseDown as EventListener);
            };
        }
    }, []);

    // Only toggle draw mode on here.
    useEffect(() => {
        const { start, end } = stateRef.current;
        const drawing = !!start && !!end;
        drawing && setDrawMode(drawing);
    }, [stateRef.current]);

    // Update mutable drawing allowed state based on context state.
    useEffect(() => {
        setDrawingAllowedRef(drawMode);

        if (!drawMode) {
            reset();
            setScreenshot(null);
        }
    }, [drawMode]);

    return drawMode && !!start && !!end ? <StyledMouseSelection style={getBoundingRect(start, end)} /> : null;
};

const StyledMouseSelection = styled(Box)`
    position: absolute;
    border: 0.05rem dashed #000000;
    background-color: rgba(252, 232, 151, 0.5);
`;
