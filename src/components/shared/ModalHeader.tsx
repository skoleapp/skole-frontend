import { Box, Grid, IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';

import { Heading } from './Heading';

interface Props {
    title?: string;
    onCancel: () => void;
    headerRight?: JSX.Element;
}

export const ModalHeader: React.FC<Props> = ({ title, onCancel, headerRight }) => (
    <StyledModalHeader>
        <Grid container alignItems="center">
            <Grid item xs={1}>
                {!!onCancel && (
                    <IconButton onClick={onCancel} size="small">
                        <CloseOutlined />
                    </IconButton>
                )}
            </Grid>
            {!!title && (
                <Grid item container xs={!!headerRight ? 10 : 11} justify="center">
                    <Heading text={title} />
                </Grid>
            )}
            {!!headerRight && (
                <Grid item container xs={1} justify="flex-end">
                    {headerRight}
                </Grid>
            )}
        </Grid>
    </StyledModalHeader>
);

const StyledModalHeader = styled(Box)`
    display: flex;
    align-items: center;
    border-bottom: var(--border);
    padding: 0.5rem;
`;
