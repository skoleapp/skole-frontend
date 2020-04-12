import { ListItemText, MenuItem } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import * as R from 'ramda';
import React, { SyntheticEvent } from 'react';

import { useSkoleContext } from '../context';
import { useTranslation } from '../i18n';
import { UseOptions } from '../types';
import { useDrawer } from './useDrawer';

export const useOptions = (): UseOptions => {
    const { t } = useTranslation();
    const { toggleNotification } = useSkoleContext();
    const drawerProps = useDrawer(t('common:actions'));
    const { onClose, renderHeader: renderOptionsHeader } = drawerProps;

    const handleShare = (e: SyntheticEvent): void => {
        navigator.clipboard.writeText(window.location.href);
        toggleNotification(t('notifications:linkCopied'));
        onClose(e);
    };

    const renderShareOption = (
        <MenuItem onClick={handleShare}>
            <ListItemText>
                <ShareOutlined /> {t('common:share')}
            </ListItemText>
        </MenuItem>
    );

    const renderReportOption = (
        <MenuItem disabled>
            <ListItemText>
                <FlagOutlined /> {t('common:reportAbuse')}
            </ListItemText>
        </MenuItem>
    );

    return {
        renderShareOption,
        renderReportOption,
        drawerProps: R.omit(['renderHeader'], drawerProps),
        renderOptionsHeader,
    };
};
