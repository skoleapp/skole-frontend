import React from 'react';

import { HighlightComment, LTWH } from '../../types';

interface Props {
    position: {
        boundingRect: LTWH;
        rects: LTWH[];
    };
    onClick?: () => void;
    onMouseOver?: () => void;
    onMouseOut?: () => void;
    comment: HighlightComment;
    isScrolledTo: boolean;
}

export const Highlight: React.FC<Props> = ({ position, onClick, onMouseOver, onMouseOut, comment, isScrolledTo }) => {
    const { rects, boundingRect } = position;

    return (
        <div className={`Highlight ${isScrolledTo ? 'Highlight--scrolledTo' : ''}`}>
            {comment ? (
                <div
                    style={{
                        left: 20,
                        top: boundingRect.top,
                    }}
                >
                    {comment.emoji}
                </div>
            ) : null}
            <div>
                {rects.map((rect, index) => (
                    <div
                        onMouseOver={onMouseOver}
                        onMouseOut={onMouseOut}
                        onClick={onClick}
                        key={index}
                        style={rect}
                        className={`Highlight__part`}
                    />
                ))}
            </div>
        </div>
    );
};
