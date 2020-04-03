import { Drawer } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { toggleSettings } from '../../actions';
import { useTranslation } from '../../i18n';
import { State } from '../../types';
import { useDrawer, useSettings } from '../../utils';
import { ModalHeader } from '../shared';

export const Settings: React.FC = () => {
    const open = !!useSelector((state: State) => state.ui.settings);
    const { renderSettingsCardContent } = useSettings({ modal: true });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const { anchor } = useDrawer();
    const handleClose = (): AnyAction => dispatch((toggleSettings(false) as unknown) as AnyAction);
    const renderModalHeader = <ModalHeader onCancel={handleClose} title={t('common:settings')} />;

    return (
        <Drawer open={open} anchor={anchor} onClose={handleClose}>
            {renderModalHeader}
            {renderSettingsCardContent}
        </Drawer>
    );
};
