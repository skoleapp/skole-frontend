import React, { useEffect, useRef, useState } from 'react';

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

interface Props {
    onSelection: (startTarget: HTMLElement, boundingRect: LTWH, resetSelection: () => void) => void;
    onDragStart: () => void;
    onDragEnd: () => void;
    shouldStart: (event: MouseEvent) => boolean;
    onChange: (isVisible: boolean) => void;
}

export const MouseSelection: React.FC<Props> = ({ onSelection, onDragStart, onDragEnd, shouldStart, onChange }) => {
    const [state, setState] = useState<State>({
        locked: false,
        start: null,
        end: null,
    });

    const { start, end, locked } = state;
    const rootRef = useRef<HTMLDivElement>(null);

    const reset = (): void => {
        onDragEnd();
        setState({ start: null, end: null, locked: false });
    };

    const getBoundingRect = (start: Coords, end: Coords): LTWH => ({
        left: Math.min(end.x, start.x),
        top: Math.min(end.y, start.y),
        width: Math.abs(end.x - start.x),
        height: Math.abs(end.y - start.y),
    });

    useEffect(() => {
        const isVisible = !!start && !!end;
        onChange(isVisible);
    });

    const shouldRender = (boundingRect: LTWH): boolean => {
        return boundingRect.width >= 1 && boundingRect.height >= 1;
    };

    useEffect(() => {
        if (!rootRef.current) {
            return;
        }

        const container = rootRef.current.parentElement;

        if (!(container instanceof HTMLElement)) {
            return;
        }

        const containerCoords = (pageX: number, pageY: number): Coords => {
            const { left, top } = container.getBoundingClientRect();

            return {
                x: pageX - left + container.scrollLeft,
                y: pageY - top + container.scrollTop,
            };
        };

        container.addEventListener('mousemove', (event: MouseEvent) => {
            if (!start || locked) {
                return;
            }

            setState({
                ...state,
                end: containerCoords(event.pageX, event.pageY),
            });
        });

        container.addEventListener('mousedown', (event: MouseEvent) => {
            if (!shouldStart(event)) {
                reset();
                return;
            }

            const startTarget = event.target;

            if (!(startTarget instanceof HTMLElement)) {
                return;
            }

            onDragStart();

            setState({
                start: containerCoords(event.pageX, event.pageY),
                end: null,
                locked: false,
            });

            const onMouseUp = (e: MouseEvent): void => {
                // Emulate listen once.
                !!e.currentTarget && e.currentTarget.removeEventListener('mouseup', onMouseUp as EventListener);
                const { start } = state;

                if (!start) {
                    return;
                }

                const end = containerCoords(event.pageX, event.pageY);

                const boundingRect = getBoundingRect(start, end);

                if (
                    !(event.target instanceof HTMLElement) ||
                    !container.contains(event.target) ||
                    !shouldRender(boundingRect)
                ) {
                    reset();
                    return;
                }

                setState({
                    ...state,
                    end,
                    locked: true,
                });

                if (!start || !end) {
                    return;
                }

                if (event.target instanceof HTMLElement) {
                    onSelection(startTarget, boundingRect, reset);
                    onDragEnd();
                }
            };

            if (document.body) {
                document.body.addEventListener('mouseup', onMouseUp);
            }
        });
    });

    return (
        <div className="MouseSelection-container" ref={rootRef}>
            {start && end ? <div className="MouseSelection" style={getBoundingRect(start, end)} /> : null}
        </div>
    );
};
