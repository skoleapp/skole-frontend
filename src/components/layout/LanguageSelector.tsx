import { Drawer, MenuItem } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { toggleLanguageSelector } from '../../actions';
import { useTranslation } from '../../i18n';
import { State } from '../../types';
import { useDrawer, useLanguageSelector } from '../../utils';
import { ModalHeader, StyledList } from '../shared';

export const LanguageSelector: React.FC = () => {
    const { t, i18n } = useTranslation();
    const open = !!useSelector((state: State) => state.ui.languageSelector);
    const dispatch = useDispatch();
    const title = t('common:language');
    const { anchor } = useDrawer();
    const { languages, languageToFlag } = useLanguageSelector();

    const handleLanguageChange = (val: string) => (): void => {
        i18n.changeLanguage(val);
        dispatch(toggleLanguageSelector(false));
    };

    const handleClose = (): void => {
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

    return (
        <Drawer open={open} anchor={anchor} onClose={handleClose}>
            <ModalHeader title={title} onCancel={handleClose} />
            {renderLanguageList}
        </Drawer>
    );
};
