import { MenuItem, SwipeableDrawer } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toggleLanguageSelector } from '../../actions';
import { useTranslation } from '../../i18n';
import { State } from '../../types';
import { useLanguageSelector } from '../../utils';
import { ModalHeader, StyledList } from '../shared';

export const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
    const open = useSelector((state: State) => state.ui.languageSelector);
    const dispatch = useDispatch();
    const title = t('common:language');
    const { languages, languageToFlag } = useLanguageSelector();

    const handleLanguageChange = (val: string) => (): void => {
        i18n.changeLanguage(val);
        dispatch(toggleLanguageSelector(false));
    };

    const renderLanguageList = (
        <StyledList>
            {languages.map((l, i) => (
                <MenuItem key={i} onClick={handleLanguageChange(l.value)}>
                    {t(l.label)} {languageToFlag(l.code)}
                </MenuItem>
            ))}
        </StyledList>
    );

    const handleOpen = (): void => {
        dispatch(toggleLanguageSelector(true));
    };

    const handleClose = (): void => {
        dispatch(toggleLanguageSelector(false));
    };

    const renderMobileLanguageDrawer = (
        <SwipeableDrawer className="md-down" anchor="bottom" open={!!open} onOpen={handleOpen} onClose={handleClose}>
            <ModalHeader title={title} onCancel={handleClose} />
            {renderLanguageList}
        </SwipeableDrawer>
    );

    const renderDesktopLanguageDrawer = (
        <SwipeableDrawer className="md-up" anchor="left" open={!!open} onOpen={handleOpen} onClose={handleClose}>
            <ModalHeader title={title} onCancel={handleClose} />
            {renderLanguageList}
        </SwipeableDrawer>
    );

    return (
        <>
            {renderMobileLanguageDrawer}
            {renderDesktopLanguageDrawer}
        </>
    );
};
