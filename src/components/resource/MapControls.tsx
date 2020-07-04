import { Box, Fab, Tooltip } from '@material-ui/core';
import { AddOutlined, FullscreenExitOutlined, FullscreenOutlined, RemoveOutlined } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface Props {
    handleFullscreenButtonClick: () => void;
    handleScaleUpButtonClick: () => void;
    handleScaleDownButtonClick: () => void;
    fullscreen: boolean;
    disabled: boolean;
}

export const MapControls: React.FC<Props> = ({
    handleFullscreenButtonClick,
    handleScaleUpButtonClick,
    handleScaleDownButtonClick,
    fullscreen,
    disabled,
}) => {
    const { t } = useTranslation();

    const renderFullscreenButton = (
        <Tooltip title={fullscreen ? t('tooltips:exitFullscreen') : t('tooltips:enterFullscreen')}>
            <span>
                <Fab size="small" color="secondary" onClick={handleFullscreenButtonClick} disabled={disabled}>
                    {fullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
                </Fab>
            </span>
        </Tooltip>
    );

    const renderDownscaleButton = (
        <Tooltip title={t('tooltips:zoomIn')}>
            <span>
                <Fab size="small" color="secondary" onClick={handleScaleUpButtonClick} disabled={disabled}>
                    <AddOutlined />
                </Fab>
            </span>
        </Tooltip>
    );

    const renderUpscaleButton = (
        <Tooltip title={t('tooltips:zoomOut')}>
            <span>
                <Fab size="small" color="secondary" onClick={handleScaleDownButtonClick} disabled={disabled}>
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
