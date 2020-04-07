import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';

export const Loading: React.FC = () => {
    const { t } = useTranslation();

    return (
        <Box display="flex" flexGrow="1" alignItems="center" justifyContent="center" height="100%" width="100%">
            <CircularProgress color="primary" />
            <Box marginLeft="1rem">
                <Typography>{t('common:loading')}</Typography>
            </Box>
        </Box>
    );
};
