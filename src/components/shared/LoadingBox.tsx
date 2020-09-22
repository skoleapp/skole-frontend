import { Box, CircularProgress, Grid, Typography, useTheme } from '@material-ui/core';
import { useTranslation } from 'lib';
import React from 'react';

interface Props {
    text?: string;
}

export const LoadingBox: React.FC<Props> = ({ text }) => {
    const { spacing } = useTheme();
    const { t } = useTranslation();

    return (
        <Grid container direction="column" alignItems="center">
            <CircularProgress color="primary" disableShrink size={40} />
            <Box marginTop={spacing(2)}>
                <Typography variant="subtitle1" color="textSecondary">
                    {text || t('common:loading')}
                </Typography>
            </Box>
        </Grid>
    );
};
