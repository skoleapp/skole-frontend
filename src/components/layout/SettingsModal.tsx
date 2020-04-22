import { Drawer } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';
import { useDrawer, useSettings } from '../../utils';
import { ModalHeader } from '../shared';

export const SettingsModal: React.FC = () => {
    const { t } = useTranslation();
    const { renderSettingsCardContent, settingsOpen, toggleSettings } = useSettings({ modal: true });
    const { anchor } = useDrawer(t('common:settings'));
    const handleClose = (): void => toggleSettings(false);
    const renderModalHeader = <ModalHeader onCancel={handleClose} text={t('common:settings')} />;

    return (
        <Drawer open={settingsOpen} anchor={anchor} onClose={handleClose}>
            {renderModalHeader}
            {renderSettingsCardContent}
        </Drawer>
    );
};
