import { Backdrop, Box, IconButton, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import { useDiscussionContext } from 'context';
import { useResponsiveIconButtonProps } from 'hooks';
import Image from 'material-ui-image';
import React from 'react';
import styled from 'styled-components';
import { breakpoints } from 'styles';
import { mediaURL } from 'utils';

export const AttachmentViewer: React.FC = () => {
    const { attachment, toggleAttachmentViewer } = useDiscussionContext();
    const attachmentName = attachment && attachment.split('/').pop();
    const { size } = useResponsiveIconButtonProps();
    const handleClose = (): void => toggleAttachmentViewer(null);

    return (
        <StyledAttachmentViewer open={!!attachment} onClick={handleClose}>
            <Box id="toolbar">
                <Typography className="truncate" variant="subtitle1" color="secondary">
                    {attachmentName}
                </Typography>
                <IconButton onClick={handleClose} size={size} color="secondary">
                    <CloseOutlined />
                </IconButton>
            </Box>
            <Box id="image-container">
                <Image src={mediaURL(attachment as string)} />
            </Box>
        </StyledAttachmentViewer>
    );
};

const StyledAttachmentViewer = styled(Backdrop)`
    background-color: var(--opacity-dark) !important;
    z-index: 9999 !important;
    display: flex;
    flex-direction: column;

    #toolbar {
        height: 3rem;
        width: 100%;
        padding: 0.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--black); // Applied on top of backdrop background.
    }

    #image-container {
        flex-grow: 1;
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
`;
