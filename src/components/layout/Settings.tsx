import { Drawer } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnyAction } from 'redux';

import { toggleSettings } from '../../actions';
import { useTranslation } from '../../i18n';
import { State } from '../../types';
import { useSettings } from '../../utils';
import { ModalHeader } from '../shared';

export const Settings: React.FC = () => {
    const { settings } = useSelector((state: State) => state.ui);
    const { renderSettingsCardContent } = useSettings({ modal: true });
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const handleOpen = (): AnyAction => dispatch((toggleSettings(true) as unknown) as AnyAction);
    const handleClose = (): AnyAction => dispatch((toggleSettings(false) as unknown) as AnyAction);
    const renderModalHeader = <ModalHeader onCancel={handleClose} title={t('common:settings')} />;

    const commonDrawerProps = {
        open: !!settings,
        onOpen: handleOpen,
        onClose: handleClose,
    };

    const renderMobileSettings = (
        <Drawer className="md-down" anchor="bottom" {...commonDrawerProps}>
            {renderModalHeader}
            {renderSettingsCardContent}
        </Drawer>
    );

    const renderDesktopSettings = (
        <Drawer className="md-up" anchor="left" {...commonDrawerProps}>
            {renderModalHeader}
            {renderSettingsCardContent}
        </Drawer>
    );

    return (
        <>
            {renderMobileSettings}
            {renderDesktopSettings}
        </>
    );
};
