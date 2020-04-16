import { Backdrop, Box, IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import Image from 'material-ui-image';
import React from 'react';
import styled from 'styled-components';

import { useAttachmentViewerContext } from '../../context';
import { breakpoints } from '../../styles';
import { mediaURL } from '../../utils';

export const AttachmentViewer: React.FC = () => {
    const { attachment, toggleAttachmentViewer } = useAttachmentViewerContext();
    const handleClose = (): void => toggleAttachmentViewer(null);

    return (
        <StyledAttachmentViewer open={!!attachment} onClick={handleClose}>
            <IconButton onClick={handleClose}>
                <CloseOutlined />
            </IconButton>
            <Box id="image-container">
                <Image src={mediaURL(attachment as string)} />
            </Box>
        </StyledAttachmentViewer>
    );
};

const StyledAttachmentViewer = styled(Backdrop)`
    background-color: var(--dark-opacity) !important;
    z-index: 9999 !important;
    position: relative;

    #image-container {
        height: 100vh;
        width: 100vh;
        display: flex;

        > div {
            padding: 0 !important;
            flex-grow: 1;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            background-color: transparent !important;

            img {
                width: auto !important;
                height: auto !important;
                max-height: 75% !important;
                max-width: 100% !important;
                position: relative !important;
            }
        }

        @media only screen and (min-width: ${breakpoints.MD}) {
            padding: 10rem;
        }
    }

    .MuiIconButton-root {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        color: var(--white);
    }
`;
