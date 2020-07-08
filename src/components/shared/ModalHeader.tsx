import { Box, Grid, IconButton, Tooltip } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { StyledHeaderText } from './StyledHeaderText';

interface Props {
    text?: string;
    onCancel: (e: SyntheticEvent) => void;
    headerRight?: JSX.Element;
}

export const ModalHeader: React.FC<Props> = ({ text, onCancel, headerRight }) => {
    const { t } = useTranslation();

    return (
        <StyledModalHeader>
            <Grid container alignItems="center">
                <Grid item xs={2}>
                    <Tooltip title={t('common:close')}>
                        <IconButton onClick={onCancel} size="small">
                            <CloseOutlined />
                        </IconButton>
                    </Tooltip>
                </Grid>
                <Grid item container xs={8} justify="center">
                    <StyledHeaderText text={text} />
                </Grid>
                <Grid item container xs={2} justify="flex-end">
                    {headerRight}
                </Grid>
            </Grid>
        </StyledModalHeader>
    );
};

const StyledModalHeader = styled(Box)`
    display: flex;
    align-items: center;
    border-bottom: var(--border);
    padding: 0.5rem;
    padding-bottom: 1rem;
`;
