import { DialogContent } from '@material-ui/core';
import { useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { DialogHeader } from '..';
import { SkoleDialog } from '../shared';

export const SettingsModal: React.FC = () => {
    const { t } = useTranslation();
    const { renderSettingsMenuList, settingsOpen, toggleSettings } = useSettings(true);
    const handleClose = (): void => toggleSettings(false);

    return (
        <SkoleDialog open={settingsOpen} onClose={handleClose}>
            <DialogHeader onCancel={handleClose} text={t('common:settings')} />
            <DialogContent>{renderSettingsMenuList}</DialogContent>
        </SkoleDialog>
    );
};
