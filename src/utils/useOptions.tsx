import { ListItemText, MenuItem } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { toggleNotification } from '../actions';
import { ModalHeader } from '../components';
import { useTranslation } from '../i18n';
import { Anchor, UseOptions } from '../types';

export const useOptions = (): UseOptions => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [optionsOpen, setOptionsOpen] = useState(false);
    const openOptions = (): void => setOptionsOpen(true);
    const closeOptions = (): void => setOptionsOpen(false);

    const handleShare = (e: SyntheticEvent): void => {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        dispatch(toggleNotification(t('notifications:linkCopied')));
        setOptionsOpen(false);
    };

    const renderOptionsHeader = <ModalHeader title={t('common:actions')} onCancel={closeOptions} />;

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

    const commonDrawerProps = {
        open: optionsOpen,
        onOpen: openOptions,
        onClose: closeOptions,
    };

    const mobileDrawerProps = {
        ...commonDrawerProps,
        className: 'md-down',
        anchor: 'bottom' as Anchor,
    };

    const desktopDrawerProps = {
        ...commonDrawerProps,
        className: 'md-up',
        anchor: 'left' as Anchor,
    };

    return {
        renderShareOption,
        renderReportOption,
        renderOptionsHeader,
        openOptions,
        closeOptions,
        mobileDrawerProps,
        desktopDrawerProps,
    };
};
