import React from 'react';

import { useTranslation } from '../../i18n';
import { useDrawer, useSettings } from '../../utils';
import { ModalHeader, StyledDrawer } from '../shared';

export const SettingsModal: React.FC = () => {
    const { t } = useTranslation();
    const { renderSettingsMenuList, settingsOpen, toggleSettings } = useSettings(true);
    const { anchor } = useDrawer(t('common:settings'));
    const handleClose = (): void => toggleSettings(false);
    const renderModalHeader = <ModalHeader onCancel={handleClose} text={t('common:settings')} />;

    return (
        <StyledDrawer fullHeight open={settingsOpen} anchor={anchor} onClose={handleClose}>
            {renderModalHeader}
            {renderSettingsMenuList}
        </StyledDrawer>
    );
};
