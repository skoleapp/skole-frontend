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
// It will let the user zoom and pan the children by scaling and translating children using CSS.
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
                // Translate first and then scale. Otherwise, the scale would affect the translation.
                const transform = `translate(${translation.x}px, ${translation.y}px) scale(${scale})`;

                const mapInteractionProps = {
                    ctrlKey,
                    drawMode,
                    isMobile,
                };

                const containerProps = {
                    transform,
                    scale,
                };

                return (
                    <StyledMapInteractionCSS {...mapInteractionProps}>
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
    position: absolute;
    height: 100%;
    width: 100%;
    background-color: var(--gray-light);
`;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledContainer = styled(({ transform, scale, fullscreen, ...props }) => <Box {...props} />).attrs(
    ({ transform }) => ({
        style: {
            transform: transform,
        },
    }),
)`
    display: inline-block;
    transform-origin: 0 0;

    // .react-pdf__Page,
    // .react-pdf__Page__canvas {
    //     margin: 0 auto;
    //     height: auto !important;
    //     width: ${({ scale }): string => `calc(100% * ${scale})`} !important;
    // }
`;
