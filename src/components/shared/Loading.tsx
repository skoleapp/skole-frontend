import { Box, CircularProgress, FormHelperText } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';

interface Props {
    text?: string;
}

export const Loading: React.FC<Props> = ({ text }) => {
    const { t } = useTranslation();

    return (
        <Box flexGrow="1" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <CircularProgress color="primary" />
            <FormHelperText>{text || t('common:loading')}</FormHelperText>
        </Box>
    );
};
