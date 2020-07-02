import { Box } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDeviceContext, usePDFViewerContext } from 'src/context';
import styled from 'styled-components';

import { MapInteractionProps, PDFTranslation } from '../../types';
import { MapInteraction } from '.';

interface ChildProps {
    translation: PDFTranslation;
    scale: number;
}

// This component provides a map like interaction to any content that you place in it.
// It will let the user zoom the children by scaling and translating children using CSS.
export const MapInteractionCSS: React.FC<Omit<MapInteractionProps, 'children'>> = props => {
    const { drawMode } = usePDFViewerContext();
    const isMobile = useDeviceContext();
    const [ctrlKey, setCtrlKey] = useState(false);

    // Change cursor mode when CTRL key is pressed.
    const onKeyDown = (e: KeyboardEvent): void => {
        if (e.ctrlKey) {
            setCtrlKey(true);
        }
    };

    // Reset cursor mode when CTRL key is released.
    const onKeyUp = (e: KeyboardEvent): void => {
        if (e.key == 'Control') {
            setCtrlKey(false);
        }
    };

    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('keyup', onKeyUp);

        return (): void => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('keyup', onKeyUp);
        };
    }, []);

    return (
        <MapInteraction {...props}>
            {({ translation, scale }: ChildProps): JSX.Element => {
                const mapInteractionProps = {
                    ctrlKey,
                    drawMode,
                    isMobile,
                };

                const containerProps = {
                    translation,
                    scale,
                };

                return (
                    <StyledMapInteractionCSS id="map-interaction" {...mapInteractionProps}>
                        <StyledContainer {...containerProps}>{props.children}</StyledContainer>
                    </StyledMapInteractionCSS>
                );
            }}
        </MapInteraction>
    );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledMapInteractionCSS = styled(({ ctrlKey, drawMode, isMobile, ...props }) => <Box {...props} />).attrs(
    ({ ctrlKey, drawMode, isMobile }) => ({
        style: {
            cursor: `${ctrlKey ? 'all-scroll' : 'inherit'}`, // On desktop show different cursor when CTRL key is pressed.
            overflow: `${drawMode && isMobile ? 'hidden' : 'auto'}`, // Disable scrolling when draw mode is on on mobile.
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
const StyledContainer = styled(({ translation, scale, fullscreen, ...props }) => <Box {...props} />).attrs(
    ({ translation, scale }) => ({
        style: {
            transform: `translate(${translation.x}px, ${translation.y}px) scale(${scale})`, // Translate first and then scale. Otherwise, the scale would affect the translation.
            width: `calc(100% * ${scale})`,
        },
    }),
)`
    position: absolute;
    flex-grow: 1;

    // When in fullscreen and zooming in from that, we set the transform origin to top left.
    // Otherwise we center the document.
    transform-origin: ${({ scale }): string => (scale < 1 ? '50% 0' : '0 0')};
`;
