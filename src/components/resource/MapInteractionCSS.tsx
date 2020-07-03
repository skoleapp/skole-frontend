import { Box } from '@material-ui/core';
import React from 'react';
import styled from 'styled-components';

import { MapInteractionCSSProps } from '../../types';
import { MapInteractionController } from './MapInteractionController';

// This component provides a map like interaction to any content that you place in it.
// It will let the user zoom the children by scaling and translating children using CSS.
export const MapInteractionCSS: React.FC = ({ children }) => (
    <MapInteractionController>
        {({ translation, scale, drawMode, isMobile, ctrlKey }: MapInteractionCSSProps): JSX.Element => {
            const cursor = `${drawMode ? 'pointer' : ctrlKey ? 'all-scroll' : 'default'}`; // On desktop show different cursor when CTRL key is pressed.
            const overflow = `${drawMode && isMobile ? 'hidden' : 'auto'}`; // Disable scrolling when draw mode is on on mobile.
            const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`; // Translate first and then scale. Otherwise, the scale would affect the translation.
            const transformOrigin = scale < 1 ? '50% 0' : '0 0'; // When in fullscreen and zooming in from that, we set the transform origin to top left. Otherwise we center the document.
            const width = `calc(100% * ${scale})`;
            const mapInteractionProps = { cursor, overflow };
            const containerProps = { transform, transformOrigin, width };

            return (
                <StyledMapInteractionCSS id="map-interaction" {...mapInteractionProps}>
                    <StyledContainer {...containerProps}>{children}</StyledContainer>
                </StyledMapInteractionCSS>
            );
        }}
    </MapInteractionController>
);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledMapInteractionCSS = styled(({ cursor, overflow, ...props }) => <Box {...props} />).attrs(
    ({ cursor, overflow }) => ({
        style: {
            cursor,
            overflow,
        },
    }),
)`
    position: relative;
    flex-grow: 1;
    background-color: var(--gray-light);
    display: flex;
    justify-content: center;
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledContainer = styled(({ transform, transformOrigin, width, ...props }) => <Box {...props} />).attrs(
    ({ transform, transformOrigin, width }) => ({
        style: {
            transform,
            transformOrigin,
            width,
        },
    }),
)`
    position: absolute;
    flex-grow: 1;
`;
