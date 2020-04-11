import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';

interface Props {
    text?: string;
}

export const LoadingBox: React.FC<Props> = ({ text }) => {
    const { t } = useTranslation();

    return (
        <Box flexGrow="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress color="primary" />
            <Box marginTop="0.5rem">
                <Typography variant="body2" color="textSecondary">
                    {text || t('common:loading')}
                </Typography>
            </Box>
        </Box>
    );
};
