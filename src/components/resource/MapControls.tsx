import { Box, Fab, Tooltip } from '@material-ui/core';
import { AddOutlined, FullscreenExitOutlined, FullscreenOutlined, RemoveOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { usePDFViewerContext } from 'src/context';
import { PDFTranslation } from 'src/types';
import { defaultScale, defaultTranslation, maxScale, minScale } from 'src/utils';
import styled from 'styled-components';

interface Props {
    scaleFromPoint: (newScale: number, focalPoint: PDFTranslation) => void;
}

export const MapControls: React.FC<Props> = ({ scaleFromPoint }) => {
    const { t } = useTranslation();
    const { fullscreen, setFullscreen, scale, setScale, setTranslation } = usePDFViewerContext();

    const toggleFullScreen = (): void => {
        let scale;

        if (fullscreen) {
            scale = minScale;
        } else {
            scale = defaultScale;
        }

        setFullscreen(!fullscreen);
        setScale(scale);
        setTranslation(defaultTranslation);
    };

    const handleScale = (newScale: number): void => {
        setFullscreen(false);
        newScale == defaultScale && setFullscreen(true);
        scaleFromPoint(newScale, defaultTranslation);
    };

    const scaleUp = (): void => handleScale(scale < maxScale ? scale + 0.05 : scale); // Scale up by 5% if under maximum limit.
    const scaleDown = (): void => handleScale(scale > minScale ? scale - 0.05 : scale); // Scale down by 5% if over minimum limit.

    const renderFullscreenButton = (
        <Tooltip title={fullscreen ? t('tooltips:exitFullscreen') : t('tooltips:enterFullscreen')}>
            <Fab size="small" color="secondary" onClick={toggleFullScreen}>
                {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            </Fab>
        </Tooltip>
    );

    const renderDownscaleButton = (
        <Tooltip title={t('tooltips:zoomIn')}>
            <Fab size="small" color="secondary" onClick={scaleUp}>
                <AddOutlined />
            </Fab>
        </Tooltip>
    );

    const renderUpscaleButton = (
        <Tooltip title={t('tooltips:zoomOut')}>
            <Fab size="small" color="secondary" onClick={scaleDown}>
                <RemoveOutlined />
            </Fab>
        </Tooltip>
    );

    return (
        <StyledControls>
            {renderFullscreenButton}
            {renderDownscaleButton}
            {renderUpscaleButton}
        </StyledControls>
    );
};

const StyledControls = styled(Box)`
    position: absolute;
    bottom: 1rem;
    right: 1rem;
    display: flex;
    flex-direction: column;
    padding: 0.5rem;

    .MuiFab-root {
        margin: 0.5rem;
    }
`;
