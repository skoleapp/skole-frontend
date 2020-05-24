import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface Props {
    text?: string;
}

export const LoadingBox: React.FC<Props> = ({ text }) => {
    const { t } = useTranslation();

    return (
        <StyledLoadingBox>
            <CircularProgress color="primary" />
            <Box marginTop="0.5rem">
                <Typography variant="body2" color="textSecondary">
                    {text || t('common:loading')}
                </Typography>
            </Box>
        </StyledLoadingBox>
    );
};

const StyledLoadingBox = styled(Box)`
    flex-grow: 1;
    display: flex;
    flex-direction: center;
    justify-content: center;
`;
