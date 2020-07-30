import { Box, CircularProgress, Typography } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';
import styled from 'styled-components';

interface Props {
    text?: string;
}

export const LoadingBox: React.FC<Props> = ({ text }) => {
    const { t } = useTranslation();

    return (
        <StyledLoadingBox>
            <CircularProgress color="primary" disableShrink />
            <Box marginTop="0.5rem">
                <Typography variant="body2" color="textSecondary">
                    {text || t('loading:loadingText')}
                </Typography>
            </Box>
        </StyledLoadingBox>
    );
};

const StyledLoadingBox = styled(Box)`
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
