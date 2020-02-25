import { Box, IconButton, Typography } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

interface Props {
    onClick: () => void;
    title?: string;
}

export const ModalHeader: React.FC<Props> = ({ onClick, title }) => (
    <StyledModalHeader>
        {!!title && <Typography variant="subtitle2">{title}</Typography>}
        <IconButton onClick={onClick}>
            <Close />
        </IconButton>
    </StyledModalHeader>
);

const StyledModalHeader = styled(Box)`
    display: flex;
    align-items: center;
    border-bottom: var(--border);

    .MuiTypography-root {
        margin-left: 0.5rem;
    }

    .MuiIconButton-root {
        margin-left: auto;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        padding-bottom: 0.5rem;
    }
`;
