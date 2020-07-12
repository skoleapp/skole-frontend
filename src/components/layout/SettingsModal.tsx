import { useDrawer, useSettings } from 'hooks';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { ModalHeader, StyledDrawer } from '..';

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
