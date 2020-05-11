import React, { SyntheticEvent } from 'react';
import { Rnd, RndDragCallback, RndResizeCallback } from 'react-rnd';

import { LTWH, ViewportHighlight } from '../../types';

interface Props {
    highlight: ViewportHighlight;
    onChange: (rect: LTWH) => void;
}

export const AreaHighlight: React.FC<Props> = ({ highlight, onChange, ...props }) => {
    const position = {
        x: highlight.position.boundingRect.left,
        y: highlight.position.boundingRect.top,
    };

    const size = {
        width: highlight.position.boundingRect.width,
        height: highlight.position.boundingRect.height,
    };

    const handleDragStop: RndDragCallback = (_, data) => {
        const boundingRect = {
            ...highlight.position.boundingRect,
            top: data.y,
            left: data.x,
        };

        onChange(boundingRect);
    };

    const handleResizeStop: RndResizeCallback = (_e, _dir, ref, _delta, position) => {
        const boundingRect = {
            top: position.y,
            left: position.x,
            width: ref.offsetWidth,
            height: ref.offsetHeight,
        };

        onChange(boundingRect);
    };

    const handleClick = (e: SyntheticEvent): void => {
        e.stopPropagation();
        e.preventDefault();
    };

    return (
        <Rnd
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            position={position}
            size={size}
            onClick={handleClick}
            {...props}
        />
    );
};
