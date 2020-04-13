import { Box, Grid, IconButton } from '@material-ui/core';
import { CloseOutlined } from '@material-ui/icons';
import React, { SyntheticEvent } from 'react';
import styled from 'styled-components';

import { useTranslation } from '../../i18n';
import { Heading } from './Heading';
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
                    {!!onCancel && (
                        <StyledTooltip title={t('common:closeMenuTooltip')}>
                            <IconButton onClick={onCancel} size="small">
                                <CloseOutlined />
                            </IconButton>
                        </StyledTooltip>
                    )}
                </Grid>
                {!!title && (
                    <Grid item container xs={8} justify="center">
                        <Heading text={title} />
                    </Grid>
                )}
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
