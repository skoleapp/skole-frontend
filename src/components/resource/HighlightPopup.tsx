import { Box } from '@material-ui/core';
import React, { useState } from 'react';

import { MouseMonitor } from './MouseMonitor';

interface Props {
    onMouseOver: (content: JSX.Element) => void;
    popupContent: JSX.Element;
    onMouseOut: () => void;
}

export const HighlightPopup: React.FC<Props> = ({ onMouseOver, popupContent, onMouseOut, children }) => {
    const [mouseIn, setMouseIn] = useState(false);
    const handleMouseOut = (): void => setMouseIn(false);
    const handleMoveAway = (): void | false => !mouseIn && onMouseOut();

    const handleMouseOver = (): void => {
        setMouseIn(true);

        onMouseOver(
            <MouseMonitor onMoveAway={handleMoveAway} paddingX={60} paddingY={30}>
                {popupContent}
            </MouseMonitor>,
        );
    };

    return (
        <Box onMouseOver={handleMouseOver} onMouseOut={handleMouseOut}>
            {children}
        </Box>
    );
};
