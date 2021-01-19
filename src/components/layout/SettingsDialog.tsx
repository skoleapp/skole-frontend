import { useSettingsContext } from 'context';
import { useTranslation } from 'lib';
import React from 'react';

import { SettingsList } from '../settings';
import { DialogHeader, SkoleDialog } from '../shared';

export const SettingsDialog: React.FC = () => {
  const { t } = useTranslation();
  const { settingsDialogOpen, handleCloseSettingsDialog } = useSettingsContext();

  const renderDialogHeader = (
    <DialogHeader onCancel={handleCloseSettingsDialog} text={t('common:settings')} />
  );

  const renderSettingsList = <SettingsList dialog />;

  return (
    <SkoleDialog open={settingsDialogOpen} onClose={handleCloseSettingsDialog} list>
      {renderDialogHeader}
      {renderSettingsList}
    </SkoleDialog>
  );
};
