import { Dialog, DialogContent } from '@material-ui/core';
import { useMediaQueries, useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { DialogHeader } from '..';
import { Transition } from '../shared';

export const SettingsModal: React.FC = () => {
    const { t } = useTranslation();
    const { isMobileOrTablet, isDesktop } = useMediaQueries();
    const { renderSettingsMenuList, settingsOpen, toggleSettings } = useSettings(true);
    const handleClose = (): void => toggleSettings(false);

    return (
        <Dialog
            fullScreen={isMobileOrTablet}
            fullWidth={isDesktop}
            open={settingsOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            <DialogHeader onCancel={handleClose} text={t('common:settings')} />
            <DialogContent>{renderSettingsMenuList}</DialogContent>
        </Dialog>
    );
};
