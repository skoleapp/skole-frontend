import { ListItemText, MenuItem } from '@material-ui/core';
import { FlagOutlined, ShareOutlined } from '@material-ui/icons';
import React, { SyntheticEvent, useState } from 'react';
import { useDispatch } from 'react-redux';

import { toggleNotification } from '../actions';
import { ModalHeader } from '../components';
import { useTranslation } from '../i18n';

interface OptionProps {
    open: boolean;
    onOpen: (e: React.SyntheticEvent<Element, Event>) => void;
    onClose: (e: React.SyntheticEvent<Element, Event>) => void;
}

interface UseOptions {
    renderShareOption: JSX.Element;
    renderReportOption: JSX.Element;
    renderOptionsHeader: JSX.Element;
    optionsOpen: boolean;
    handleOpenOptions: (e: React.SyntheticEvent<Element, Event>) => void;
    handleCloseOptions: (e: React.SyntheticEvent<Element, Event>) => void;
    mobileOptionsProps: OptionProps;
    desktopOptionsProps: OptionProps;
}

export const useOptions = (): UseOptions => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [optionsOpen, setOptionsOpen] = useState(false);

    const handleOpenOptions = (e: SyntheticEvent): void => {
        e.stopPropagation();
        setOptionsOpen(true);
    };

    const handleCloseOptions = (e: SyntheticEvent): void => {
        e.stopPropagation();
        setOptionsOpen(false);
    };

    const handleShare = (): void => {
        navigator.clipboard.writeText(window.location.href);
        dispatch(toggleNotification(t('notifications:linkCopied')));
    };

    const renderOptionsHeader = (
        <ModalHeader title={t('common:actions')} onCancel={(): void => setOptionsOpen(false)} />
    );

    const renderShareOption = (
        <MenuItem>
            <ListItemText onClick={handleShare}>
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

    const commonOptionsProps = {
        open: !!optionsOpen,
        onOpen: handleOpenOptions,
        onClose: handleCloseOptions,
    };

    const mobileOptionsProps = {
        ...commonOptionsProps,
        className: 'md-down',
        anchor: 'bottom',
    };

    const desktopOptionsProps = {
        ...commonOptionsProps,
        className: 'md-up',
        anchor: 'left',
    };

    return {
        renderShareOption,
        renderReportOption,
        optionsOpen,
        renderOptionsHeader,
        handleOpenOptions,
        handleCloseOptions,
        mobileOptionsProps,
        desktopOptionsProps,
    };
};
