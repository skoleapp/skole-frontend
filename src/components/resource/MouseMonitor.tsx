import React, { cloneElement, ReactElement, useEffect, useRef } from 'react';

interface Props {
    onMoveAway: () => void;
    paddingX: number;
    paddingY: number;
    children: ReactElement;
}

export const MouseMonitor: React.FC<Props> = ({ onMoveAway, paddingX, paddingY, children, ...props }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    const onMouseMove = ({ clientX, clientY }: MouseEvent): void => {
        if (!containerRef.current) {
            return;
        }

        // TODO: See if possible to optimize.
        const { left, top, width, height } = containerRef.current.getBoundingClientRect();

        const inBoundsX = clientX > left - paddingX && clientX < left + width + paddingX;

        const inBoundsY = clientY > top - paddingY && clientY < top + height + paddingY;

        const isNear = inBoundsX && inBoundsY;

        if (!isNear) {
            onMoveAway();
        }
    };

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);

        return (): void => {
            document.removeEventListener('mousemove', onMouseMove);
        };
    });

    return <div ref={containerRef}>{cloneElement(children, props)}</div>;
};
