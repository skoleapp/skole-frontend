import { ListItem, ListItemText } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import React from 'react';
import { useDispatch } from 'react-redux';

import { toggleNotification } from '../actions';
import { useTranslation } from '../i18n';

interface UseOptions {
    renderShareOption: JSX.Element;
    renderReportOption: JSX.Element;
}

export const useOptions = (): UseOptions => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const handleShare = (): void => {
        navigator.clipboard.writeText(window.location.href);
        dispatch(toggleNotification(t('notifications:linkCopied')));
    };

    const renderShareOption = (
        <ListItem>
            <ListItemText onClick={handleShare}>
                <ShareOutlined /> {t('common:share')}
            </ListItemText>
        </ListItem>
    );

    const renderReportOption = (
        <ListItem disabled>
            <ListItemText>
                <FlagOutlined /> {t('common:reportAbuse')}
            </ListItemText>
        </ListItem>
    );

    return { renderShareOption, renderReportOption };
};
