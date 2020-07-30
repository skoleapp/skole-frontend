import { Box, Fab, Tooltip } from '@material-ui/core';
import { AddOutlined, FullscreenExitOutlined, FullscreenOutlined, RemoveOutlined } from '@material-ui/icons';
import { useTranslation } from 'lib';
import React from 'react';
import styled from 'styled-components';

interface Props {
    handleFullscreenButtonClick: () => void;
    handleScaleUpButtonClick: () => void;
    handleScaleDownButtonClick: () => void;
    fullscreen: boolean;
    controlsDisabled: boolean;
}

export const MapControls: React.FC<Props> = ({
    handleFullscreenButtonClick,
    handleScaleUpButtonClick,
    handleScaleDownButtonClick,
    fullscreen,
    controlsDisabled,
}) => {
    const { t } = useTranslation();

    const renderFullscreenButton = (
        <Tooltip title={fullscreen ? t('tooltips:exitFullscreen') : t('tooltips:enterFullscreen')}>
            <span>
                <Fab size="small" color="secondary" onClick={handleFullscreenButtonClick} disabled={controlsDisabled}>
                    {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </Fab>
            </span>
        </Tooltip>
    );

    const renderDownscaleButton = (
        <Tooltip title={t('tooltips:zoomIn')}>
            <span>
                <Fab size="small" color="secondary" onClick={handleScaleUpButtonClick} disabled={controlsDisabled}>
                    <AddOutlined />
                </Fab>
            </span>
        </Tooltip>
    );

    const renderUpscaleButton = (
        <Tooltip title={t('tooltips:zoomOut')}>
            <span>
                <Fab size="small" color="secondary" onClick={handleScaleDownButtonClick} disabled={controlsDisabled}>
                    <RemoveOutlined />
                </Fab>
            </span>
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
