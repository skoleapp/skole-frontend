import { Dialog } from '@material-ui/core';
import { useMediaQueries, useSettings } from 'hooks';
import { useTranslation } from 'lib';
import React from 'react';

import { ModalHeader } from '..';
import { Transition } from '../shared';

export const SettingsModal: React.FC = () => {
    const { t } = useTranslation();
    const { isMobileOrTablet, isDesktop } = useMediaQueries();
    const { renderSettingsMenuList, settingsOpen, toggleSettings } = useSettings(true);
    const handleClose = (): void => toggleSettings(false);
    const renderModalHeader = <ModalHeader onCancel={handleClose} text={t('common:settings')} />;

    return (
        <Dialog
            fullScreen={isMobileOrTablet}
            fullWidth={isDesktop}
            open={settingsOpen}
            onClose={handleClose}
            TransitionComponent={Transition}
        >
            {renderModalHeader}
            {renderSettingsMenuList}
        </Dialog>
    );
};
