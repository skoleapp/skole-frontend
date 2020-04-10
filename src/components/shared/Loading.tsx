import { Box, CircularProgress, Typography } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';

interface Props {
    text?: string;
}

export const Loading: React.FC<Props> = ({ text }) => {
    const { t } = useTranslation();

    const loadingStatus = !!text ? text : t('common:loading');

    return (
        <Box position="absolute" display="flex" alignItems="center" justifyContent="center" height="100%" width="100%">
            <CircularProgress color="primary" />
            <Box marginLeft="1rem">
                <Typography>{loadingStatus}</Typography>
            </Box>
        </Box>
    );
};
