import { Box, Grid, IconButton, Typography } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../styles';

interface Props {
    title?: string;
    onCancel: () => void;
    headerRight?: JSX.Element;
}

export const ModalHeader: React.FC<Props> = ({ title, onCancel, headerRight }) => (
    <StyledModalHeader>
        <Grid container alignItems="center">
            <Grid item xs={2}>
                {!!onCancel && (
                    <IconButton onClick={onCancel}>
                        <CloseOutlined />
                    </IconButton>
                )}
            </Grid>
            <Grid item container xs={8} justify="center">
                <Typography variant="h2">{title}</Typography>
            </Grid>
            <Grid item xs={2}>
                {headerRight}
            </Grid>
        </Grid>
    </StyledModalHeader>
);

const StyledModalHeader = styled(Box)`
    display: flex;
    align-items: center;
    border-bottom: var(--border);

    .MuiTypography-root {
        margin-left: 0.5rem;
    }

    @media only screen and (min-width: ${breakpoints.MD}) {
        padding: 0.5rem;
    }
`;
