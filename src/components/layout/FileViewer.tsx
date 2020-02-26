import { Backdrop, Box, IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import Image from 'material-ui-image';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';
import styled from 'styled-components';

import { toggleFileViewer } from '../../actions';
import { breakpoints } from '../../styles';
import { State } from '../../types';
import { mediaURL } from '../../utils';

export const FileViewer: React.FC = () => {
    const { file } = useSelector((state: State) => state.ui);
    const dispatch = useDispatch();
    const handleClose = (): AnyAction => dispatch((toggleFileViewer(null) as unknown) as AnyAction);

    return (
        <StyledFileViewer open={!!file} onClick={handleClose}>
            <IconButton onClick={handleClose}>
                <CloseOutlined />
            </IconButton>
            <Box id="file-container">
                <Image src={mediaURL(file as string)} />
            </Box>
        </StyledFileViewer>
    );
};

const StyledFileViewer = styled(Backdrop)`
    background-color: var(--dark-opacity) !important;
    z-index: 9999 !important;
    display: flex;
    position: relative;

    #file-container {
        flex-grow: 1;

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
