import { Drawer } from '@material-ui/core';
import React from 'react';

import { useTranslation } from '../../i18n';
import { useDrawer, useSettings } from '../../utils';
import { ModalHeader } from '../shared';

export const SettingsModal: React.FC = () => {
    const { renderSettingsCardContent, settingsOpen, toggleSettings } = useSettings({ modal: true });
    const { t } = useTranslation();
    const { anchor } = useDrawer();
    const handleClose = (): void => toggleSettings(false);
    const renderModalHeader = <ModalHeader onCancel={handleClose} title={t('common:settings')} />;

    return (
        <Drawer open={settingsOpen} anchor={anchor} onClose={handleClose}>
            {renderModalHeader}
            {renderSettingsCardContent}
        </Drawer>
    );
};
