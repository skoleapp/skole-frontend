import { Box, Grid, IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import { useTranslation } from 'src/i18n';
import styled from 'styled-components';

import { StyledHeaderText } from './StyledHeaderText';
import { StyledTooltip } from './StyledTooltip';

interface Props {
    title?: string;
    onCancel: (e: SyntheticEvent) => void;
    headerRight?: JSX.Element;
}

export const ModalHeader: React.FC<Props> = ({ title, onCancel, headerRight }) => {
    const { t } = useTranslation();

    return (
        <StyledModalHeader>
            <Grid container alignItems="center">
                <Grid item xs={2}>
                    <StyledTooltip title={t('common:close')}>
                        <IconButton onClick={onCancel} size="small">
                            <CloseOutlined />
                        </IconButton>
                    </StyledTooltip>
                </Grid>
                <Grid item container xs={8} justify="center">
                    <StyledHeaderText text={title} />
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
`;
